export type SpeechState = "idle" | "listening" | "processing" | "unsupported";

export interface SpeechLanguage {
  code: string;
  name: string;
  shortLabel: string;
}

export const SPEECH_LANGUAGES: SpeechLanguage[] = [
  { code: "en-IN", name: "English / Hinglish (India)", shortLabel: "EN (IN)" },
  { code: "hi-IN", name: "Hindi (India)", shortLabel: "HI (IN)" },
  { code: "en-US", name: "English (US)", shortLabel: "EN (US)" },
  { code: "en-GB", name: "English (UK)", shortLabel: "EN (GB)" },
];

export const DEFAULT_SPEECH_LANGUAGE = "en-IN";

// Minimal Web Speech API types for browser environments without requiring external packages
export interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

export interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionErrorEvent extends Event {
  readonly error:
    | "no-speech"
    | "aborted"
    | "audio-capture"
    | "network"
    | "not-allowed"
    | "service-not-allowed"
    | "bad-grammar"
    | "language-not-supported"
    | string;
  readonly message?: string;
}

export interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onstart: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: ISpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => void) | null;
  abort(): void;
  start(): void;
  stop(): void;
}

export type SpeechRecognitionConstructor = {
  new (): ISpeechRecognition;
};
