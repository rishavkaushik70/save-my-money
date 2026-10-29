import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { parseTransactionWithGemini } from "@/lib/gemini-quick-add";

const MAX_INPUT_LENGTH = 500;

export async function POST(req: NextRequest) {
  try {
    // 1. Session Authentication Check
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized. Please sign in to use Gemini Quick Add.",
        },
        { status: 401 }
      );
    }

    // 2. Parse & Validate Request Body
    const body = await req.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const { text, clientDate, timezone } = body as {
      text?: unknown;
      clientDate?: unknown;
      timezone?: unknown;
    };

    if (typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { success: false, error: "Text field is required." },
        { status: 400 }
      );
    }

    const trimmedText = text.trim();
    if (trimmedText.length > MAX_INPUT_LENGTH) {
      return NextResponse.json(
        {
          success: false,
          error: `Transaction description exceeds maximum allowed length of ${MAX_INPUT_LENGTH} characters.`,
        },
        { status: 400 }
      );
    }

    const sanitizedTimezone =
      typeof timezone === "string" && timezone.trim()
        ? timezone.trim().slice(0, 50)
        : "Asia/Kolkata";

    const sanitizedClientDate =
      typeof clientDate === "string" && clientDate.trim()
        ? clientDate.trim()
        : undefined;

    const requestId = `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

    // 3. Execute Gemini AI Parsing with Structured Output, Signal Forwarding & Safe Diagnostics
    const result = await parseTransactionWithGemini({
      text: trimmedText,
      clientDate: sanitizedClientDate,
      timezone: sanitizedTimezone,
      signal: req.signal,
      requestId,
    });

    // 4. Return Structured Drafts without any Database Writes
    return NextResponse.json({
      success: result.success,
      transactions: result.transactions,
      draft: result.draft,
      overallReasoning: result.overallReasoning,
      source: result.source,
      message: result.message,
      requestId: result.requestId || requestId,
    });
  } catch (err: unknown) {
    const isAbort =
      req.signal.aborted ||
      (err instanceof Error && (err.name === "AbortError" || err.message.includes("aborted")));

    if (isAbort) {
      return NextResponse.json(
        {
          success: false,
          error: "Request was cancelled.",
        },
        { status: 499 }
      );
    }

    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[API] /api/quick-add/parse error:", message.slice(0, 150));

    return NextResponse.json(
      {
        success: false,
        error: "Failed to parse transaction description. Please try again or enter details manually.",
      },
      { status: 500 }
    );
  }
}
