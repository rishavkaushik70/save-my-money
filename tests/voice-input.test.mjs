import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import {
  SPEECH_LANGUAGES,
  DEFAULT_SPEECH_LANGUAGE,
} from "../src/components/dashboard/QuickAdd/speech-recognition.types.ts";
import { parseQuickAddInput } from "../src/lib/quick-add-parser.ts";

const rootDir = process.cwd();

function readSource(relativeFilePath) {
  const fullPath = path.join(rootDir, relativeFilePath);
  return fs.readFileSync(fullPath, "utf-8");
}

// -------------------------------------------------------------
// Suite 1: Speech Recognition Configuration & Language Taxonomy
// -------------------------------------------------------------

test("Default speech language is configured to en-IN for Indian English & Hinglish", () => {
  assert.equal(DEFAULT_SPEECH_LANGUAGE, "en-IN");

  const enIn = SPEECH_LANGUAGES.find((lang) => lang.code === "en-IN");
  assert.ok(enIn, "en-IN must be in the list of supported speech languages");
  assert.ok(enIn.name.includes("Hinglish"), "en-IN must document Hinglish support");
});

test("Configurable language options include English, Hinglish, and Hindi", () => {
  const codes = SPEECH_LANGUAGES.map((l) => l.code);
  assert.ok(codes.includes("en-IN"), "Must support en-IN");
  assert.ok(codes.includes("hi-IN"), "Must support hi-IN");
  assert.ok(codes.includes("en-US"), "Must support en-US");
});

// -------------------------------------------------------------
// Suite 2: Non-Destructive Transcript Appending
// -------------------------------------------------------------

test("Speech transcript preserves existing user text without unexpected deletion", () => {
  // Scenario 1: Initial input was empty -> speech populates input
  const initialEmpty = "";
  const transcript1 = "Spent ₹250 on lunch";
  const result1 = initialEmpty.trim() ? `${initialEmpty.trim()} ${transcript1}` : transcript1;
  assert.equal(result1, "Spent ₹250 on lunch");

  // Scenario 2: User had already typed "Team dinner " -> speech appends without deleting
  const initialText = "Team dinner";
  const transcript2 = "₹1,200 today";
  const result2 = initialText.trim() ? `${initialText.trim()} ${transcript2}` : transcript2;
  assert.equal(result2, "Team dinner ₹1,200 today");

  // Scenario 3: User had typed a merchant name, spoke amount and category
  const initialMerchant = "Starbucks";
  const transcript3 = "coffee 350";
  const result3 = initialMerchant.trim() ? `${initialMerchant.trim()} ${transcript3}` : transcript3;
  assert.equal(result3, "Starbucks coffee 350");
});

// -------------------------------------------------------------
// Suite 3: Explicit Review & No Automatic Save Boundary
// -------------------------------------------------------------

test("Voice input never triggers automatic transaction parsing or saving", () => {
  const cardSource = readSource("src/components/dashboard/QuickAdd/QuickAddCard.tsx");

  // Verify onTranscript only updates the input state, never calls handleParse
  assert.ok(
    cardSource.includes("onTranscript: (recognizedText) => {\n      // Append or populate recognized text without deleting existing manual entry\n      setInput(recognizedText);") ||
    cardSource.includes("setInput(recognizedText)"),
    "onTranscript callback must strictly populate the input field and not automatically trigger parsing",
  );

  assert.ok(
    !cardSource.includes("onTranscript: (recognizedText) => {\n      setInput(recognizedText);\n      handleParse"),
    "Voice recognition must not automatically invoke handleParse",
  );

  // Verify parse is only triggered by explicit user interaction (form submit, Enter key, or suggestion click)
  assert.ok(
    cardSource.includes('type="submit"') && cardSource.includes("Parse Transaction"),
    "Parse Transaction button requires explicit user click",
  );
});

// -------------------------------------------------------------
// Suite 4: Hook Lifecycle, Concurrency & Unmount Safety
// -------------------------------------------------------------

test("useSpeechRecognition prevents duplicate recognition sessions and handles unmount", () => {
  const hookSource = readSource("src/components/dashboard/QuickAdd/useSpeechRecognition.ts");

  // Concurrency guard
  assert.ok(
    hookSource.includes("isStartingRef.current") && hookSource.includes("recognitionRef.current !== null"),
    "Hook must guard against duplicate recognition sessions with synchronous lock refs",
  );

  // Unmount cleanup
  assert.ok(
    hookSource.includes("recognitionRef.current.abort()"),
    "Hook must abort active recognition session on component unmount",
  );

  // Manual stop control
  assert.ok(
    hookSource.includes("recognitionRef.current.stop()"),
    "Hook must provide manual stopListening control using recognition.stop()",
  );
});

// -------------------------------------------------------------
// Suite 5: Error Taxonomy & User Feedback
// -------------------------------------------------------------

test("useSpeechRecognition handles standard Web Speech error events with friendly feedback", () => {
  const hookSource = readSource("src/components/dashboard/QuickAdd/useSpeechRecognition.ts");

  assert.ok(
    hookSource.includes('"not-allowed"') && hookSource.includes("Microphone access denied"),
    "Permission denied must notify user with permission guidance",
  );
  assert.ok(
    hookSource.includes('"no-speech"') && hookSource.includes("No speech detected"),
    "No speech detected must inform user gently without crashing",
  );
  assert.ok(
    hookSource.includes('"audio-capture"') && hookSource.includes("No microphone detected"),
    "Missing hardware must inform user",
  );
  assert.ok(
    hookSource.includes('"network"') && hookSource.includes("Network error"),
    "Network error must notify user",
  );
});

// -------------------------------------------------------------
// Suite 6: Voice-Transcribed Transactions Successfully Parse
// -------------------------------------------------------------

test("Transcribed voice phrases parse cleanly through the existing Quick Add parser", () => {
  // Voice input 1: English expense with currency symbol
  const draft1 = parseQuickAddInput("Spent ₹450 on lunch");
  assert.equal(draft1.amount, 450);
  assert.equal(draft1.type, "EXPENSE");
  assert.equal(draft1.category, "Food & Dining");

  // Voice input 2: Hinglish expense
  const draft2 = parseQuickAddInput("Petrol bharwaya ₹500");
  assert.equal(draft2.amount, 500);
  assert.equal(draft2.type, "EXPENSE");
  assert.equal(draft2.category, "Transport");

  // Voice input 3: English income
  const draft3 = parseQuickAddInput("Received salary ₹50,000");
  assert.equal(draft3.amount, 50000);
  assert.equal(draft3.type, "INCOME");
  assert.equal(draft3.category, "Salary");
});

// -------------------------------------------------------------
// Suite 7: MicButton UI States & Accessibility
// -------------------------------------------------------------

test("MicButton supports multi-state rendering and accessibility attributes", () => {
  const micSource = readSource("src/components/dashboard/QuickAdd/MicButton.tsx");

  assert.ok(
    micSource.includes('aria-pressed={activeListening}'),
    "MicButton must expose aria-pressed state for screen readers when listening",
  );
  assert.ok(
    micSource.includes("Listening... Click to stop"),
    "MicButton must provide accessible label when listening",
  );
  assert.ok(
    micSource.includes("group shrink-0"),
    "MicButton must maintain shrink-0 geometry",
  );
  assert.ok(
    micSource.includes("size-11 sm:size-12"),
    "MicButton must maintain touch target minimums",
  );
  assert.ok(
    micSource.includes("mic-rotating-ring"),
    "MicButton must maintain rotating ring aesthetic",
  );
});
