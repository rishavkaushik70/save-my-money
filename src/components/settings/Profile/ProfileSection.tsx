"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Check, ImagePlus, Mail, Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { User } from "@/types/auth";
import { authClient } from "@/lib/auth-client";
import { usePersonalSettings } from "../SettingsProvider";

interface ProfileSectionProps {
  user: User;
}

async function prepareProfileImage(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Choose a JPG, PNG, or WebP image.");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Choose an image smaller than 10 MB.");
  }

  const bitmap = await createImageBitmap(file);
  const maxDimension = 640;
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("This image could not be processed.");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) =>
        result ? resolve(result) : reject(new Error("This image could not be saved.")),
      "image/webp",
      0.8,
    );
  });
  if (blob.size > 750 * 1024) {
    throw new Error("This image is still too large after compression. Try another photo.");
  }

  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === "string"
        ? resolve(reader.result)
        : reject(new Error("This image could not be read."));
    reader.onerror = () => reject(new Error("This image could not be read."));
    reader.readAsDataURL(blob);
  });
}

const ProfileSection = ({ user }: ProfileSectionProps) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { avatarImage, avatarCustomized, setAvatarImage } = usePersonalSettings();
  const [name, setName] = useState(user.name ?? "");
  const [saving, setSaving] = useState(false);
  const [processingImage, setProcessingImage] = useState(false);

  const image = avatarCustomized ? avatarImage : user.image;
  const nameChanged = name.trim() !== user.name;
  const hasChanges = nameChanged;

  const handleSelectImage = async (file?: File) => {
    if (!file) return;
    setProcessingImage(true);
    try {
      const preparedImage = await prepareProfileImage(file);
      if (!setAvatarImage(preparedImage)) {
        throw new Error("Browser storage is full. Remove some data or choose a smaller photo.");
      }
      toast.success("Profile photo saved in this browser.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not prepare this image.",
      );
    } finally {
      setProcessingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    if (!setAvatarImage(null)) {
      toast.error("Could not update your photo in browser storage.");
      return;
    }
    toast.success("Profile photo removed from this browser.");
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    if (!hasChanges) return;

    setSaving(true);
    try {
      const changes: { name?: string } = {};
      if (nameChanged) changes.name = name.trim();

      const { error } = await authClient.updateUser(changes);
      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Profile updated.");
      router.refresh();
    } catch {
      toast.error("Could not update your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="settings-surface min-w-0 rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_16px_42px_-34px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-700 dark:text-emerald-400">Account details</p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950 dark:text-white">Profile</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Keep your personal details and profile photo up to date.</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
          <Check className="size-3.5" /> Private account
        </span>
      </div>

      <div className="flex min-w-0 flex-col gap-6">
        <div className="flex min-w-0 flex-col gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/50 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="relative shrink-0">
              <Avatar className="size-[76px] ring-4 ring-white shadow-sm dark:ring-slate-800">
                {image && <AvatarImage src={image} alt={`${name || "Your"} profile`} />}
                <AvatarFallback className="bg-emerald-100 text-xl font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {name.trim().charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border-2 border-white bg-emerald-600 text-white dark:border-slate-800">
                <Camera className="size-3.5" aria-hidden="true" />
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 dark:text-white">Profile picture</p>
              <p className="mt-0.5 text-sm leading-5 text-slate-500 dark:text-slate-400">Square photos work best. Images are resized and saved in this browser.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <input
              ref={fileInputRef}
              className="sr-only"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              aria-label="Choose a profile picture"
              onChange={(event) => void handleSelectImage(event.target.files?.[0])}
            />
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
              disabled={processingImage || saving}
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus className="size-4" />
              {processingImage ? "Preparing…" : "Change photo"}
            </Button>
            {image && (
              <Button
                type="button"
                variant="ghost"
                className="rounded-xl text-slate-500 hover:text-red-600 dark:text-slate-400"
                disabled={processingImage || saving}
                onClick={handleRemoveImage}
              >
                <Trash2 className="size-4" />
                Remove
              </Button>
            )}
          </div>
        </div>

        <div className="grid min-w-0 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="settings-name" className="text-sm font-semibold text-slate-700 dark:text-slate-200">Full name</Label>
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <Input
                id="settings-name"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className="h-11 rounded-xl border-slate-200 bg-white pl-10 dark:border-slate-700 dark:bg-slate-950"
                maxLength={80}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="settings-email" className="text-sm font-semibold text-slate-700 dark:text-slate-200">Email address</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <Input
                id="settings-email"
                value={user.email ?? ""}
                readOnly
                aria-describedby="settings-email-hint"
                className="h-11 rounded-xl border-slate-200 bg-slate-100/80 pl-10 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400"
              />
            </div>
            <p id="settings-email-hint" className="text-xs text-slate-500 dark:text-slate-400">Email is used for sign-in and cannot be changed here.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Photo updates apply immediately; your name is saved to your account.</p>
          <Button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving || processingImage || !hasChanges || !name.trim()}
            className="min-h-10 rounded-xl px-5 shadow-sm"
          >
            {saving ? "Saving profile…" : "Save changes"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;
