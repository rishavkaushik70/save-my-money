"use client";

import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";

const DangerZone = () => {
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [open, setOpen] = useState(false);

  const handleDeleteAccount = async () => {
    if (confirmation !== "DELETE") return;
    setLoading(true);
    try {
      const { error } = await authClient.deleteUser();
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Account deletion started.");
      window.location.assign("/");
    } catch {
      toast.error("Could not delete the account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-w-0 rounded-[26px] border border-red-200 bg-gradient-to-br from-white to-red-50/50 p-5 shadow-[0_16px_42px_-36px_rgba(127,29,29,0.35)] dark:border-red-950/70 dark:from-slate-900 dark:to-red-950/20 sm:p-6">
      <div className="mb-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-red-700 dark:text-red-400">Careful</p>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-red-950 dark:text-red-200">Danger zone</h2>
        <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-400">Permanent account actions. Review what will be removed before continuing.</p>
      </div>

      <div className="flex min-w-0 flex-col gap-4 rounded-2xl border border-red-100 bg-white/80 p-4 dark:border-red-950/70 dark:bg-slate-950/60 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
            <Trash2 className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Delete account</p>
            <p className="mt-0.5 max-w-2xl text-xs leading-5 text-slate-500 dark:text-slate-400">Remove your profile, transactions, and financial goals. This cannot be undone.</p>
          </div>
        </div>

        <Dialog
          open={open}
          onOpenChange={(nextOpen) => {
            setOpen(nextOpen);
            if (!nextOpen) setConfirmation("");
          }}
        >
          <DialogTrigger render={<Button type="button" variant="destructive" className="min-h-10 shrink-0 rounded-xl">Delete account</Button>} />
          <DialogContent className="rounded-2xl border border-red-200 p-5 dark:border-red-950 sm:p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl font-bold text-red-700 dark:text-red-300">
                <AlertTriangle className="size-5" aria-hidden="true" /> Delete your account?
              </DialogTitle>
              <DialogDescription>This permanently deletes your profile, transactions, and goals from this account.</DialogDescription>
            </DialogHeader>

            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-950 dark:bg-red-950/40 dark:text-red-200">
              <p className="font-bold">This action cannot be undone.</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-xs leading-5">
                <li>Your profile and saved settings</li>
                <li>All recorded transactions and goals</li>
                <li>Active sessions for this account</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label htmlFor="delete-confirmation">Type DELETE to confirm</Label>
              <Input
                id="delete-confirmation"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                autoComplete="off"
                className="h-11 rounded-xl border-red-200 focus-visible:ring-red-500 dark:border-red-950"
              />
            </div>

            <DialogFooter className="sm:justify-end">
              <DialogClose render={<Button type="button" variant="outline" disabled={loading} className="rounded-xl">Cancel</Button>} />
              <Button
                type="button"
                variant="destructive"
                onClick={() => void handleDeleteAccount()}
                disabled={loading || confirmation !== "DELETE"}
                className="rounded-xl"
              >
                {loading ? "Deleting…" : "Permanently delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default DangerZone;
