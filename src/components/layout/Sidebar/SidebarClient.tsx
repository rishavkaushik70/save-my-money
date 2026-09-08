"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";

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
  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 mt-6 px-2">
      {/* Avatar */}
      <Avatar className="size-10">
        <AvatarImage src={user.image ?? ""} alt={user.name} />

        <AvatarFallback>
          {user.name?.charAt(0).toUpperCase() ?? "U"}
        </AvatarFallback>
      </Avatar>

      {/* User details */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">{user.name}</p>

        <p className="text-xs text-gray-500 truncate">Premium Plan</p>
      </div>

      {/* Badge */}
      <span className="text-lg">🏅</span>
    </div>
  );
};

export default SidebarClient;
