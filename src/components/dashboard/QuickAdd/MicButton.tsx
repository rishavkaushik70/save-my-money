"use client";

import React from "react";
import { Mic } from "lucide-react";
import { toast } from "sonner";

interface MicButtonProps {
  className?: string;
  size?: "default" | "sm";
}

/**
 * Premium UI-only microphone button inspired by Google voice search aesthetics.
 * Features a continuous, smooth rotating gradient ring, soft ambient halo,
 * and stable centered icon. Respects prefers-reduced-motion.
 * Does not request microphone permissions or use speech recognition.
 */
export function MicButton({ className = "", size = "default" }: MicButtonProps) {
  const isSmall = size === "sm";

  const handleMicClick = () => {
    toast.info("Voice input — coming soon", {
      description: "Speech-to-transaction parsing will be available in an upcoming update.",
    });
  };

  return (
    <div className={`relative inline-flex items-center justify-center group shrink-0 ${className}`}>
      {/* Restrained ambient glow halo */}
      <div
        className="pointer-events-none absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500/25 via-sky-500/25 to-amber-500/25 blur-sm opacity-40 transition-opacity duration-300 group-hover:opacity-85 dark:from-emerald-400/20 dark:via-sky-400/20 dark:to-amber-400/20"
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={handleMicClick}
        title="Voice input — coming soon"
        aria-label="Voice input — coming soon"
        className={`relative isolate flex shrink-0 items-center justify-center rounded-full transition-transform duration-200 ease-out hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
          isSmall ? "size-9" : "size-11 sm:size-12"
        }`}
      >
        {/* Layer 1: Continuous rotating gradient ring (rotates independently) */}
        <div
          className="mic-rotating-ring pointer-events-none absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#10b981,#06b6d4,#4285f4,#ea4335,#fbbc05,#10b981)]"
          aria-hidden="true"
        />

        {/* Layer 2: Stable, non-rotating inner button surface */}
        <div className="relative z-10 flex size-[calc(100%-4px)] items-center justify-center rounded-full bg-white shadow-xs transition-colors duration-150 group-hover:bg-slate-50 dark:bg-slate-900 dark:group-hover:bg-slate-800">
          <Mic
            className={`text-slate-700 transition-colors duration-200 group-hover:text-emerald-700 dark:text-slate-200 dark:group-hover:text-emerald-400 ${
              isSmall ? "size-4" : "size-5"
            }`}
            aria-hidden="true"
          />
        </div>
      </button>
    </div>
  );
}

export default MicButton;
