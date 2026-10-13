import test from "node:test";
import assert from "node:assert/strict";

// Test 1: Validation Schema Integrity
test("Transaction schema validates fields correctly and enforces business limits", async () => {
  const { transactionSchema, MAX_TRANSACTION_AMOUNT } = await import(
    "../src/lib/validators/transactions.ts"
  );

  assert.equal(MAX_TRANSACTION_AMOUNT, 1_000_000, "Max transaction limit must be 1,000,000 INR");

  // Valid income transaction
  const validIncome = transactionSchema.safeParse({
    title: "Monthly Salary",
    type: "INCOME",
    amount: 75000,
    category: "Personal",
    date: new Date("2026-10-01"),
    description: "Primary job monthly payout",
  });
  assert.equal(validIncome.success, true, "Valid income transaction should pass");

  // Valid expense transaction
  const validExpense = transactionSchema.safeParse({
    title: "Grocery Store",
    type: "EXPENSE",
    amount: 1540.5,
    category: "Groceries",
    date: new Date("2026-10-10"),
    description: "Weekly supermarket run",
  });
  assert.equal(validExpense.success, true, "Valid expense transaction should pass");

  // Reject short or whitespace-only title
  const shortTitle = transactionSchema.safeParse({
    title: "Hi",
    type: "EXPENSE",
    amount: 500,
    category: "Food",
    date: new Date(),
  });
  assert.equal(shortTitle.success, false, "Title under 3 characters must be rejected");

  // Reject zero amount
  const zeroAmount = transactionSchema.safeParse({
    title: "Zero Dollar",
    type: "EXPENSE",
    amount: 0,
    category: "Food",
    date: new Date(),
  });
  assert.equal(zeroAmount.success, false, "Amount of 0 must be rejected");

  // Reject negative amount
  const negativeAmount = transactionSchema.safeParse({
    title: "Negative Amount",
    type: "EXPENSE",
    amount: -250,
    category: "Shopping",
    date: new Date(),
  });
  assert.equal(negativeAmount.success, false, "Negative amount must be rejected");

  // Reject amount exceeding ₹10,00,000 limit
  const excessAmount = transactionSchema.safeParse({
    title: "Luxury Supercar",
    type: "EXPENSE",
    amount: 1_000_000.01,
    category: "Shopping",
    date: new Date(),
  });
  assert.equal(excessAmount.success, false, "Amount above ₹10,00,000 limit must be rejected");

  // Accept exact maximum ₹10,00,000 limit
  const maxBoundaryAmount = transactionSchema.safeParse({
    title: "Down Payment",
    type: "EXPENSE",
    amount: 1_000_000,
    category: "Shopping",
    date: new Date(),
  });
  assert.equal(maxBoundaryAmount.success, true, "Amount exactly ₹10,00,000 must be accepted");

  // Reject invalid transaction type
  const invalidType = transactionSchema.safeParse({
    title: "Dividend Payout",
    type: "TRANSFER",
    amount: 5000,
    category: "Personal",
    date: new Date(),
  });
  assert.equal(invalidType.success, false, "Invalid type outside of INCOME/EXPENSE must be rejected");

  // Reject future date
  const futureDate = new Date(Date.now() + 86400000 * 5); // 5 days in future
  const futureTransaction = transactionSchema.safeParse({
    title: "Future Plan",
    type: "EXPENSE",
    amount: 500,
    category: "Food",
    date: futureDate,
  });
  assert.equal(futureTransaction.success, false, "Future date must be rejected");
});

// Test 2: Date Formatting for Edit Form
test("formatDateForInput handles all input types safely and accurately", async () => {
  const { formatDateForInput } = await import(
    "../src/components/transactions/AddTransactionDialog/add-transaction-form.tsx"
  );

  // Date object
  const dateObj = new Date("2026-05-14T10:30:00");
  assert.equal(formatDateForInput(dateObj), "2026-05-14", "Date object should format to YYYY-MM-DD");

  // String date
  assert.equal(
    formatDateForInput("2026-11-20"),
    "2026-11-20",
    "String date should format to YYYY-MM-DD"
  );

  // Null / undefined fallback
  const fallback = formatDateForInput(null);
  const todayRegex = /^\d{4}-\d{2}-\d{2}$/;
  assert.match(fallback, todayRegex, "Null input should default to current date in YYYY-MM-DD");

  // Invalid date string
  const invalidFallback = formatDateForInput("not-a-real-date");
  assert.match(invalidFallback, todayRegex, "Invalid string input should fallback to YYYY-MM-DD");
});

// Test 3: Type switching integrity
test("Transaction type switching preserves valid schema structure", async () => {
  const { transactionSchema } = await import(
    "../src/lib/validators/transactions.ts"
  );

  // Original transaction: Expense
  const expenseData = {
    title: "Freelance Payment",
    type: "EXPENSE",
    amount: 45000,
    category: "Personal",
    date: new Date("2026-09-15"),
    description: "Inadvertently marked as expense",
  };
  const parsedExpense = transactionSchema.safeParse(expenseData);
  assert.equal(parsedExpense.success, true);

  // Switch type to Income
  const convertedToIncome = transactionSchema.safeParse({
    ...expenseData,
    type: "INCOME",
  });
  assert.equal(convertedToIncome.success, true, "Switching transaction type from EXPENSE to INCOME must be valid");
  assert.equal(convertedToIncome.data?.type, "INCOME");
});
