"use client";

import React from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import type { SpeechState } from "./speech-recognition.types";

export interface MicButtonProps {
  className?: string;
  size?: "default" | "sm";
  state?: SpeechState;
  isListening?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  title?: string;
}

/**
 * Voice input microphone button with multi-state visual indicators.
 * Features a continuous, smooth rotating gradient ring, soft ambient halo,
 * and dynamic state rendering (idle, listening, processing, unsupported).
 * Respects prefers-reduced-motion.
 */
export function MicButton({
  className = "",
  size = "default",
  state = "idle",
  isListening = false,
  disabled = false,
  onClick,
  title,
}: MicButtonProps) {
  const isSmall = size === "sm";
  const activeListening = isListening || state === "listening";
  const isProcessing = state === "processing";

  const buttonTitle =
    title ||
    (activeListening
      ? "Listening... Click to stop"
      : isProcessing
        ? "Processing voice input..."
        : state === "unsupported"
          ? "Voice input not supported in this browser"
          : "Start voice input (English / Hinglish)");

  return (
    <div className={`relative inline-flex items-center justify-center group shrink-0 ${className}`}>
      {/* Ambient glow halo - pulses dynamically when active */}
      <div
        className={`pointer-events-none absolute -inset-1 rounded-full blur-sm transition-all duration-300 ${
          activeListening
            ? "bg-gradient-to-r from-red-500/50 via-rose-500/50 to-amber-500/50 opacity-100 animate-pulse"
            : "bg-gradient-to-r from-emerald-500/25 via-sky-500/25 to-amber-500/25 blur-sm opacity-40 transition-opacity duration-300 group-hover:opacity-85 dark:from-emerald-400/20 dark:via-sky-400/20 dark:to-amber-400/20"
        }`}
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={onClick}
        disabled={disabled || isProcessing}
        title={buttonTitle}
        aria-label={buttonTitle}
        aria-pressed={activeListening}
        className={`relative isolate flex shrink-0 items-center justify-center rounded-full transition-transform duration-200 ease-out hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
          disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
        } ${isSmall ? "size-9" : "size-11 sm:size-12"}`}
      >
        {/* Layer 1: Continuous rotating gradient ring (rotates independently) */}
        <div
          className={`mic-rotating-ring pointer-events-none absolute inset-0 rounded-full ${
            activeListening
              ? "bg-[conic-gradient(from_0deg,#ef4444,#f97316,#eab308,#ef4444)]"
              : "bg-[conic-gradient(from_0deg,#10b981,#06b6d4,#4285f4,#ea4335,#fbbc05,#10b981)]"
          }`}
          aria-hidden="true"
        />

        {/* Layer 2: Stable, non-rotating inner button surface */}
        <div
          className={`relative z-10 flex size-[calc(100%-4px)] items-center justify-center rounded-full shadow-xs transition-colors duration-150 ${
            activeListening
              ? "bg-red-50 dark:bg-red-950/80"
              : "bg-white group-hover:bg-slate-50 dark:bg-slate-900 dark:group-hover:bg-slate-800"
          }`}
        >
          {activeListening ? (
            <Square
              className={`fill-red-600 text-red-600 transition-transform ${
                isSmall ? "size-3.5" : "size-4"
              }`}
              aria-hidden="true"
            />
          ) : isProcessing ? (
            <Loader2
              className={`animate-spin text-emerald-600 dark:text-emerald-400 ${
                isSmall ? "size-3.5" : "size-4"
              }`}
              aria-hidden="true"
            />
          ) : (
            <Mic
              className={`text-slate-700 transition-colors duration-200 group-hover:text-emerald-700 dark:text-slate-200 dark:group-hover:text-emerald-400 ${
                isSmall ? "size-4" : "size-5"
              }`}
              aria-hidden="true"
            />
          )}
        </div>
      </button>
    </div>
  );
}

export default MicButton;
