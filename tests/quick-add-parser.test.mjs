import test from "node:test";
import assert from "node:assert/strict";
import {
  extractAmount,
  extractTransactionType,
  extractCategory,
  extractTitle,
  parseQuickAddInput,
} from "../src/lib/quick-add-parser.ts";

// test 1: Transaction amount test
test("extractAmount extracts a whole number", () => {
  assert.equal(extractAmount("Lunch 500"), 500);
});

test("extractAmount supports the rupee symbol", () => {
  assert.equal(extractAmount("Lunch ₹500"), 500);
});

test("extractAmount supports comma-separated amounts", () => {
  assert.equal(extractAmount("Shopping ₹1,500"), 1500);
});

test("extractAmount supports decimal amounts", () => {
  assert.equal(extractAmount("Lunch ₹250.50"), 250.5);
});

test("extractAmount returns null when no number exists", () => {
  assert.equal(extractAmount("Lunch today"), null);
});

test("extractAmount rejects zero", () => {
  assert.equal(extractAmount("Spent 0"), null);
});

test("extractAmount rejects negative amounts", () => {
  assert.equal(extractAmount("Spent -200"), null);
});

test("extractAmount rejects amounts above ₹10,00,000", () => {
  assert.equal(extractAmount("Spent 1000001"), null);
});

test("extractAmount accepts the maximum allowed amount", () => {
  assert.equal(extractAmount("Spent 1000000"), 1_000_000);
});

// test 2: Transaction type test

test("detects an expense from lunch input", () => {
  assert.equal(extractTransactionType("Aaj 500 ka lunch kiya"), "EXPENSE");
});

test("detects income from salary input", () => {
  assert.equal(extractTransactionType("Received salary 25000"), "INCOME");
});

test("detects expense from shopping input", () => {
  assert.equal(extractTransactionType("Spent 1500 on shopping"), "EXPENSE");
});

test("returns null when transaction type is unclear", () => {
  assert.equal(extractTransactionType("Aaj 500"), null);
});

test("returns null when income and expense keywords conflict", () => {
  assert.equal(extractTransactionType("Received salary and paid rent"), null);
});

// Test 3: transaction category test

test("detects groceries category", () => {
  assert.equal(extractCategory("Bought groceries for 800"), "Groceries");
});

test("detects utilities category", () => {
  assert.equal(extractCategory("Paid electricity bill 1200"), "Utilities");
});

test("detects entertainment category", () => {
  assert.equal(extractCategory("Watched a movie for 300"), "Entertainment");
});

test("detects transport category", () => {
  assert.equal(extractCategory("Paid 500 for petrol"), "Transport");
});

test("returns null when category is unclear", () => {
  assert.equal(extractCategory("Spent 500"), null);
});

// Test 4: transaction title test

test("extracts Lunch as a clean title", () => {
  assert.equal(extractTitle("Aaj lunch pe ₹250 kharch kiye"), "Lunch");
});

test("extracts Groceries as a clean title", () => {
  assert.equal(extractTitle("Bought groceries for ₹800"), "Groceries");
});

test("extracts Electricity bill as a clean title", () => {
  assert.equal(extractTitle("Paid electricity bill ₹1200"), "Electricity bill");
});

test("extracts Salary as a clean title", () => {
  assert.equal(extractTitle("Received salary ₹25000"), "Salary");
});

test("returns null when title is unclear", () => {
  assert.equal(extractTitle("Spent ₹500"), null);
});

// Test 5: transaction add input test

test("parses a complete groceries transaction", () => {
  const result = parseQuickAddInput("Bought groceries for ₹800");

  assert.equal(result.title, "Groceries");
  assert.equal(result.amount, 800);
  assert.equal(result.type, "EXPENSE");
  assert.equal(result.category, "Groceries");
  assert.equal(result.needsReview, false);
});

test("flags incomplete transactions for review", () => {
  const result = parseQuickAddInput("Spent ₹500");

  assert.equal(result.amount, 500);
  assert.equal(result.needsReview, true);
});

test("preserves the original input as description", () => {
  const input = "Bought groceries for ₹800";
  const result = parseQuickAddInput(input);

  assert.equal(result.description, input);
});

test("extracts Salary category from salary income input", () => {
  const result = parseQuickAddInput("Received salary ₹25000");

  assert.equal(result.amount, 25000);
  assert.equal(result.type, "INCOME");
  assert.equal(result.title, "Salary");
  assert.equal(result.category, "Salary");
  assert.equal(result.needsReview, false);
});

test("keeps income category null when no category keyword matches", () => {
  const result = parseQuickAddInput("Received ₹25000");

  assert.equal(result.amount, 25000);
  assert.equal(result.type, "INCOME");
  assert.equal(result.title, null);
  assert.equal(result.category, null);
  assert.equal(result.needsReview, true);
});

test("detects expense from Hinglish petrol input", () => {
  assert.equal(extractTransactionType("Petrol bharwaya ₹500"), "EXPENSE");
});
