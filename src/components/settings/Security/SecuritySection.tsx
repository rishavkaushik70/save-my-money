"use client";

import { useState } from "react";
import { toast } from "sonner";
import { KeyRound, ShieldCheck } from "lucide-react";
import { FaChrome, FaGithub } from "react-icons/fa";

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

const comingSoon = "inline-flex shrink-0 items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400";

const SecuritySection = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  const handleChangePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Complete all password fields first.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Choose a password with at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Your new passwords do not match.");
      return;
    }
    if (newPassword === currentPassword) {
      toast.error("Choose a password different from your current one.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });
      if (error) {
        toast.error(error.message);
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordDialogOpen(false);
      toast.success("Password changed. Other sessions have been signed out.");
    } catch {
      toast.error("Could not change your password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="settings-surface min-w-0 rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_16px_42px_-34px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="mb-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-700 dark:text-emerald-400">Account protection</p>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950 dark:text-white">Security</h2>
        <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">Review sign-in options and keep your account protected.</p>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        <div className="flex min-w-0 flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              <KeyRound className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-white">Password</p>
              <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">Change your password and sign out other active sessions.</p>
            </div>
          </div>
          <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
            <DialogTrigger render={<Button type="button" variant="outline" className="min-h-10 shrink-0 rounded-xl border-slate-200 dark:border-slate-700">Change password</Button>} />
            <DialogContent className="rounded-2xl border border-slate-200 p-5 dark:border-slate-700 sm:p-6">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold tracking-tight">Change password</DialogTitle>
                <DialogDescription>Enter your current password, then choose a strong new one.</DialogDescription>
              </DialogHeader>
              <form onSubmit={(event) => void handleChangePassword(event)} className="mt-1 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current password</Label>
                  <Input id="current-password" type="password" autoComplete="current-password" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} placeholder="Enter current password" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New password</Label>
                  <Input id="new-password" type="password" autoComplete="new-password" required minLength={8} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="At least 8 characters" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm new password</Label>
                  <Input id="confirm-password" type="password" autoComplete="new-password" required minLength={8} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Enter it again" className="h-11 rounded-xl" />
                </div>
                <Button type="submit" disabled={loading} className="h-11 w-full rounded-xl">
                  {loading ? "Updating password…" : "Update password"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex min-w-0 items-center gap-3 py-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Two-factor authentication</p>
            <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">Add a second verification step when this sign-in flow is ready.</p>
          </div>
          <span className={comingSoon}>Coming soon</span>
        </div>

        <div className="grid gap-3 pt-4 sm:grid-cols-2">
          <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-950/50">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"><FaChrome className="size-5" aria-hidden="true" /></span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900 dark:text-white">Google</p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Google sign-in setup will be added later.</p>
            </div>
            <span className={comingSoon}>Soon</span>
          </div>
          <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-950/50">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"><FaGithub className="size-5" aria-hidden="true" /></span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900 dark:text-white">GitHub</p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">GitHub sign-in setup will be added later.</p>
            </div>
            <span className={comingSoon}>Soon</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
