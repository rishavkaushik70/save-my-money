import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { SubscriptionTier, SubscriptionStatus } from "@/generated/prisma/client";

interface RazorpaySubscriptionEntity {
  id: string;
  plan_id: string;
  status: string;
  current_start?: number;
  current_end?: number;
  notes?: Record<string, string>;
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("Razorpay webhook received but RAZORPAY_WEBHOOK_SECRET is not configured.");
    return NextResponse.json(
      { error: "Webhook secret is not configured on the server." },
      { status: 500 }
    );
  }

  const signature = req.headers.get("x-razorpay-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing x-razorpay-signature header." },
      { status: 400 }
    );
  }

  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch (err) {
    console.error("Failed to read raw webhook body:", err);
    return NextResponse.json({ error: "Failed to read request body." }, { status: 400 });
  }

  // 1. Verify Cryptographic HMAC SHA256 Signature
  const isValid = verifyWebhookSignature({
    rawBody,
    signature,
    webhookSecret,
  });

  if (!isValid) {
    console.warn("Invalid Razorpay webhook signature received.");
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  let payload: {
    event: string;
    account_id?: string;
    payload?: {
      subscription?: {
        entity?: RazorpaySubscriptionEntity;
      };
      payment?: {
        entity?: {
          id: string;
          status: string;
          amount: number;
        };
      };
    };
  };

  try {
    payload = JSON.parse(rawBody);
  } catch (err) {
    console.error("Malformed JSON in webhook payload:", err);
    return NextResponse.json({ error: "Malformed JSON payload." }, { status: 400 });
  }

  const subEntity = payload.payload?.subscription?.entity;
  const subId = subEntity?.id || "unknown";

  // Generate deterministic event identifier for idempotency (same signature = same payload)
  const eventId =
    req.headers.get("x-razorpay-event-id") ||
    `${payload.event}_${subId}_${signature.slice(0, 32)}`;

  // 2. Strict Idempotency Check
  const existingEvent = await prisma.webhookEvent.findUnique({
    where: { eventId },
  });

  if (existingEvent) {
    return NextResponse.json({
      received: true,
      idempotent: true,
      message: "Event already processed.",
    });
  }

  // Record webhook event in DB
  try {
    await prisma.webhookEvent.create({
      data: {
        eventId,
        eventType: payload.event,
        provider: "razorpay",
        payload: payload as object,
      },
    });
  } catch (recordErr) {
    console.warn("Could not record webhook idempotency entry:", recordErr);
  }

  if (!subEntity?.id) {
    // Event may be payment-only or unrelated; acknowledge 200
    return NextResponse.json({ received: true, ignored: true });
  }

  const currentStart = subEntity.current_start ? new Date(subEntity.current_start * 1000) : null;
  const currentEnd = subEntity.current_end ? new Date(subEntity.current_end * 1000) : null;
  const customerId = (subEntity as { customer_id?: string }).customer_id || null;

  // Retrieve current subscription record from DB to preserve tier if notes are absent in webhook
  const existingSub = await prisma.subscription.findFirst({
    where: { providerSubscriptionId: subId },
  });

  const noteTierRaw = subEntity.notes?.tier?.toUpperCase();
  const effectiveTier: SubscriptionTier =
    noteTierRaw === "PRO" || noteTierRaw === "PREMIUM"
      ? (noteTierRaw as SubscriptionTier)
      : (existingSub?.tier ?? SubscriptionTier.PRO);

  // 3. Process Subscription Lifecycle Events
  try {
    switch (payload.event) {
      case "subscription.authenticated": {
        await prisma.subscription.updateMany({
          where: { providerSubscriptionId: subId },
          data: {
            status: SubscriptionStatus.AUTHENTICATED,
            tier: effectiveTier,
            providerCustomerId: customerId ?? existingSub?.providerCustomerId,
            currentPeriodStart: currentStart ?? new Date(),
            currentPeriodEnd: currentEnd ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            cancelAtPeriodEnd: false,
          },
        });
        break;
      }

      case "subscription.activated":
      case "subscription.charged": {
        await prisma.subscription.updateMany({
          where: { providerSubscriptionId: subId },
          data: {
            status: SubscriptionStatus.ACTIVE,
            tier: effectiveTier,
            providerCustomerId: customerId ?? existingSub?.providerCustomerId,
            currentPeriodStart: currentStart ?? new Date(),
            currentPeriodEnd: currentEnd ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            cancelAtPeriodEnd: false,
          },
        });
        break;
      }

      case "subscription.pending": {
        await prisma.subscription.updateMany({
          where: { providerSubscriptionId: subId },
          data: {
            status: SubscriptionStatus.PAST_DUE,
          },
        });
        break;
      }

      case "subscription.halted": {
        await prisma.subscription.updateMany({
          where: { providerSubscriptionId: subId },
          data: {
            status: SubscriptionStatus.HALTED,
          },
        });
        break;
      }

      case "subscription.paused": {
        await prisma.subscription.updateMany({
          where: { providerSubscriptionId: subId },
          data: {
            status: SubscriptionStatus.PAUSED,
          },
        });
        break;
      }

      case "subscription.resumed": {
        await prisma.subscription.updateMany({
          where: { providerSubscriptionId: subId },
          data: {
            status: SubscriptionStatus.ACTIVE,
          },
        });
        break;
      }

      case "subscription.cancelled": {
        if (existingSub) {
          // If cancelled at cycle end and currentPeriodEnd is in the future, retain ACTIVE until period ends
          const isFuture = existingSub.currentPeriodEnd && existingSub.currentPeriodEnd > new Date();
          await prisma.subscription.update({
            where: { id: existingSub.id },
            data: {
              cancelAtPeriodEnd: true,
              cancelledAt: new Date(),
              status: isFuture ? SubscriptionStatus.ACTIVE : SubscriptionStatus.CANCELLED,
            },
          });
        } else {
          await prisma.subscription.updateMany({
            where: { providerSubscriptionId: subId },
            data: {
              status: SubscriptionStatus.CANCELLED,
              cancelAtPeriodEnd: true,
              cancelledAt: new Date(),
            },
          });
        }
        break;
      }

      case "subscription.completed": {
        await prisma.subscription.updateMany({
          where: { providerSubscriptionId: subId },
          data: {
            status: SubscriptionStatus.EXPIRED,
          },
        });
        break;
      }

      default: {
        console.log(`Unhandled Razorpay event: ${payload.event}`);
      }
    }

    return NextResponse.json({ received: true, success: true });
  } catch (error) {
    console.error("Error processing Razorpay webhook event:", error);
    return NextResponse.json(
      { error: "Internal error processing subscription update." },
      { status: 500 }
    );
  }
}
