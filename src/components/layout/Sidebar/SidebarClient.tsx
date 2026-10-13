"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { usePersonalSettings } from "@/components/settings/SettingsProvider";
import { SubscriptionTierType } from "@/lib/subscriptions/config";

interface SidebarUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

interface SidebarClientProps {
  user?: SidebarUser;
  tier?: SubscriptionTierType;
}

const tierConfig: Record<
  SubscriptionTierType,
  { label: string; badge: string; badgeStyle: string; ariaLabel: string }
> = {
  PREMIUM: {
    label: "Premium plan",
    badge: "🏅",
    badgeStyle:
      "bg-amber-50 text-amber-900 ring-amber-200 dark:bg-amber-950/70 dark:text-amber-200 dark:ring-amber-800/60",
    ariaLabel: "Premium member",
  },
  PRO: {
    label: "Pro plan",
    badge: "⚡",
    badgeStyle:
      "bg-emerald-50 text-emerald-900 ring-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-200 dark:ring-emerald-800/60",
    ariaLabel: "Pro member",
  },
  FREE: {
    label: "Free plan",
    badge: "🌱",
    badgeStyle:
      "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
    ariaLabel: "Free member",
  },
};

const SidebarClient = ({ user, tier = "FREE" }: SidebarClientProps) => {
  const { avatarImage, avatarCustomized } = usePersonalSettings();
  if (!user) {
    return null;
  }
  const displayImage = avatarCustomized ? avatarImage : user.image;
  const config = tierConfig[tier] ?? tierConfig.FREE;

  return (
    <Link
      href="/settings"
      className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white px-3 py-3 shadow-sm transition hover:border-emerald-300 dark:border-slate-800 dark:bg-[#111b16] dark:hover:border-emerald-800"
      title="View account and subscription settings"
    >
      {/* Avatar */}
      <Avatar className="size-10 ring-2 ring-emerald-100 dark:ring-emerald-900/50">
        {displayImage && <AvatarImage src={displayImage} alt={user.name} />}

        <AvatarFallback className="dark:bg-slate-800 dark:text-slate-200">
          {user.name?.charAt(0).toUpperCase() ?? "U"}
        </AvatarFallback>
      </Avatar>

      {/* User details */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
          {user.name}
        </p>

        <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
          {config.label}
        </p>
      </div>

      {/* Badge */}
      <span
        className={`rounded-full px-2 py-1 text-sm ring-1 ${config.badgeStyle}`}
        aria-label={config.ariaLabel}
      >
        {config.badge}
      </span>
    </Link>
  );
};

export default SidebarClient;
