"use client";

import { useState } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { authClient } from "@/lib/auth-client";
import { FaChrome, FaGithub } from "react-icons/fa";

const SecuritySection = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    alert("Password changed successfully!");
  };

  return (
    <section className="bg-white rounded-xl border p-5 md:p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Security</h2>

        <p className="text-sm text-gray-500">
          Manage your account security and connected accounts.
        </p>
      </div>

      <div className="divide-y">
        {/* Password */}
        <div className="flex items-center justify-between gap-5 py-5">
          <div className="flex items-center gap-4">
            <div className="size-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
              <KeyRound className="size-5 text-primary" />
            </div>

            <div>
              <p className="font-medium">Password</p>

              <p className="text-sm text-gray-500">
                Update your account password.
              </p>
            </div>
          </div>

          <Dialog>
            <DialogTrigger
              render={<Button variant="destructive">Change Password</Button>}
            />

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>

                <DialogDescription>
                  Enter your current password and choose a new password.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-4 py-4">
                {/* Current */}
                <div className="space-y-2">
                  <Label>Current Password</Label>

                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current password"
                  />
                </div>

                {/* New */}
                <div className="space-y-2">
                  <Label>New Password</Label>

                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                  />
                </div>

                {/* Confirm */}
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>

                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>

                <Button
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Changing Password..." : "Change Password"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* 2FA */}
        <div className="flex items-center justify-between gap-5 py-5">
          <div className="flex items-center gap-4">
            <div className="size-10 shrink-0 rounded-lg bg-green-500/10 flex items-center justify-center">
              <ShieldCheck className="size-5 text-green-600" />
            </div>

            <div>
              <p className="font-medium">Two-Factor Authentication</p>

              <p className="text-sm text-gray-500">
                Add an extra layer of security.
              </p>
            </div>
          </div>

          <Button variant="outline">Enable</Button>
        </div>

        {/* Google */}
        <div className="flex items-center justify-between gap-5 py-5">
          <div className="flex items-center gap-4">
            <div className="size-10 shrink-0 rounded-lg bg-gray-100 flex items-center justify-center">
              <FaChrome className="size-5" />
            </div>

            <div>
              <p className="font-medium">Google</p>

              <p className="text-sm text-gray-500">
                Sign in with your Google account.
              </p>
            </div>
          </div>

          <Button variant="outline">Connected</Button>
        </div>

        {/* GitHub */}
        <div className="flex items-center justify-between gap-5 py-5">
          <div className="flex items-center gap-4">
            <div className="size-10 shrink-0 rounded-lg bg-gray-100 flex items-center justify-center">
              <FaGithub className="size-5" />
            </div>

            <div>
              <p className="font-medium">GitHub</p>

              <p className="text-sm text-gray-500">
                Sign in with your GitHub account.
              </p>
            </div>
          </div>

          <Button variant="outline">Connect</Button>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
