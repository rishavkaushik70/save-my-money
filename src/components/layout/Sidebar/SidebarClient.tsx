"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { usePersonalSettings } from "@/components/settings/SettingsProvider";

interface SidebarUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

interface SidebarClientProps {
  user?: SidebarUser;
}

const SidebarClient = ({ user }: SidebarClientProps) => {
  const { avatarImage, avatarCustomized } = usePersonalSettings();
  if (!user) {
    return null;
  }
  const displayImage = avatarCustomized ? avatarImage : user.image;

  return (
    <div className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white px-3 py-3 shadow-sm">
      {/* Avatar */}
      <Avatar className="size-10 ring-2 ring-emerald-100">
        {displayImage && <AvatarImage src={displayImage} alt={user.name} />}

        <AvatarFallback>
          {user.name?.charAt(0).toUpperCase() ?? "U"}
        </AvatarFallback>
      </Avatar>

      {/* User details */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-slate-900">{user.name}</p>

        <p className="truncate text-xs font-medium text-slate-500">Premium plan</p>
      </div>

      {/* Badge */}
      <span className="rounded-full bg-amber-50 px-2 py-1 text-sm ring-1 ring-amber-100" aria-label="Premium member">
        🏅
      </span>
    </div>
  );
};

export default SidebarClient;
