export const TRANSACTION_TYPES = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const;

export type TransactionType =
  (typeof TRANSACTION_TYPES)[keyof typeof TRANSACTION_TYPES];

/**
 * Canonical Expense Categories (18 categories)
 */
export const EXPENSE_CATEGORIES = {
  FoodAndDining: "Food & Dining",
  Groceries: "Groceries",
  Transport: "Transport",
  HousingAndRent: "Housing & Rent",
  Utilities: "Utilities",
  Shopping: "Shopping",
  HealthAndMedical: "Health & Medical",
  Education: "Education",
  Entertainment: "Entertainment",
  PersonalCare: "Personal Care",
  Travel: "Travel",
  EmiAndLoan: "EMI & Loan Payments",
  Insurance: "Insurance",
  FamilyAndGifts: "Family & Gifts",
  SavingsAndInvestments: "Savings & Investments",
  FeesAndCharges: "Fees & Charges",
  Taxes: "Taxes",
  OtherExpense: "Other Expense",
} as const;

export type ExpenseCategory =
  (typeof EXPENSE_CATEGORIES)[keyof typeof EXPENSE_CATEGORIES];

/**
 * Canonical Income Categories (8 categories)
 */
export const INCOME_CATEGORIES = {
  Salary: "Salary",
  Freelance: "Freelance",
  BusinessIncome: "Business Income",
  InvestmentReturns: "Investment Returns",
  RentalIncome: "Rental Income",
  Refunds: "Refunds",
  GiftsReceived: "Gifts Received",
  OtherIncome: "Other Income",
  // Legacy aliases for backward compatibility with existing code
  Business: "Business Income",
  Investment: "Investment Returns",
  Other: "Other Income",
} as const;

export type IncomeCategory =
  (typeof INCOME_CATEGORIES)[keyof typeof INCOME_CATEGORIES];

/**
 * Backward-compatible TRANSACTION_CATEGORIES mapping.
 * Includes all Expense categories plus legacy aliases (Food, Personal).
 */
export const TRANSACTION_CATEGORIES = {
  ...EXPENSE_CATEGORIES,
  // Legacy aliases for backward compatibility with existing constants and code
  Food: "Food & Dining",
  Personal: "Personal Care",
  Entertainment: "Entertainment",
  Shopping: "Shopping",
  Groceries: "Groceries",
  Utilities: "Utilities",
  Transport: "Transport",
} as const;

export type TransactionCategory =
  | ExpenseCategory
  | "Food"
  | "Personal";

/**
 * Mapping from historical/legacy category values to canonical names
 */
export const LEGACY_CATEGORY_MAP: Record<string, string> = {
  Food: "Food & Dining",
  Personal: "Personal Care",
  Investment: "Investment Returns",
  Business: "Business Income",
  Other: "Other Expense",
};

/**
 * Normalizes any category string (including legacy ones) to its canonical taxonomy name.
 */
export function normalizeCategory(
  category?: string | null,
  type?: TransactionType | null,
): string {
  const trimmed = category?.trim();
  if (!trimmed) return "";

  if (type === "INCOME") {
    if (trimmed === "Business") return "Business Income";
    if (trimmed === "Investment") return "Investment Returns";
    if (trimmed === "Other") return "Other Income";
    if (trimmed === "Salary") return "Salary";
    if (trimmed === "Freelance") return "Freelance";
  }

  if (LEGACY_CATEGORY_MAP[trimmed]) {
    return LEGACY_CATEGORY_MAP[trimmed];
  }

  return trimmed;
}

/**
 * Returns all database values that correspond to a canonical category (including historical aliases).
 * Used when querying or filtering so historical records are seamlessly matched.
 */
export function getCategoryFilterValues(
  category: string,
  type?: TransactionType | null,
): string[] {
  const canonical = normalizeCategory(category, type);
  const matched = [canonical];

  for (const [legacy, canonicalName] of Object.entries(LEGACY_CATEGORY_MAP)) {
    if (canonicalName === canonical && !matched.includes(legacy)) {
      matched.push(legacy);
    }
  }

  return matched;
}

/**
 * Checks whether a given category is valid for the specified transaction type.
 */
export function isCategoryAllowedForType(
  category: string,
  type: TransactionType,
): boolean {
  if (!category?.trim()) return false;
  const canonical = normalizeCategory(category, type);

  if (type === "INCOME") {
    const allowed = Object.values(INCOME_CATEGORIES) as readonly string[];
    return allowed.includes(canonical);
  }

  const allowed = Object.values(EXPENSE_CATEGORIES) as readonly string[];
  return allowed.includes(canonical);
}
