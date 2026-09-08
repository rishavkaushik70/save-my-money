"use client";

import { useState } from "react";
import { Camera, Mail, UserRound } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { User } from "@/types/auth";
import { authClient } from "@/lib/auth-client";

interface ProfileSectionProps {
  user: User;
}

const ProfileSection = ({ user }: ProfileSectionProps) => {
  const [name, setName] = useState(user.name ?? "");
  const [loading, setLoading] = useState(false);

  const handleUpdateName = async () => {
    if (!name.trim()) return;

    setLoading(true);

    const { error } = await authClient.updateUser({
      name: name.trim(),
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Name updated successfully!");
  };

  return (
    <section className="bg-white rounded-xl border p-5 md:p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Profile</h2>

        <p className="text-sm text-gray-500">
          Manage your personal information.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Profile Image */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <Avatar className="size-20">
              <AvatarImage src={user.image ?? ""} alt={user.name ?? "User"} />

              <AvatarFallback className="text-xl">
                {user.name?.charAt(0).toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>

            <Button
              size="icon"
              variant="secondary"
              className="absolute -bottom-1 -right-1 size-8 rounded-full border"
            >
              <Camera className="size-4" />
            </Button>
          </div>

          <div>
            <p className="font-semibold">Profile Picture</p>

            <p className="text-sm text-gray-500">
              Your account profile picture.
            </p>
          </div>
        </div>

        {/* Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>

            <div className="relative">
              <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />

              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="pl-10"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />

              <Input
                id="email"
                value={user.email ?? ""}
                disabled
                className="pl-10 bg-gray-50"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleUpdateName}
            disabled={loading || !name.trim() || name.trim() === user.name}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;
