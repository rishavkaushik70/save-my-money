import test from "node:test";
import assert from "node:assert/strict";

import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  TRANSACTION_CATEGORIES,
  normalizeCategory,
  getCategoryFilterValues,
  isCategoryAllowedForType,
} from "../src/lib/constants/transaction.ts";

import {
  parseQuickAddInput,
  matchesPhrase,
} from "../src/lib/quick-add-parser.ts";

// -------------------------------------------------------------
// Suite 1: Taxonomy Separation & Constants Integrity
// -------------------------------------------------------------

test("EXPENSE_CATEGORIES and INCOME_CATEGORIES are mutually exclusive lists", () => {
  const expenseValues = new Set(Object.values(EXPENSE_CATEGORIES));
  const incomeValues = new Set(Object.values(INCOME_CATEGORIES));

  assert.equal(expenseValues.size, 18, "Should have 18 canonical expense categories");
  assert.equal(incomeValues.size, 8, "Should have 8 canonical income categories");

  // Verify no accidental overlap between expense and income category names
  for (const exp of expenseValues) {
    assert.equal(
      incomeValues.has(exp),
      false,
      `Expense category '${exp}' must not exist in INCOME_CATEGORIES`,
    );
  }
});

test("Backward compatibility: TRANSACTION_CATEGORIES preserves legacy keys and aliases", () => {
  assert.equal(TRANSACTION_CATEGORIES.Groceries, "Groceries");
  assert.equal(TRANSACTION_CATEGORIES.Transport, "Transport");
  assert.equal(TRANSACTION_CATEGORIES.Food, "Food & Dining");
  assert.equal(TRANSACTION_CATEGORIES.Personal, "Personal Care");
  assert.equal(INCOME_CATEGORIES.Business, "Business Income");
  assert.equal(INCOME_CATEGORIES.Investment, "Investment Returns");
});

test("normalizeCategory normalizes legacy categories to canonical equivalents", () => {
  assert.equal(normalizeCategory("Food", "EXPENSE"), "Food & Dining");
  assert.equal(normalizeCategory("Personal", "EXPENSE"), "Personal Care");
  assert.equal(normalizeCategory("Food & Dining", "EXPENSE"), "Food & Dining");
  assert.equal(normalizeCategory("Business", "INCOME"), "Business Income");
  assert.equal(normalizeCategory("Investment", "INCOME"), "Investment Returns");
  assert.equal(normalizeCategory("Salary", "INCOME"), "Salary");
  assert.equal(normalizeCategory(null), "");
  assert.equal(normalizeCategory(undefined), "");
});

test("getCategoryFilterValues returns canonical and historical values for database queries", () => {
  const foodFilter = getCategoryFilterValues("Food & Dining", "EXPENSE");
  assert.equal(foodFilter.includes("Food & Dining"), true);
  assert.equal(foodFilter.includes("Food"), true);

  const personalFilter = getCategoryFilterValues("Personal Care", "EXPENSE");
  assert.equal(personalFilter.includes("Personal Care"), true);
  assert.equal(personalFilter.includes("Personal"), true);

  const groceriesFilter = getCategoryFilterValues("Groceries", "EXPENSE");
  assert.deepEqual(groceriesFilter, ["Groceries"]);
});

test("isCategoryAllowedForType enforces strict type boundaries", () => {
  assert.equal(isCategoryAllowedForType("Salary", "INCOME"), true);
  assert.equal(isCategoryAllowedForType("Salary", "EXPENSE"), false);

  assert.equal(isCategoryAllowedForType("Groceries", "EXPENSE"), true);
  assert.equal(isCategoryAllowedForType("Groceries", "INCOME"), false);

  // Historical aliases are allowed for their corresponding canonical type
  assert.equal(isCategoryAllowedForType("Food", "EXPENSE"), true);
  assert.equal(isCategoryAllowedForType("Food", "INCOME"), false);
  assert.equal(isCategoryAllowedForType("Personal", "EXPENSE"), true);
  assert.equal(isCategoryAllowedForType("Personal", "INCOME"), false);
});

// -------------------------------------------------------------
// Suite 2: Quick Add Parser - Canonical & Hinglish Categories
// -------------------------------------------------------------

test("Parser detects canonical and Hinglish expense categories", () => {
  const cases = [
    { input: "Bought vegetables for 300", expected: "Groceries" },
    { input: "Sabzi kharidi ₹250", expected: "Groceries" },
    { input: "Dinner with family ₹1200", expected: "Food & Dining" },
    { input: "Swiggy order 450", expected: "Food & Dining" },
    { input: "Petrol bharwaya ₹500", expected: "Transport" },
    { input: "Metro ticket 200", expected: "Transport" },
    { input: "Flat rent paid 18000", expected: "Housing & Rent" },
    { input: "Kiraya diya 12000", expected: "Housing & Rent" },
    { input: "Bijli bill 2400", expected: "Utilities" },
    { input: "Electricity bill paid 1800", expected: "Utilities" },
    { input: "Mobile recharge 299", expected: "Utilities" },
    { input: "Bought shirts at mall 3500", expected: "Shopping" },
    { input: "Doctor consultation fee 800", expected: "Health & Medical" },
    { input: "Bought medicines from pharmacy 650", expected: "Health & Medical" },
    { input: "College tuition fee 45000", expected: "Education" },
    { input: "Watched movie at cinema 500", expected: "Entertainment" },
    { input: "Haircut at salon 300", expected: "Personal Care" },
    { input: "Flight tickets booked 8500", expected: "Travel" },
    { input: "Credit card bill payment 15000", expected: "EMI & Loan Payments" },
    { input: "Car insurance premium 6000", expected: "Insurance" },
    { input: "Shagun for wedding 2100", expected: "Family & Gifts" },
    { input: "Mutual fund SIP 5000", expected: "Savings & Investments" },
  ];

  for (const { input, expected } of cases) {
    const draft = parseQuickAddInput(input);
    assert.equal(
      draft.category,
      expected,
      `Expected '${input}' to categorize as '${expected}', got '${draft.category}'`,
    );
  }
});

test("Parser detects canonical and Hinglish income categories", () => {
  const cases = [
    { input: "Received salary ₹50,000", expected: "Salary" },
    { input: "Received freelance payment ₹15,000", expected: "Freelance" },
    { input: "Client payment received ₹25,000", expected: "Business Income" },
    { input: "Dividend received ₹1,200", expected: "Investment Returns" },
    { input: "Rental income from tenant ₹18,000", expected: "Rental Income" },
    { input: "Kiraya mila ₹15,000", expected: "Rental Income" },
    { input: "Cashback refund received ₹350", expected: "Refunds" },
    { input: "Birthday gift received ₹5,000", expected: "Gifts Received" },
  ];

  for (const { input, expected } of cases) {
    const draft = parseQuickAddInput(input);
    assert.equal(draft.type, "INCOME");
    assert.equal(
      draft.category,
      expected,
      `Expected '${input}' to categorize as '${expected}', got '${draft.category}'`,
    );
  }
});

// -------------------------------------------------------------
// Suite 3: False Positive Prevention & Phrase Awareness
// -------------------------------------------------------------

test("Phrase matching prevents substring false positives", () => {
  // 'rent' must not trigger inside 'parents' or 'apparent'
  assert.equal(matchesPhrase("parents sent money", "rent"), false);
  assert.equal(matchesPhrase("apparent difference", "rent"), false);
  assert.equal(matchesPhrase("room rent", "rent"), true);
  assert.equal(matchesPhrase("paid rent 5000", "rent"), true);

  // 'bill' must not trigger inside 'billi' (cat) or 'billing'
  assert.equal(matchesPhrase("billi ke liye khana", "bill"), false);
  assert.equal(matchesPhrase("billing department", "bill"), false);

  // 'credit card bill' must match EMI & Loan Payments, NOT Utilities
  const ccResult = parseQuickAddInput("Paid credit card bill 5000");
  assert.equal(ccResult.category, "EMI & Loan Payments");

  // 'parents sent 5000' should not categorize as Housing & Rent
  const parentsResult = parseQuickAddInput("parents sent 5000");
  assert.notEqual(parentsResult.category, "Housing & Rent");
});

// -------------------------------------------------------------
// Suite 4: Conservative Ambiguity Handling
// -------------------------------------------------------------

test("Parser returns unresolved category (null) when multiple distinct categories match", () => {
  const ambiguousInputs = [
    "Bought groceries and medicines for 1200", // Groceries vs Health & Medical
    "Paid rent and electricity bill 15000",   // Housing & Rent vs Utilities
    "Dinner and movie with friends 1500",      // Food & Dining vs Entertainment
    "Metro recharge 200",                     // Transport (metro) vs Utilities (recharge)
  ];

  for (const input of ambiguousInputs) {
    const draft = parseQuickAddInput(input);
    assert.equal(
      draft.category,
      null,
      `Input '${input}' has ambiguous categories and must resolve to null, got '${draft.category}'`,
    );
    assert.equal(
      draft.needsReview,
      true,
      `Input '${input}' must require review`,
    );
  }
});

test("Parser returns single category when multiple keywords in the SAME category match", () => {
  // 'doctor' and 'medicine' both belong to Health & Medical
  const draft = parseQuickAddInput("Paid 1200 for doctor checkup and medicine");
  assert.equal(draft.type, "EXPENSE");
  assert.equal(draft.category, "Health & Medical");
  assert.equal(draft.needsReview, false);
});

// -------------------------------------------------------------
// Suite 5: Report & Dashboard Aggregation Normalization
// -------------------------------------------------------------

test("Legacy and canonical categories merge without duplicate report slices", () => {
  // Simulate database transactions with both legacy and canonical entries
  const rawExpenseTransactions = [
    { category: "Food", amount: 500 },
    { category: "Food & Dining", amount: 1500 },
    { category: "Personal", amount: 300 },
    { category: "Personal Care", amount: 700 },
    { category: "Transport", amount: 400 },
  ];

  // Aggregation logic (as implemented in ReportsPage and getExpensesByCategory)
  const totals = new Map();
  for (const t of rawExpenseTransactions) {
    const canonical = normalizeCategory(t.category, "EXPENSE") || "Other Expense";
    totals.set(canonical, (totals.get(canonical) ?? 0) + t.amount);
  }

  const aggregatedCategories = Array.from(totals, ([category, amount]) => ({
    category,
    amount,
  })).sort((a, b) => b.amount - a.amount);

  // Assert no duplicate categories exist
  const categoryNames = aggregatedCategories.map((c) => c.category);
  const uniqueNames = new Set(categoryNames);
  assert.equal(
    categoryNames.length,
    uniqueNames.size,
    "Aggregated categories must contain no duplicate slices",
  );

  // Verify totals were properly summed into canonical categories
  const foodTotal = totals.get("Food & Dining");
  assert.equal(foodTotal, 2000, "Food (500) and Food & Dining (1500) must sum to 2000");

  const personalTotal = totals.get("Personal Care");
  assert.equal(personalTotal, 1000, "Personal (300) and Personal Care (700) must sum to 1000");

  // Verify slice ordering
  assert.equal(aggregatedCategories[0].category, "Food & Dining");
  assert.equal(aggregatedCategories[1].category, "Personal Care");
  assert.equal(aggregatedCategories[2].category, "Transport");
});

test("Type switching in forms preserves valid historical categories and clears incompatible ones", () => {
  // Simulation of form category options generation and type switching
  const getOptionsForType = (type, historicalCategory) => {
    const canonicalValues = Array.from(
      new Set(
        type === "INCOME"
          ? Object.values(INCOME_CATEGORIES)
          : Object.values(EXPENSE_CATEGORIES),
      ),
    );

    const options = canonicalValues.map((cat) => ({
      label: cat,
      value: cat,
    }));

    if (
      historicalCategory &&
      !canonicalValues.includes(historicalCategory) &&
      isCategoryAllowedForType(historicalCategory, type)
    ) {
      options.unshift({
        label: `${historicalCategory} (Historical)`,
        value: historicalCategory,
      });
    }

    return options;
  };

  // 1. Initial edit of an existing transaction with historical category "Food"
  const expenseOptionsWithHistorical = getOptionsForType("EXPENSE", "Food");
  assert.equal(
    expenseOptionsWithHistorical.some((opt) => opt.value === "Food"),
    true,
    "Historical category 'Food' must be preserved in options when editing an Expense",
  );

  // 2. Incompatible historical category: "Food" is not allowed for INCOME
  const incomeOptionsWithHistorical = getOptionsForType("INCOME", "Food");
  assert.equal(
    incomeOptionsWithHistorical.some((opt) => opt.value === "Food"),
    false,
    "Historical category 'Food' must not be available when type is switched to INCOME",
  );

  // 3. Category reset behavior on type switch
  let currentCategory = "Food";
  const switchType = (newType) => {
    if (!isCategoryAllowedForType(currentCategory, newType)) {
      currentCategory = "";
    }
  };

  switchType("INCOME");
  assert.equal(
    currentCategory,
    "",
    "Incompatible category 'Food' must reset to empty string when switched to INCOME",
  );
});
