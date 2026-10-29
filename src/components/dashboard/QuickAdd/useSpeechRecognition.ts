"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  DEFAULT_SPEECH_LANGUAGE,
  type ISpeechRecognition,
  type SpeechRecognitionConstructor,
  type SpeechRecognitionEvent,
  type SpeechRecognitionErrorEvent,
  type SpeechState,
} from "./speech-recognition.types";

export function getSpeechRecognitionClass(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const win = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return win.SpeechRecognition || win.webkitSpeechRecognition || null;
}

export interface UseSpeechRecognitionOptions {
  onTranscript: (transcript: string, options: { isFinal: boolean }) => void;
  onEnd?: () => void;
  defaultLanguage?: string;
}

export interface UseSpeechRecognitionResult {
  state: SpeechState;
  isListening: boolean;
  isSupported: boolean;
  language: string;
  setLanguage: (lang: string) => void;
  startListening: (currentInputValue?: string) => void;
  stopListening: () => void;
  toggleListening: (currentInputValue?: string) => void;
}

export function useSpeechRecognition({
  onTranscript,
  onEnd,
  defaultLanguage = DEFAULT_SPEECH_LANGUAGE,
}: UseSpeechRecognitionOptions): UseSpeechRecognitionResult {
  const [state, setState] = useState<SpeechState>("idle");
  const [language, setLanguage] = useState<string>(defaultLanguage);
  // Determine browser capability without triggering cascading renders in effect
  const [isSupported] = useState<boolean>(() => {
    return typeof window !== "undefined" && Boolean(getSpeechRecognitionClass());
  });

  // Synchronous lock refs to guarantee single recognition session and prevent race conditions
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const isStartingRef = useRef<boolean>(false);
  const initialTextRef = useRef<string>("");

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore cleanup abort errors
        }
        recognitionRef.current = null;
      }
      isStartingRef.current = false;
    };
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      setState("processing");
      try {
        recognitionRef.current.stop();
      } catch {
        // Recognition might already be stopping
      }
    } else {
      setState("idle");
    }
  }, []);

  const startListening = useCallback(
    (currentInputValue = "") => {
      // Prevent duplicate recognition sessions from rapid clicks
      if (isStartingRef.current || recognitionRef.current !== null || state === "listening") {
        return;
      }

      const SpeechClass = getSpeechRecognitionClass();
      if (!SpeechClass) {
        setState("unsupported");
        toast.error("Voice input is not supported in this browser.", {
          description:
            "Speech recognition is natively supported in Google Chrome, Microsoft Edge, and Safari. You can still type your transactions manually.",
        });
        return;
      }

      // Preserve previously typed text so speech recognition appends without deleting
      initialTextRef.current = currentInputValue.trim();
      isStartingRef.current = true;

      try {
        const recognition = new SpeechClass();
        recognitionRef.current = recognition;

        recognition.lang = language;
        recognition.continuous = false; // Turn-based single utterance dictation
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          isStartingRef.current = false;
          setState("listening");
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let interimText = "";
          let finalText = "";

          for (let i = 0; i < event.results.length; i++) {
            const resultItem = event.results[i];
            const transcript = resultItem[0]?.transcript || "";
            if (resultItem.isFinal) {
              finalText += transcript;
            } else {
              interimText += transcript;
            }
          }

          const rawSpeech = (finalText + (interimText ? " " + interimText : "")).trim();
          if (rawSpeech) {
            const baseText = initialTextRef.current;
            const combined = baseText ? `${baseText} ${rawSpeech}` : rawSpeech;
            onTranscript(combined, {
              isFinal: Boolean(finalText && !interimText),
            });
          }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          isStartingRef.current = false;

          switch (event.error) {
            case "not-allowed":
            case "service-not-allowed":
              toast.error("Microphone access denied", {
                description:
                  "Please enable microphone permissions in your browser address bar/settings to use voice input.",
              });
              break;
            case "no-speech":
              toast.info("No speech detected", {
                description:
                  "Please speak closer to your microphone or type your transaction manually.",
              });
              break;
            case "audio-capture":
              toast.error("No microphone detected", {
                description:
                  "Please ensure a working microphone is connected to your device.",
              });
              break;
            case "network":
              toast.error("Network error during speech recognition", {
                description:
                  "Could not connect to the speech service. Please verify your internet connection.",
              });
              break;
            case "aborted":
              // User cancelled or stopped; return quietly to idle
              break;
            default:
              toast.error("Speech recognition error", {
                description:
                  event.message || "An unexpected error occurred during voice recognition.",
              });
              break;
          }

          setState("idle");
        };

        recognition.onend = () => {
          isStartingRef.current = false;
          recognitionRef.current = null;
          setState("idle");
          onEnd?.();
        };

        recognition.start();
      } catch (err: unknown) {
        isStartingRef.current = false;
        recognitionRef.current = null;
        setState("idle");

        const errorMessage = err instanceof Error ? err.message : "Failed to start speech recognition";
        toast.error("Could not start microphone", {
          description: errorMessage,
        });
      }
    },
    [language, onEnd, onTranscript, state]
  );

  const toggleListening = useCallback(
    (currentInputValue = "") => {
      if (state === "listening") {
        stopListening();
      } else if (state === "idle" || state === "unsupported") {
        startListening(currentInputValue);
      }
    },
    [startListening, state, stopListening]
  );

  return {
    state,
    isListening: state === "listening",
    isSupported,
    language,
    setLanguage,
    startListening,
    stopListening,
    toggleListening,
  };
}
