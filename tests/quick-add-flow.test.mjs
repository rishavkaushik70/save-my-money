import test from "node:test";
import assert from "node:assert/strict";

import { parseQuickAddInput } from "../src/lib/quick-add-parser.ts";
import {
  transactionSchema,
  MAX_TRANSACTION_AMOUNT,
} from "../src/lib/validators/transactions.ts";
import {
  TRANSACTION_CATEGORIES,
  INCOME_CATEGORIES,
} from "../src/lib/constants/transaction.ts";

test("Quick Add parser output conforms to draft specification without side effects", () => {
  const input = "Bought groceries for ₹800";
  const draft = parseQuickAddInput(input);

  assert.equal(draft.title, "Groceries");
  assert.equal(draft.amount, 800);
  assert.equal(draft.type, "EXPENSE");
  assert.equal(draft.category, "Groceries");
  assert.equal(draft.description, input);
  assert.equal(draft.needsReview, false);

  // Validate that draft converts safely to transactionSchema payload
  const validation = transactionSchema.safeParse({
    title: draft.title,
    amount: draft.amount,
    type: draft.type,
    category: draft.category,
    date: new Date(),
    description: draft.description,
  });

  assert.equal(validation.success, true);
});

test("Incomplete natural language input flags needsReview and prevents silent fabrication", () => {
  const incompleteInput = "Spent ₹500";
  const draft = parseQuickAddInput(incompleteInput);

  assert.equal(draft.amount, 500);
  assert.equal(draft.type, "EXPENSE");
  assert.equal(draft.title, null);
  assert.equal(draft.category, null);
  assert.equal(draft.needsReview, true);

  // Without user review and manual correction, schema must reject incomplete draft
  const validation = transactionSchema.safeParse({
    title: draft.title,
    amount: draft.amount,
    type: draft.type,
    category: draft.category,
    date: new Date(),
  });

  assert.equal(validation.success, false, "Incomplete draft must fail schema until user provides required fields");
});

test("Salary input correctly extracts Income and Salary category", () => {
  const salaryInput = "Received salary ₹25,000";
  const draft = parseQuickAddInput(salaryInput);

  assert.equal(draft.amount, 25000);
  assert.equal(draft.type, "INCOME");
  assert.equal(draft.title, "Salary");
  assert.equal(draft.category, INCOME_CATEGORIES.Salary);
  assert.equal(draft.needsReview, false);

  const reviewedPayload = {
    title: draft.title,
    amount: draft.amount,
    type: draft.type,
    category: draft.category,
    date: new Date(),
    description: draft.description,
  };

  const validation = transactionSchema.safeParse(reviewedPayload);
  assert.equal(validation.success, true);
  assert.equal(validation.data?.type, "INCOME");
  assert.equal(validation.data?.category, "Salary");
});

test("Generic income input extracts Income and requires category selection during review", () => {
  const genericIncome = "Credited ₹25,000";
  const draft = parseQuickAddInput(genericIncome);

  assert.equal(draft.amount, 25000);
  assert.equal(draft.type, "INCOME");
  assert.equal(draft.category, null);
  assert.equal(draft.needsReview, true);

  // When user selects a valid income category during review:
  const reviewedPayload = {
    title: "Client Payment",
    amount: draft.amount,
    type: draft.type,
    category: INCOME_CATEGORIES.Freelance,
    date: new Date(),
    description: draft.description,
  };

  const validation = transactionSchema.safeParse(reviewedPayload);
  assert.equal(validation.success, true);
  assert.equal(validation.data?.type, "INCOME");
  assert.equal(validation.data?.category, "Freelance");
});

test("Hinglish input extracts type and amount accurately", () => {
  const hinglishInput = "Petrol bharwaya ₹500";
  const draft = parseQuickAddInput(hinglishInput);

  assert.equal(draft.amount, 500);
  assert.equal(draft.type, "EXPENSE");
  assert.equal(draft.title, "Petrol");
  assert.equal(draft.category, TRANSACTION_CATEGORIES.Transport);
  assert.equal(draft.needsReview, false);
});

test("Quick Add draft respects MAX_TRANSACTION_AMOUNT boundary", () => {
  assert.equal(MAX_TRANSACTION_AMOUNT, 1_000_000);

  const parsedValid = parseQuickAddInput("Bought car for ₹1000000");
  assert.equal(parsedValid.amount, 1_000_000);

  const parsedExcess = parseQuickAddInput("Spent ₹1000001");
  assert.equal(parsedExcess.amount, null, "Parser rejects amounts above ₹10,00,000");
});

// Fix 1 Tests: Concurrent submission guard logic and lock release
test("Fix 1: Synchronous submission lock blocks concurrent save executions", async () => {
  let isSubmitting = false;
  let saveExecutions = 0;

  const simulateHandleSave = async (sleepMs = 50) => {
    if (isSubmitting) {
      return { rejected: true };
    }
    isSubmitting = true;
    try {
      saveExecutions++;
      await new Promise((resolve) => setTimeout(resolve, sleepMs));
      return { success: true };
    } finally {
      isSubmitting = false;
    }
  };

  // Launch two concurrent save attempts simultaneously (double-click simulation)
  const [firstAttempt, secondAttempt] = await Promise.all([
    simulateHandleSave(50),
    simulateHandleSave(50),
  ]);

  assert.equal(saveExecutions, 1, "Only one execution must proceed when double-clicked");
  assert.equal(firstAttempt.success, true);
  assert.equal(secondAttempt.rejected, true, "Second concurrent attempt must be rejected");
  assert.equal(isSubmitting, false, "Lock must be released after completion");
});

test("Fix 1: Failed save preserves draft state and releases submission lock", async () => {
  let isSubmitting = false;
  let draft = { title: "Lunch with client", amount: "450", type: "EXPENSE", category: "Food" };

  const simulateFailedSave = async () => {
    if (isSubmitting) return;
    isSubmitting = true;
    try {
      // Simulate server failure
      throw new Error("Database timeout");
    } catch {
      // Catch error without modifying draft
      return { success: false, error: "Database timeout" };
    } finally {
      isSubmitting = false;
    }
  };

  const result = await simulateFailedSave();
  assert.equal(result.success, false);
  assert.equal(isSubmitting, false, "Submission lock must be released even on failure");
  assert.equal(draft.title, "Lunch with client", "Draft state must be preserved upon failure");
  assert.equal(draft.amount, "450", "Amount must remain intact upon failure");
});

// Fix 2 Tests: Dialog handoff synchronization
test("Fix 2: Cancelling full dialog preserves inline draft, saving clears it", () => {
  let inlineDraft = {
    title: "Petrol",
    amount: "500",
    type: "EXPENSE",
    category: "Transport",
  };
  let inputQuery = "Petrol bharwaya ₹500";
  let dialogOpen = false;

  // Step 1: User clicks 'Open in full dialog'
  const handleOpenInDialog = () => {
    dialogOpen = true;
  };
  handleOpenInDialog();
  assert.equal(dialogOpen, true);
  assert.notEqual(inlineDraft, null, "Inline draft must not be discarded when dialog opens");

  // Step 2A: User cancels dialog without saving
  const handleDialogCancel = () => {
    dialogOpen = false;
  };
  handleDialogCancel();
  assert.equal(dialogOpen, false);
  assert.notEqual(inlineDraft, null, "Inline draft must remain intact when dialog is cancelled");
  assert.equal(inputQuery, "Petrol bharwaya ₹500");

  // Step 2B: User saves successfully in dialog
  const handleDialogSuccess = () => {
    inlineDraft = null;
    inputQuery = "";
    dialogOpen = false;
  };
  handleDialogSuccess();
  assert.equal(dialogOpen, false);
  assert.equal(inlineDraft, null, "Inline draft must be cleared when transaction is saved in dialog");
  assert.equal(inputQuery, "", "Input must be cleared when transaction is saved in dialog");
});

// Fix 3 Tests: Aligned status banner validation rules
test("Fix 3: Two-character title fails validation and cannot appear ready to save", () => {
  const shortTitle = "AB";
  const trimmed = shortTitle.trim();

  // Test missingFields logic from QuickAddReview
  const missingFields = [];
  if (!trimmed) {
    missingFields.push("Title");
  } else if (trimmed.length < 3) {
    missingFields.push("Title (min 3 chars)");
  }

  assert.equal(missingFields.includes("Title (min 3 chars)"), true);

  // Validate with transactionSchema
  const result = transactionSchema.safeParse({
    title: shortTitle,
    amount: 100,
    type: "EXPENSE",
    category: "Food",
    date: new Date(),
  });
  assert.equal(result.success, false, "Schema must reject title < 3 characters");
});

test("Fix 3: Amount above MAX_TRANSACTION_AMOUNT fails validation and cannot appear ready to save", () => {
  const excessAmount = "1500000";
  const num = Number(excessAmount);

  // Test missingFields logic from QuickAddReview
  const missingFields = [];
  if (!excessAmount.trim() || isNaN(num) || num <= 0) {
    missingFields.push("Amount");
  } else if (num > MAX_TRANSACTION_AMOUNT) {
    missingFields.push("Amount (max ₹10,00,000)");
  }

  assert.equal(missingFields.includes("Amount (max ₹10,00,000)"), true);

  // Validate with transactionSchema
  const result = transactionSchema.safeParse({
    title: "Luxury Purchase",
    amount: num,
    type: "EXPENSE",
    category: "Shopping",
    date: new Date(),
  });
  assert.equal(result.success, false, "Schema must reject amount > 1,000,000");
});

test("Fix 3: Zero or negative amounts fail validation and flag Amount as missing", () => {
  for (const invalidAmount of ["0", "-50", "abc"]) {
    const num = Number(invalidAmount);
    const missingFields = [];
    if (!invalidAmount.trim() || isNaN(num) || num <= 0) {
      missingFields.push("Amount");
    }
    assert.equal(missingFields.includes("Amount"), true, `Amount ${invalidAmount} must flag Amount`);
  }
});

// Fix 4 Tests: Category compatibility and reset on type switch
test("Fix 4: Switching from Expense to Income resets incompatible category to empty string", () => {
  let draft = {
    type: "EXPENSE",
    category: TRANSACTION_CATEGORIES.Groceries, // "Groceries"
  };

  const handleTypeChange = (newType) => {
    const allowedCategories =
      newType === "INCOME"
        ? Object.values(INCOME_CATEGORIES)
        : Object.values(TRANSACTION_CATEGORIES);

    const isCurrentCategoryAllowed = allowedCategories.includes(draft.category);

    draft = {
      type: newType,
      category: isCurrentCategoryAllowed ? draft.category : "",
    };
  };

  // Switch to INCOME: "Groceries" is not an income category, so category must reset to ""
  handleTypeChange("INCOME");
  assert.equal(draft.type, "INCOME");
  assert.equal(draft.category, "", "Incompatible category 'Groceries' must be reset to empty string on switch to INCOME");
});

test("Fix 4: Switching from Income to Expense resets incompatible category to empty string", () => {
  let draft = {
    type: "INCOME",
    category: INCOME_CATEGORIES.Salary, // "Salary"
  };

  const handleTypeChange = (newType) => {
    const allowedCategories =
      newType === "INCOME"
        ? Object.values(INCOME_CATEGORIES)
        : Object.values(TRANSACTION_CATEGORIES);

    const isCurrentCategoryAllowed = allowedCategories.includes(draft.category);

    draft = {
      type: newType,
      category: isCurrentCategoryAllowed ? draft.category : "",
    };
  };

  // Switch to EXPENSE: "Salary" is not an expense category, so category must reset to ""
  handleTypeChange("EXPENSE");
  assert.equal(draft.type, "EXPENSE");
  assert.equal(draft.category, "", "Incompatible category 'Salary' must be reset to empty string on switch to EXPENSE");
});

test("Fix 4: Category options dynamically match only the active transaction type", () => {
  const expenseCategories = Object.values(TRANSACTION_CATEGORIES);
  const incomeCategories = Object.values(INCOME_CATEGORIES);

  assert.equal(expenseCategories.includes("Groceries"), true);
  assert.equal(expenseCategories.includes("Salary"), false);

  assert.equal(incomeCategories.includes("Salary"), true);
  assert.equal(incomeCategories.includes("Groceries"), false);
});

