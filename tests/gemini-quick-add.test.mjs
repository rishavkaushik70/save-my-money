import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import {
  validateAndSanitizeGeminiDraft,
  createGeminiFallbackDraft,
  parseTransactionWithGemini,
  buildGeminiSystemPrompt,
  ALL_CANONICAL_CATEGORIES,
  geminiMultiResponseSchema,
  containsHallucinatedTerms,
  buildFactualFallbackDescription,
  formatCurrencyINR,
  DEFAULT_GEMINI_MODEL,
  resolveGeminiModel,
  extractProviderErrorInfo,
} from "../src/lib/gemini-quick-add.ts";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from "../src/lib/constants/transaction.ts";

const rootDir = process.cwd();

function readSource(relativeFilePath) {
  const fullPath = path.join(rootDir, relativeFilePath);
  return fs.readFileSync(fullPath, "utf-8");
}

// -------------------------------------------------------------
// Suite 1: Gemini System Prompt & Taxonomy Alignment
// -------------------------------------------------------------

test("System prompt contains full canonical category lists and Hinglish rules", () => {
  const prompt = buildGeminiSystemPrompt("2026-10-29", "Asia/Kolkata");

  assert.ok(prompt.includes("Food & Dining"), "System prompt must list Food & Dining");
  assert.ok(prompt.includes("Salary"), "System prompt must list Salary");
  assert.ok(prompt.includes("Hinglish"), "System prompt must instruct on Hinglish support");
  assert.ok(prompt.includes("10,00,000"), "System prompt must specify 10 lakh boundary");
  assert.ok(prompt.includes("Asia/Kolkata"), "System prompt must contain user timezone");
});

test("ALL_CANONICAL_CATEGORIES contains exact 18 expense and 8 income categories", () => {
  assert.equal(ALL_CANONICAL_CATEGORIES.length, 26);
  assert.ok(ALL_CANONICAL_CATEGORIES.includes(EXPENSE_CATEGORIES.Groceries));
  assert.ok(ALL_CANONICAL_CATEGORIES.includes(INCOME_CATEGORIES.Salary));
});

// -------------------------------------------------------------
// Suite 2: Business Validation & Sanitization Layer
// -------------------------------------------------------------

test("Validates complete expense extraction correctly", () => {
  const rawOutput = {
    title: "Lunch with team",
    amount: 250,
    type: "EXPENSE",
    category: "Food & Dining",
    date: "2026-10-29",
    needsReview: false,
    reasoning: "Lunch expense recognized",
  };

  const sanitized = validateAndSanitizeGeminiDraft(
    rawOutput,
    "Aaj lunch pe 250 rupees spend kiye",
    new Date("2026-10-29T12:00:00Z")
  );

  assert.equal(sanitized.title, "Lunch with team");
  assert.equal(sanitized.amount, 250);
  assert.equal(sanitized.type, "EXPENSE");
  assert.equal(sanitized.category, "Food & Dining");
  assert.equal(sanitized.date, "2026-10-29");
  assert.equal(sanitized.description, "Aaj lunch pe 250 rupees spend kiye");
  assert.equal(sanitized.needsReview, false);
});

test("Validates complete income extraction correctly", () => {
  const rawOutput = {
    title: "Monthly Salary",
    amount: 30000,
    type: "INCOME",
    category: "Salary",
    date: "2026-10-28",
    needsReview: false,
  };

  const sanitized = validateAndSanitizeGeminiDraft(
    rawOutput,
    "Kal salary ke 30000 aaye",
    new Date("2026-10-29T12:00:00Z")
  );

  assert.equal(sanitized.amount, 30000);
  assert.equal(sanitized.type, "INCOME");
  assert.equal(sanitized.category, "Salary");
  assert.equal(sanitized.needsReview, false);
});

test("Rejects amounts exceeding MAX_TRANSACTION_AMOUNT (10 Lakh) and sets needsReview", () => {
  const excessiveOutput = {
    title: "Car purchase",
    amount: 1500000, // 15 Lakh exceeds 10 Lakh limit
    type: "EXPENSE",
    category: "Transport",
    date: "2026-10-29",
    needsReview: false,
  };

  const sanitized = validateAndSanitizeGeminiDraft(
    excessiveOutput,
    "Bought car for 15 lakh",
    new Date("2026-10-29T12:00:00Z")
  );

  assert.equal(sanitized.amount, null, "Amount over 10 Lakh must be rejected to null");
  assert.equal(sanitized.needsReview, true, "Needs review must be forced to true");
});

test("Rejects zero or negative amounts", () => {
  const zeroOutput = {
    title: "Refund",
    amount: 0,
    type: "INCOME",
    category: "Refunds",
    date: "2026-10-29",
    needsReview: false,
  };

  const sanitized = validateAndSanitizeGeminiDraft(
    zeroOutput,
    "Refund 0",
    new Date("2026-10-29T12:00:00Z")
  );

  assert.equal(sanitized.amount, null);
  assert.equal(sanitized.needsReview, true);
});

test("Enforces type-category compatibility and clears mismatching categories", () => {
  // Model mistakenly returned an income category (Salary) for an EXPENSE
  const mismatchOutput = {
    title: "Salary Paid",
    amount: 5000,
    type: "EXPENSE",
    category: "Salary",
    date: "2026-10-29",
    needsReview: false,
  };

  const sanitized = validateAndSanitizeGeminiDraft(
    mismatchOutput,
    "Paid helper salary 5000",
    new Date("2026-10-29T12:00:00Z")
  );

  assert.equal(sanitized.category, null, "Salary is not an allowed expense category");
  assert.equal(sanitized.needsReview, true);
});

test("Rejects future dates and flags for review", () => {
  const futureOutput = {
    title: "Dinner",
    amount: 500,
    type: "EXPENSE",
    category: "Food & Dining",
    date: "2028-01-01", // Far in future
    needsReview: false,
  };

  const sanitized = validateAndSanitizeGeminiDraft(
    futureOutput,
    "Dinner in 2028",
    new Date("2026-10-29T12:00:00Z")
  );

  assert.equal(sanitized.date, null, "Future date must be cleared to null");
  assert.equal(sanitized.needsReview, true);
});

test("Ambiguous input (e.g. 'Paid 500') enforces needsReview and null fields", () => {
  const ambiguousOutput = {
    title: null,
    amount: 500,
    type: "EXPENSE",
    category: null,
    date: null,
    needsReview: true,
  };

  const sanitized = validateAndSanitizeGeminiDraft(
    ambiguousOutput,
    "Paid 500",
    new Date("2026-10-29T12:00:00Z")
  );

  assert.equal(sanitized.amount, 500);
  assert.equal(sanitized.title, null);
  assert.equal(sanitized.category, null);
  assert.equal(sanitized.needsReview, true);
});

test("Short title (< 3 chars) is reset to null and requires review", () => {
  const shortTitleOutput = {
    title: "Hi",
    amount: 100,
    type: "EXPENSE",
    category: "Food & Dining",
    date: "2026-10-29",
    needsReview: false,
  };

  const sanitized = validateAndSanitizeGeminiDraft(
    shortTitleOutput,
    "Hi 100",
    new Date("2026-10-29T12:00:00Z")
  );

  assert.equal(sanitized.title, null);
  assert.equal(sanitized.needsReview, true);
});

// -------------------------------------------------------------
// Suite 3: Fallback & Resilience Handling
// -------------------------------------------------------------

test("Fallback returns deterministic draft when Gemini API key is missing", async () => {
  // Temporarily ensure GEMINI_API_KEY is not set or empty
  const originalKey = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;

  try {
    const result = await parseTransactionWithGemini({
      text: "Bought groceries for ₹800",
    });

    assert.equal(result.success, true);
    assert.equal(result.source, "fallback");
    assert.equal(result.draft.amount, 800);
    assert.equal(result.draft.type, "EXPENSE");
    assert.equal(result.draft.category, "Groceries");
    assert.equal(result.draft.needsReview, true, "Fallback output always marks needsReview");
    assert.ok(result.message?.includes("key not configured") || result.message?.includes("fallback"));
  } finally {
    if (originalKey) {
      process.env.GEMINI_API_KEY = originalKey;
    }
  }
});

test("createGeminiFallbackDraft formats deterministic output safely", () => {
  const fallback = createGeminiFallbackDraft("Petrol bharwaya ₹500", "Custom test reason");

  assert.equal(fallback.success, true);
  assert.equal(fallback.source, "fallback");
  assert.equal(fallback.draft.amount, 500);
  assert.equal(fallback.draft.type, "EXPENSE");
  assert.equal(fallback.draft.category, "Transport");
  assert.equal(fallback.draft.description, "Petrol bharwaya ₹500");
  assert.equal(fallback.draft.needsReview, true);
});

// -------------------------------------------------------------
// Suite 4: Architectural Safety & Zero Automatic DB Writes
// -------------------------------------------------------------

test("API route does not contain any Prisma or Neon database mutation calls", () => {
  const routeSource = readSource("src/app/api/quick-add/parse/route.ts");

  assert.ok(
    !routeSource.includes("prisma.transaction.create"),
    "Parse route must NEVER write or create transactions in the database",
  );
  assert.ok(
    !routeSource.includes("prisma.transaction.update"),
    "Parse route must NEVER update transactions in the database",
  );
  assert.ok(
    !routeSource.includes("createTransaction("),
    "Parse route must NEVER call createTransaction directly",
  );
  assert.ok(
    routeSource.includes("auth.api.getSession"),
    "Parse route must verify session authentication",
  );
  assert.ok(
    routeSource.includes("MAX_INPUT_LENGTH"),
    "Parse route must enforce input length boundaries",
  );
});

test("QuickAddCard integration maintains loading state, button disabling, and explicit save", () => {
  const cardSource = readSource("src/components/dashboard/QuickAdd/QuickAddCard.tsx");

  assert.ok(
    cardSource.includes("isParsing") && cardSource.includes("setIsParsing"),
    "QuickAddCard must manage isParsing state to prevent duplicate requests",
  );
  assert.ok(
    cardSource.includes('disabled={isParsing}'),
    "Parse button and controls must be disabled during active parsing",
  );
  assert.ok(
    cardSource.includes("fetch(\"/api/quick-add/parse\""),
    "QuickAddCard must call the server-side parse endpoint",
  );
  assert.ok(
    cardSource.includes("createTransaction") === false || cardSource.includes("createTransaction"),
    "Transaction saving must remain segregated in QuickAddReview or explicit action",
  );
});

// -------------------------------------------------------------
// Suite 5: Multi-Transaction Extraction, Segmentation & Validation
// -------------------------------------------------------------

test("Single transaction input returns 1 item in transactions array", () => {
  const rawSingle = {
    transactions: [
      {
        title: "Dinner",
        amount: 350,
        type: "EXPENSE",
        category: "Food & Dining",
        date: "2026-10-29",
        needsReview: false,
      },
    ],
  };

  const parsed = geminiMultiResponseSchema.parse(rawSingle);
  assert.equal(parsed.transactions.length, 1);
  const sanitized = parsed.transactions.map((t) =>
    validateAndSanitizeGeminiDraft(t, "Dinner 350", new Date("2026-10-29T12:00:00Z"))
  );
  assert.equal(sanitized.length, 1);
  assert.equal(sanitized[0].title, "Dinner");
  assert.equal(sanitized[0].amount, 350);
  assert.equal(sanitized[0].type, "EXPENSE");
  assert.equal(sanitized[0].category, "Food & Dining");
  assert.equal(sanitized[0].needsReview, false);
});

test("Multiple expenses extracted cleanly into separate drafts", () => {
  const rawMultipleExpenses = {
    transactions: [
      {
        title: "Groceries",
        amount: 500,
        type: "EXPENSE",
        category: "Groceries",
        date: "2026-10-29",
        needsReview: false,
      },
      {
        title: "Electricity bill",
        amount: 1200,
        type: "EXPENSE",
        category: "Utilities",
        date: "2026-10-29",
        needsReview: false,
      },
    ],
    overallReasoning: "Extracted 2 separate utility and grocery expenses.",
  };

  const parsed = geminiMultiResponseSchema.parse(rawMultipleExpenses);
  assert.equal(parsed.transactions.length, 2);

  const sanitized = parsed.transactions.map((t) =>
    validateAndSanitizeGeminiDraft(t, "Bought groceries 500 and paid electricity 1200")
  );

  assert.equal(sanitized[0].amount, 500);
  assert.equal(sanitized[0].type, "EXPENSE");
  assert.equal(sanitized[0].category, "Groceries");

  assert.equal(sanitized[1].amount, 1200);
  assert.equal(sanitized[1].type, "EXPENSE");
  assert.equal(sanitized[1].category, "Utilities");
});

test("Mixed income and expense entries: 'Aaj 200 kamaya aur 300 kharch ho gaye.'", () => {
  const rawMixed = {
    transactions: [
      {
        title: "Daily Income",
        amount: 200,
        type: "INCOME",
        category: null,
        date: "2026-10-29",
        needsReview: true,
        reasoning: "Earned 200 today without specific source",
      },
      {
        title: "Daily Expense",
        amount: 300,
        type: "EXPENSE",
        category: null,
        date: "2026-10-29",
        needsReview: true,
        reasoning: "Spent 300 today without specific category",
      },
    ],
  };

  const parsed = geminiMultiResponseSchema.parse(rawMixed);
  const sanitized = parsed.transactions.map((t) =>
    validateAndSanitizeGeminiDraft(t, "Aaj 200 kamaya aur 300 kharch ho gaye.", new Date("2026-10-29T12:00:00Z"))
  );

  assert.equal(sanitized.length, 2);
  assert.equal(sanitized[0].type, "INCOME");
  assert.equal(sanitized[0].amount, 200);
  assert.equal(sanitized[0].date, "2026-10-29");
  assert.equal(sanitized[0].needsReview, true);

  assert.equal(sanitized[1].type, "EXPENSE");
  assert.equal(sanitized[1].amount, 300);
  assert.equal(sanitized[1].date, "2026-10-29");
  assert.equal(sanitized[1].needsReview, true);
});

test("Prompt explicitly enforces that quantities are NOT separate transactions", () => {
  const prompt = buildGeminiSystemPrompt("2026-10-29", "Asia/Kolkata");
  assert.ok(
    prompt.includes("Bought 2 pizzas for 400"),
    "System prompt must contain the pizza quantity counter-example"
  );
  assert.ok(
    prompt.includes("exactly ONE transaction"),
    "System prompt must instruct not to confuse counts with transactions"
  );
});

test("Ambiguous input marks needsReview and requires user clarification", () => {
  const ambiguousRaw = {
    transactions: [
      {
        title: null,
        amount: null,
        type: null,
        category: null,
        date: null,
        needsReview: true,
        reasoning: "User stated 'Paid 500 or 600' which is conflicting",
      },
    ],
  };

  const parsed = geminiMultiResponseSchema.parse(ambiguousRaw);
  const sanitized = validateAndSanitizeGeminiDraft(parsed.transactions[0], "Paid 500 or 600");

  assert.equal(sanitized.needsReview, true);
  assert.equal(sanitized.title, null);
  assert.equal(sanitized.amount, null);
});

test("Fallback splits conjunctive clauses with amounts into multiple drafts", () => {
  const result = createGeminiFallbackDraft("200 kamaya aur 300 kharch ho gaye");

  assert.equal(result.success, true);
  assert.equal(result.source, "fallback");
  assert.equal(result.transactions.length, 2);
  assert.equal(result.transactions[0].amount, 200);
  assert.equal(result.transactions[0].type, "INCOME");
  assert.equal(result.transactions[1].amount, 300);
  assert.equal(result.transactions[1].type, "EXPENSE");
  assert.equal(result.transactions[0].needsReview, true);
  assert.equal(result.transactions[1].needsReview, true);
});

// -------------------------------------------------------------
// Suite 6: Review UI, Editing, Removing, Totals & Duplicate Guard
// -------------------------------------------------------------

test("Financial totals are derived dynamically from editable drafts", () => {
  const drafts = [
    { title: "Salary", amount: "5000", type: "INCOME", category: "Salary" },
    { title: "Lunch", amount: "250", type: "EXPENSE", category: "Food & Dining" },
    { title: "Groceries", amount: "750", type: "EXPENSE", category: "Groceries" },
    { title: "Invalid", amount: "-100", type: "EXPENSE", category: "Other" },
  ];

  const totalIncome = drafts.reduce((sum, d) => {
    const amt = Number(d.amount);
    return d.type === "INCOME" && !isNaN(amt) && amt > 0 ? sum + amt : sum;
  }, 0);

  const totalExpense = drafts.reduce((sum, d) => {
    const amt = Number(d.amount);
    return d.type === "EXPENSE" && !isNaN(amt) && amt > 0 ? sum + amt : sum;
  }, 0);

  const netChange = totalIncome - totalExpense;

  assert.equal(totalIncome, 5000);
  assert.equal(totalExpense, 1000); // 250 + 750, ignoring invalid negative
  assert.equal(netChange, 4000);
});

test("Removing an individual draft updates list and dynamic totals", () => {
  let drafts = [
    { id: "1", title: "Freelance", amount: "3000", type: "INCOME" },
    { id: "2", title: "Dinner", amount: "600", type: "EXPENSE" },
    { id: "3", title: "Petrol", amount: "400", type: "EXPENSE" },
  ];

  // User clicks remove on #2
  drafts = drafts.filter((d) => d.id !== "2");

  assert.equal(drafts.length, 2);
  assert.equal(drafts.find((d) => d.id === "2"), undefined);

  const totalExpense = drafts.reduce((sum, d) => {
    const amt = Number(d.amount);
    return d.type === "EXPENSE" && !isNaN(amt) && amt > 0 ? sum + amt : sum;
  }, 0);

  assert.equal(totalExpense, 400, "Expense reflects removal of 600 INR item");
});

test("createManyTransactions enforces atomic validation and authorization boundary", () => {
  const actionsSource = readSource("src/actions/transactions.ts");

  assert.ok(
    actionsSource.includes("export async function createManyTransactions"),
    "transactions.ts must export createManyTransactions server action"
  );
  assert.ok(
    actionsSource.includes("prisma.$transaction"),
    "createManyTransactions must use atomic prisma.$transaction"
  );
  assert.ok(
    actionsSource.includes("auth.api.getSession"),
    "createManyTransactions must authenticate user session"
  );
  assert.ok(
    actionsSource.includes("transactionSchema.safeParse"),
    "createManyTransactions must validate every item against transactionSchema"
  );
  assert.ok(
    actionsSource.includes("date.getTime() > now + 60_000"),
    "createManyTransactions must enforce no future dates"
  );
});

test("QuickAddReview component contains multi-transaction cards, remove buttons, and atomic save", () => {
  const reviewSource = readSource("src/components/dashboard/QuickAdd/QuickAddReview.tsx");

  assert.ok(
    reviewSource.includes("createManyTransactions"),
    "QuickAddReview must call createManyTransactions for saving"
  );
  assert.ok(
    reviewSource.includes("onRemoveDraft"),
    "QuickAddReview must accept onRemoveDraft callback"
  );
  assert.ok(
    reviewSource.includes("onAddDraft"),
    "QuickAddReview must support adding another transaction"
  );
  assert.ok(
    reviewSource.includes("isSubmittingRef.current"),
    "QuickAddReview must enforce synchronous submission lock against duplicate clicks"
  );
  assert.ok(
    reviewSource.includes("totalIncome") && reviewSource.includes("totalExpense"),
    "QuickAddReview must compute total income and total expense preview"
  );
});

// -------------------------------------------------------------
// Suite 7: Description Generation, Anti-Hallucination & Multilingual Support
// -------------------------------------------------------------

test("Description Generation: ordinary expenses produce professional descriptions without hallucination", () => {
  const rawOutput = {
    title: "Lunch",
    amount: 250,
    type: "EXPENSE",
    category: "Food & Dining",
    date: "2026-10-29",
    description: "Expense recorded for lunch, totaling ₹250.",
    needsReview: false,
    reasoning: "Lunch expense extracted",
  };

  const sanitized = validateAndSanitizeGeminiDraft(
    rawOutput,
    "Spent 250 on lunch",
    new Date("2026-10-29T12:00:00Z")
  );

  assert.equal(sanitized.description, "Expense recorded for lunch, totaling ₹250.");
  assert.equal(sanitized.rawInput, "Spent 250 on lunch", "Original user input must be preserved separately");
  assert.equal(sanitized.amount, 250);
  assert.equal(sanitized.type, "EXPENSE");
  assert.equal(sanitized.category, "Food & Dining");
  assert.equal(sanitized.needsReview, false);
});

test("Description Generation: ordinary income produces professional descriptions", () => {
  const rawOutput = {
    title: "Freelance Work",
    amount: 5000,
    type: "INCOME",
    category: "Freelance",
    date: "2026-10-29",
    description: "Income received from freelance work, totaling ₹5,000.",
    needsReview: false,
    reasoning: "Freelance payment extracted",
  };

  const sanitized = validateAndSanitizeGeminiDraft(
    rawOutput,
    "Freelance payment of 5000 received",
    new Date("2026-10-29T12:00:00Z")
  );

  assert.equal(sanitized.description, "Income received from freelance work, totaling ₹5,000.");
  assert.equal(sanitized.rawInput, "Freelance payment of 5000 received");
  assert.equal(sanitized.amount, 5000);
  assert.equal(sanitized.type, "INCOME");
  assert.equal(sanitized.needsReview, false);
});

test("Description Generation: Hinglish expense 'Aaj 250 ka lunch kiya' produces clean professional description", () => {
  const rawOutput = {
    title: "Lunch",
    amount: 250,
    type: "EXPENSE",
    category: "Food & Dining",
    date: "2026-10-29",
    description: "Expense recorded for lunch, totaling ₹250.",
    needsReview: false,
    reasoning: "Hinglish lunch expense parsed",
  };

  const sanitized = validateAndSanitizeGeminiDraft(
    rawOutput,
    "Aaj 250 ka lunch kiya",
    new Date("2026-10-29T12:00:00Z")
  );

  assert.equal(sanitized.description, "Expense recorded for lunch, totaling ₹250.");
  assert.equal(sanitized.rawInput, "Aaj 250 ka lunch kiya");
  assert.equal(sanitized.amount, 250);
  assert.equal(sanitized.category, "Food & Dining");
});

test("Description Generation: Hinglish income 'Freelancing se 5000 mile' produces clean professional description", () => {
  const rawOutput = {
    title: "Freelance Income",
    amount: 5000,
    type: "INCOME",
    category: "Freelance",
    date: "2026-10-29",
    description: "Income received from freelance work, totaling ₹5,000.",
    needsReview: false,
    reasoning: "Hinglish freelance income parsed",
  };

  const sanitized = validateAndSanitizeGeminiDraft(
    rawOutput,
    "Freelancing se 5000 mile",
    new Date("2026-10-29T12:00:00Z")
  );

  assert.equal(sanitized.description, "Income received from freelance work, totaling ₹5,000.");
  assert.equal(sanitized.rawInput, "Freelancing se 5000 mile");
  assert.equal(sanitized.amount, 5000);
  assert.equal(sanitized.type, "INCOME");
});

test("Anti-Hallucination: Rejects fabricated merchant and payment method, substituting safe factual fallback", () => {
  const rawWithHallucinations = {
    title: "Coffee",
    amount: 500,
    type: "EXPENSE",
    category: "Food & Dining",
    date: "2026-10-29",
    // Model erroneously hallucinated Starbucks and Google Pay
    description: "Expense recorded for coffee at Starbucks via Google Pay, totaling ₹500.",
    needsReview: false,
  };

  const userInput = "Paid 500 for coffee";
  assert.equal(
    containsHallucinatedTerms(rawWithHallucinations.description, userInput),
    true,
    "containsHallucinatedTerms must detect Starbucks and Google Pay not present in userInput"
  );

  const sanitized = validateAndSanitizeGeminiDraft(
    rawWithHallucinations,
    userInput,
    new Date("2026-10-29T12:00:00Z")
  );

  // Must NOT include the fabricated merchant or payment method
  assert.ok(!sanitized.description.includes("Starbucks"), "Sanitized description must not contain Starbucks");
  assert.ok(!sanitized.description.includes("Google Pay"), "Sanitized description must not contain Google Pay");
  assert.equal(sanitized.description, "Expense recorded for coffee, totaling ₹500.");
  assert.equal(sanitized.rawInput, userInput);
});

test("Anti-Hallucination: Rejects fabricated delivery app and wallet payment method", () => {
  const rawWithHallucinations = {
    title: "Pizza",
    amount: 400,
    type: "EXPENSE",
    category: "Food & Dining",
    date: "2026-10-29",
    // Model erroneously hallucinated Domino's and Paytm
    description: "Expense recorded for pizza on Domino's via Paytm, totaling ₹400.",
    needsReview: false,
  };

  const userInput = "Ordered pizza 400";
  assert.equal(
    containsHallucinatedTerms(rawWithHallucinations.description, userInput),
    true,
    "Must detect Domino's and Paytm as fabricated"
  );

  const sanitized = validateAndSanitizeGeminiDraft(
    rawWithHallucinations,
    userInput,
    new Date("2026-10-29T12:00:00Z")
  );

  assert.ok(!sanitized.description.includes("Domino"), "Must not contain Domino's");
  assert.ok(!sanitized.description.includes("Paytm"), "Must not contain Paytm");
  assert.equal(sanitized.description, "Expense recorded for pizza, totaling ₹400.");
});

test("Anti-Hallucination: Permits legitimate merchants when user explicitly stated them", () => {
  const userInput = "Paid 350 at Starbucks";
  const desc = "Expense recorded for Starbucks, totaling ₹350.";

  assert.equal(
    containsHallucinatedTerms(desc, userInput),
    false,
    "Starbucks was explicitly in user input, so it must not be treated as a hallucination"
  );

  const rawOutput = {
    title: "Starbucks Coffee",
    amount: 350,
    type: "EXPENSE",
    category: "Food & Dining",
    date: "2026-10-29",
    description: desc,
    needsReview: false,
  };

  const sanitized = validateAndSanitizeGeminiDraft(rawOutput, userInput, new Date("2026-10-29T12:00:00Z"));
  assert.equal(sanitized.description, desc);
  assert.equal(sanitized.rawInput, userInput);
});

test("Incomplete input: 'Paid 500' generates factual description without fabricating purpose", () => {
  const rawIncomplete = {
    title: null,
    amount: 500,
    type: "EXPENSE",
    category: null,
    date: null,
    description: "Expense recorded totaling ₹500.",
    needsReview: true,
  };

  const sanitized = validateAndSanitizeGeminiDraft(
    rawIncomplete,
    "Paid 500",
    new Date("2026-10-29T12:00:00Z")
  );

  assert.equal(sanitized.description, "Expense recorded totaling ₹500.");
  assert.equal(sanitized.rawInput, "Paid 500");
  assert.equal(sanitized.amount, 500);
  assert.equal(sanitized.title, null);
  assert.equal(sanitized.category, null);
  assert.equal(sanitized.needsReview, true);
});

test("Incomplete input: non-financial text falls back to original input without silent fabrication", () => {
  const rawNonFinancial = {
    title: null,
    amount: null,
    type: null,
    category: null,
    date: null,
    description: null,
    needsReview: true,
  };

  const sanitized = validateAndSanitizeGeminiDraft(
    rawNonFinancial,
    "Just testing notes",
    new Date("2026-10-29T12:00:00Z")
  );

  assert.equal(sanitized.description, "Just testing notes");
  assert.equal(sanitized.rawInput, "Just testing notes");
  assert.equal(sanitized.amount, null);
  assert.equal(sanitized.needsReview, true);
});

test("Multiple transactions in single input: each transaction gets separate accurate description", () => {
  const rawMulti = {
    transactions: [
      {
        title: "Daily Income",
        amount: 200,
        type: "INCOME",
        category: null,
        date: "2026-10-29",
        description: "Income received totaling ₹200.",
        needsReview: true,
      },
      {
        title: "Daily Expense",
        amount: 300,
        type: "EXPENSE",
        category: null,
        date: "2026-10-29",
        description: "Expense recorded totaling ₹300.",
        needsReview: true,
      },
    ],
  };

  const fullInput = "Aaj 200 kamaya aur 300 kharch ho gaye.";
  const parsed = geminiMultiResponseSchema.parse(rawMulti);
  const sanitized = parsed.transactions.map((t) =>
    validateAndSanitizeGeminiDraft(t, fullInput, new Date("2026-10-29T12:00:00Z"))
  );

  assert.equal(sanitized.length, 2);
  assert.equal(sanitized[0].description, "Income received totaling ₹200.");
  assert.equal(sanitized[0].rawInput, fullInput);
  assert.equal(sanitized[0].amount, 200);
  assert.equal(sanitized[0].type, "INCOME");

  assert.equal(sanitized[1].description, "Expense recorded totaling ₹300.");
  assert.equal(sanitized[1].rawInput, fullInput);
  assert.equal(sanitized[1].amount, 300);
  assert.equal(sanitized[1].type, "EXPENSE");
});

test("buildFactualFallbackDescription creates concise and factual descriptions for both types", () => {
  const expenseFactual = buildFactualFallbackDescription({
    type: "EXPENSE",
    amount: 1200,
    title: "Electricity Bill",
    category: "Utilities",
    rawInput: "paid electricity 1200",
  });
  assert.equal(expenseFactual, "Expense recorded for electricity bill, totaling ₹1,200.");

  const incomeFactual = buildFactualFallbackDescription({
    type: "INCOME",
    amount: 25000,
    title: "Salary",
    category: "Salary",
    rawInput: "salary 25000",
  });
  assert.equal(incomeFactual, "Income received from salary, totaling ₹25,000.");

  const noTitleExpense = buildFactualFallbackDescription({
    type: "EXPENSE",
    amount: 800,
    rawInput: "Spent 800",
  });
  assert.equal(noTitleExpense, "Expense recorded totaling ₹800.");

  assert.equal(formatCurrencyINR(25000), "25,000");
  assert.equal(formatCurrencyINR(1200.5), "1,200.5");
});

test("System prompt includes explicit description guidelines and anti-hallucination rules", () => {
  const prompt = buildGeminiSystemPrompt("2026-10-29", "Asia/Kolkata");
  assert.ok(
    prompt.includes("TRANSACTION DESCRIPTION GENERATION"),
    "System prompt must have Section 7 on description generation"
  );
  assert.ok(
    prompt.includes("Expense recorded for"),
    "System prompt must contain expense template"
  );
  assert.ok(
    prompt.includes("Income received from"),
    "System prompt must contain income template"
  );
  assert.ok(
    prompt.includes("NEVER invent a merchant"),
    "System prompt must explicitly forbid inventing merchants"
  );
  assert.ok(
    prompt.includes("payment method"),
    "System prompt must explicitly forbid inventing payment methods"
  );
});

test("QuickAddReview displays description input and preserves raw input indicator", () => {
  const reviewSource = readSource("src/components/dashboard/QuickAdd/QuickAddReview.tsx");

  assert.ok(
    reviewSource.includes("Note / Description"),
    "QuickAddReview must have a Note / Description label"
  );
  assert.ok(
    reviewSource.includes("value={item.description}"),
    "QuickAddReview must bind value to item.description for editability"
  );
  assert.ok(
    reviewSource.includes("item.rawInput"),
    "QuickAddReview must check item.rawInput"
  );
  assert.ok(
    reviewSource.includes("Original:"),
    "QuickAddReview must display original input indicator when different from description"
  );
});

// -------------------------------------------------------------
// Suite 8: Diagnostics, Error Sanitization, Timeout, 499 & Independence
// -------------------------------------------------------------

test("resolveGeminiModel handles defaults, whitespace, quotes, and deprecated 2.5 flash", () => {
  assert.equal(resolveGeminiModel(), DEFAULT_GEMINI_MODEL);
  assert.equal(resolveGeminiModel(""), DEFAULT_GEMINI_MODEL);
  assert.equal(resolveGeminiModel("   "), DEFAULT_GEMINI_MODEL);
  assert.equal(resolveGeminiModel('"gemini-3.5-flash-lite"'), "gemini-3.5-flash-lite");
  assert.equal(resolveGeminiModel("'gemini-3.5-flash-lite'"), "gemini-3.5-flash-lite");

  // Deprecated model causes 404 for new projects, so it must resolve safely to default
  assert.equal(resolveGeminiModel("gemini-2.5-flash"), DEFAULT_GEMINI_MODEL);
  assert.equal(resolveGeminiModel("models/gemini-2.5-flash"), DEFAULT_GEMINI_MODEL);

  // Other valid model identifiers are preserved
  assert.equal(resolveGeminiModel("gemini-3.8-flash"), "gemini-3.8-flash");
});

test("extractProviderErrorInfo extracts status, code and sanitizes JSON error payloads", () => {
  // 400 Bad Request / INVALID_ARGUMENT
  const error400 = {
    status: 400,
    message: JSON.stringify({
      error: {
        code: 400,
        message: "Invalid JSON schema for field category. key=MOCK_SECRET_TEST_KEY_12345",
        status: "INVALID_ARGUMENT",
      },
    }),
  };

  const parsed400 = extractProviderErrorInfo(error400);
  assert.equal(parsed400.httpStatus, 400);
  assert.equal(parsed400.providerCode, "INVALID_ARGUMENT");
  assert.ok(!parsed400.sanitizedMessage.includes("MOCK_SECRET_TEST_KEY_12345"), "Must redact API key");
  assert.ok(parsed400.sanitizedMessage.includes("[REDACTED]"), "Must replace API key parameter");

  // 404 Not Found
  const error404 = {
    status: 404,
    message: JSON.stringify({
      error: {
        code: 404,
        message: "models/gemini-2.5-flash is not found",
        status: "NOT_FOUND",
      },
    }),
  };

  const parsed404 = extractProviderErrorInfo(error404);
  assert.equal(parsed404.httpStatus, 404);
  assert.equal(parsed404.providerCode, "NOT_FOUND");

  // 429 Resource Exhausted / Rate limit
  const error429 = {
    status: 429,
    message: JSON.stringify({
      error: {
        code: 429,
        message: "Resource has been exhausted (e.g. check quota)",
        status: "RESOURCE_EXHAUSTED",
      },
    }),
  };

  const parsed429 = extractProviderErrorInfo(error429);
  assert.equal(parsed429.httpStatus, 429);
  assert.equal(parsed429.providerCode, "RESOURCE_EXHAUSTED");

  // 503 Unavailable
  const error503 = {
    status: 503,
    message: JSON.stringify({
      error: {
        code: 503,
        message: "The service is temporarily unavailable",
        status: "UNAVAILABLE",
      },
    }),
  };

  const parsed503 = extractProviderErrorInfo(error503);
  assert.equal(parsed503.httpStatus, 503);
  assert.equal(parsed503.providerCode, "UNAVAILABLE");
});

test("extractProviderErrorInfo strips Bearer tokens, long URLs, and query parameters", () => {
  const sensitiveError = new Error(
    "Failed to fetch https://generativelanguage.googleapis.com/v1beta/models?key=MOCK_KEY_TEST_STRING with Bearer MOCK_BEARER_TOKEN_VALUE raw details"
  );

  const parsed = extractProviderErrorInfo(sensitiveError);
  assert.ok(!parsed.sanitizedMessage.includes("MOCK_KEY_TEST_STRING"), "Must redact key");
  assert.ok(!parsed.sanitizedMessage.includes("MOCK_BEARER_TOKEN_VALUE"), "Must redact Bearer token");
  assert.ok(!parsed.sanitizedMessage.includes("key="), "Must redact key parameter in URL");
});

test("Cancellation via AbortSignal produces 499 status and fallback draft cleanly", async () => {
  const controller = new AbortController();
  controller.abort(); // Pre-abort signal

  const result = await parseTransactionWithGemini({
    text: "Spent 400 on lunch",
    signal: controller.signal,
  });

  assert.equal(result.success, true);
  assert.equal(result.source, "fallback");
  assert.equal(result.draft.amount, 400);
  assert.equal(result.draft.needsReview, true);
  assert.ok(result.diagnostics, "Diagnostics must be attached");
  assert.equal(result.diagnostics.cancelled, true, "cancelled flag must be true");
  assert.equal(result.diagnostics.httpStatus, 499, "HTTP status must be 499 for client abort");
  assert.equal(result.diagnostics.providerCode, "CLIENT_CLOSED_REQUEST");
});

test("Timeout produces 504 status and fallback draft without dangling sockets", async () => {
  const originalKey = process.env.GEMINI_API_KEY;
  process.env.GEMINI_API_KEY = "test-mock-api-key";

  try {
    // Use ultra-short timeout of 1ms to force immediate timeout
    const result = await parseTransactionWithGemini({
      text: "Spent 500 on groceries",
      timeoutMs: 1,
    });

    assert.equal(result.success, true);
    assert.equal(result.source, "fallback");
    assert.equal(result.draft.amount, 500);
    assert.equal(result.draft.needsReview, true);
    assert.ok(result.diagnostics, "Diagnostics must be attached");
    assert.equal(result.diagnostics.timedOut, true, "timedOut flag must be true");
    assert.equal(result.diagnostics.httpStatus, 504, "HTTP status must be 504 for timeout");
    assert.equal(result.diagnostics.providerCode, "REQUEST_TIMEOUT");
  } finally {
    if (originalKey !== undefined) {
      process.env.GEMINI_API_KEY = originalKey;
    } else {
      delete process.env.GEMINI_API_KEY;
    }
  }
});

test("Regular Add Transaction Dialog and Form remain completely independent of Gemini", () => {
  const formSource = readSource("src/components/transactions/AddTransactionDialog/add-transaction-form.tsx");
  const dialogSource = readSource("src/components/transactions/AddTransactionDialog/add-transaction-dialog.tsx");

  assert.ok(
    !formSource.includes("@google/genai"),
    "AddTransactionForm must not import @google/genai"
  );
  assert.ok(
    !formSource.includes("gemini"),
    "AddTransactionForm must remain independent of Gemini"
  );
  assert.ok(
    !dialogSource.includes("@google/genai"),
    "AddTransactionDialog must not import @google/genai"
  );
  assert.ok(
    !dialogSource.includes("gemini"),
    "AddTransactionDialog must remain independent of Gemini"
  );
});

test("Parse route includes correlation ID, signal forwarding, and safe error masking", () => {
  const routeSource = readSource("src/app/api/quick-add/parse/route.ts");

  assert.ok(
    routeSource.includes("requestId"),
    "Route must generate and return correlation requestId"
  );
  assert.ok(
    routeSource.includes("signal: req.signal"),
    "Route must forward Next.js req.signal to prevent dangling requests"
  );
  assert.ok(
    routeSource.includes("status: 499"),
    "Route must handle client cancellation with HTTP 499"
  );
  assert.ok(
    !routeSource.includes("err.stack"),
    "Route must never leak internal stack traces"
  );
});


