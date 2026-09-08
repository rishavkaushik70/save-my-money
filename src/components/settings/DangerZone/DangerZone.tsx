"use client";

import { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
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

  const handleDeleteAccount = async () => {
    setLoading(true);

    const { error } = await authClient.deleteUser();

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

    window.location.href = "/";
  };

  return (
    <section className="bg-white rounded-xl border border-red-200 p-5 md:p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>

        <p className="text-sm text-gray-500">
          These actions are permanent and cannot be undone.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="size-10 shrink-0 rounded-lg bg-red-500/10 flex items-center justify-center">
            <Trash2 className="size-5 text-red-500" />
          </div>

          <div>
            <p className="font-medium">Delete Account</p>

            <p className="text-sm text-gray-500">
              Permanently delete your account and all your data.
            </p>
          </div>
        </div>

        <Dialog>
          <DialogTrigger
            render={<Button variant="destructive">Delete Account</Button>}
          />

          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="size-5" />
                Delete your account?
              </DialogTitle>

              <DialogDescription>
                This action cannot be undone. Your account and associated data
                will be permanently deleted.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
              <p className="font-medium">This will permanently remove:</p>

              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>Your profile</li>
                <li>Your transactions</li>
                <li>Your financial goals</li>
                <li>Your account data</li>
              </ul>
            </div>

            <DialogFooter>
              <Button variant="outline" disabled={loading}>
                Cancel
              </Button>

              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Yes, Delete My Account"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default DangerZone;
