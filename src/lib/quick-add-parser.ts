import type { TransactionType } from "@/lib/constants/transaction";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from "@/lib/constants/transaction";

export type QuickAddDraft = {
  title: string | null;
  amount: number | null;
  type: TransactionType | null;
  category: string | null;
  date: Date | null;
  description: string;
  needsReview: boolean;
};

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Checks if a phrase exists in text with proper boundaries.
 * Prevents substring false positives (e.g., 'rent' matching 'parents', 'bill' matching 'billi').
 */
export function matchesPhrase(text: string, phrase: string): boolean {
  if (!text || !phrase) return false;
  const escaped = escapeRegex(phrase.toLowerCase().trim());
  const pattern = new RegExp(`(?:^|[^a-z0-9])${escaped}(?=[^a-z0-9]|$)`, "i");
  return pattern.test(text);
}

export function extractAmount(input: string): number | null {
  const normalizedInput = input.replace(/,/g, "");
  if (/(?:^|\s)-\s*\d/.test(input)) {
    return null;
  }

  const match = normalizedInput.match(/(?:₹|rs\.?\s*)?\s*(\d+(?:\.\d{1,2})?)/i);

  if (!match) {
    return null;
  }

  const amount = Number(match[1]);

  if (!Number.isFinite(amount) || amount <= 0 || amount > 1_000_000) {
    return null;
  }

  return amount;
}

export function extractTransactionType(input: string): TransactionType | null {
  const normalizedInput = input.toLowerCase();

  const expenseKeywords = [
    "spent",
    "spend",
    "bought",
    "buy",
    "paid",
    "bill payment",
    "kharch",
    "kharcha",
    "kiya",
    "lunch",
    "shopping",
    "udd",
    "udaa",
    "kharide",
    "khaye",
    "khilaye",
    "khaa",
    "khila",
    "bharwaya",
    "bharwaye",
  ];

  const incomeKeywords = [
    "salary",
    "received",
    "earned",
    "income",
    "credited",
    "kamaya",
    "mila",
    "milay",
    "milgya",
    "kamai",
    "kamayi",
  ];

  const hasExpenseKeyword = expenseKeywords.some((keyword) =>
    matchesPhrase(normalizedInput, keyword),
  );

  const hasIncomeKeyword = incomeKeywords.some((keyword) =>
    matchesPhrase(normalizedInput, keyword),
  );

  if (hasExpenseKeyword && !hasIncomeKeyword) {
    return "EXPENSE";
  }

  if (hasIncomeKeyword && !hasExpenseKeyword) {
    return "INCOME";
  }

  return null;
}

export const EXPENSE_CATEGORY_KEYWORDS: Record<string, string[]> = {
  [EXPENSE_CATEGORIES.Groceries]: [
    "groceries",
    "grocery",
    "sabzi",
    "sabji",
    "vegetables",
    "fruits",
    "ration",
    "kirana",
    "supermarket",
    "zepto",
    "blinkit",
    "instamart",
    "bigbasket",
  ],
  [EXPENSE_CATEGORIES.FoodAndDining]: [
    "food",
    "dining",
    "restaurant",
    "lunch",
    "dinner",
    "breakfast",
    "brunch",
    "snack",
    "snacks",
    "cafe",
    "coffee",
    "tea",
    "chai",
    "pizza",
    "burger",
    "biryani",
    "samosa",
    "dosa",
    "litti",
    "khana",
    "khaya",
    "nashta",
    "swiggy",
    "zomato",
  ],
  [EXPENSE_CATEGORIES.Transport]: [
    "petrol",
    "diesel",
    "fuel",
    "cng",
    "cab",
    "taxi",
    "uber",
    "ola",
    "bus",
    "train",
    "metro",
    "auto",
    "rickshaw",
    "rikashaw",
    "scooty",
    "bike",
    "parking",
    "toll",
    "fastag",
  ],
  [EXPENSE_CATEGORIES.HousingAndRent]: [
    "rent",
    "kiraya",
    "room rent",
    "flat rent",
    "house rent",
    "maintenance",
    "society maintenance",
  ],
  [EXPENSE_CATEGORIES.Utilities]: [
    "electricity bill",
    "water bill",
    "internet bill",
    "gas bill",
    "bijli bill",
    "pani bill",
    "wifi bill",
    "broadband",
    "electricity",
    "utility",
    "utilities",
    "lpg",
    "cylinder",
    "recharge",
    "mobile recharge",
  ],
  [EXPENSE_CATEGORIES.EmiAndLoan]: [
    "credit card bill",
    "credit card payment",
    "emi",
    "loan",
    "home loan",
    "car loan",
    "personal loan",
  ],
  [EXPENSE_CATEGORIES.Entertainment]: [
    "movie",
    "cinema",
    "netflix",
    "prime video",
    "hotstar",
    "theatre",
    "concert",
    "game",
    "gaming",
  ],
  [EXPENSE_CATEGORIES.Shopping]: [
    "shopping",
    "clothes",
    "clothing",
    "shoes",
    "shirt",
    "pants",
    "dress",
    "jeans",
    "mall",
    "myntra",
    "amazon shopping",
    "flipkart",
    "gadgets",
  ],
  [EXPENSE_CATEGORIES.HealthAndMedical]: [
    "health",
    "medical",
    "medicine",
    "medicines",
    "dawa",
    "dawain",
    "doctor",
    "clinic",
    "hospital",
    "pharmacy",
    "chemist",
    "lab test",
    "checkup",
  ],
  [EXPENSE_CATEGORIES.Education]: [
    "education",
    "tuition",
    "tution",
    "school fee",
    "college fee",
    "course",
    "books",
    "stationery",
    "udemy",
    "coaching",
  ],
  [EXPENSE_CATEGORIES.PersonalCare]: [
    "haircut",
    "salon",
    "parlour",
    "parlor",
    "spa",
    "grooming",
    "barber",
    "personal care",
  ],
  [EXPENSE_CATEGORIES.Travel]: [
    "travel",
    "flight",
    "airfare",
    "hotel",
    "resort",
    "vacation",
    "trip",
    "holiday",
    "makemytrip",
    "irctc",
  ],
  [EXPENSE_CATEGORIES.Insurance]: [
    "insurance",
    "term insurance",
    "life insurance",
    "health insurance",
    "car insurance",
    "bike insurance",
    "lic",
  ],
  [EXPENSE_CATEGORIES.FamilyAndGifts]: [
    "shagun",
    "gift",
    "gifts",
    "rakhi",
  ],
  [EXPENSE_CATEGORIES.SavingsAndInvestments]: [
    "sip",
    "mutual fund",
    "stocks",
    "shares",
    "fixed deposit",
    "gold investment",
  ],
  [EXPENSE_CATEGORIES.FeesAndCharges]: [
    "penalty",
    "late fee",
    "fine",
    "bank charges",
    "atm fee",
  ],
  [EXPENSE_CATEGORIES.Taxes]: [
    "income tax",
    "gst",
    "tds",
    "property tax",
    "tax",
    "taxes",
  ],
  [EXPENSE_CATEGORIES.OtherExpense]: [
    "miscellaneous",
    "other expense",
  ],
};

export const INCOME_CATEGORY_KEYWORDS: Record<string, string[]> = {
  [INCOME_CATEGORIES.Salary]: [
    "salary",
    "paycheck",
    "wages",
    "tankhwah",
    "vetan",
    "stipend",
  ],
  [INCOME_CATEGORIES.Freelance]: [
    "freelance",
    "freelancing",
    "contract work",
    "gig",
    "upwork",
    "fiverr",
  ],
  [INCOME_CATEGORIES.BusinessIncome]: [
    "business income",
    "business",
    "revenue",
    "sales",
    "client payment",
    "invoice payment",
    "dukaan",
  ],
  [INCOME_CATEGORIES.InvestmentReturns]: [
    "dividend",
    "dividends",
    "interest",
    "capital gains",
    "stock profit",
    "crypto profit",
    "investment return",
    "investment returns",
  ],
  [INCOME_CATEGORIES.RentalIncome]: [
    "rental income",
    "rent received",
    "tenant rent",
    "kiraya mila",
  ],
  [INCOME_CATEGORIES.Refunds]: [
    "refund",
    "cashback",
    "return refund",
    "reimbursement",
  ],
  [INCOME_CATEGORIES.GiftsReceived]: [
    "gift received",
    "shagun received",
    "birthday money",
  ],
  [INCOME_CATEGORIES.OtherIncome]: [
    "bonus",
    "lottery",
    "other income",
  ],
};

export function extractCategory(
  input: string,
  type?: TransactionType | null,
): string | null {
  const normalizedInput = input.toLowerCase();
  const matchedCategories = new Set<string>();

  const dictionariesToCheck: Record<string, string[]>[] = [];

  if (type === "INCOME") {
    dictionariesToCheck.push(INCOME_CATEGORY_KEYWORDS);
  } else if (type === "EXPENSE") {
    dictionariesToCheck.push(EXPENSE_CATEGORY_KEYWORDS);
  } else {
    // If type is unknown, check both expense and income keywords
    dictionariesToCheck.push(EXPENSE_CATEGORY_KEYWORDS);
    dictionariesToCheck.push(INCOME_CATEGORY_KEYWORDS);
  }

  for (const dict of dictionariesToCheck) {
    for (const [category, keywords] of Object.entries(dict)) {
      if (keywords.some((keyword) => matchesPhrase(normalizedInput, keyword))) {
        matchedCategories.add(category);
      }
    }
  }

  // Conservative rule: If multiple distinct categories match, require review
  if (matchedCategories.size === 1) {
    return Array.from(matchedCategories)[0];
  }

  return null;
}

export function extractTitle(input: string): string | null {
  const normalizedInput = input.toLowerCase();

  const titleKeywords: Record<string, string[]> = {
    Lunch: ["lunch"],
    Dinner: ["dinner"],
    Breakfast: ["breakfast"],
    Groceries: ["groceries", "grocery", "sabzi", "sabji", "ration", "saman"],
    "Electricity bill": ["electricity bill", "bijli bill"],
    "Water bill": ["water bill", "pani bill"],
    "Internet bill": ["internet bill", "broadband", "wifi bill"],
    Salary: ["salary", "stipend", "tankhwah"],
    Freelance: ["freelance", "gig", "upwork"],
    Rent: ["rent", "kiraya", "room rent"],
    Shopping: ["shopping", "clothes", "mall"],
    Petrol: ["petrol", "diesel", "fuel"],
    Transport: [
      "bus",
      "train",
      "metro",
      "taxi",
      "cab",
      "auto",
      "bike",
      "scooty",
      "car",
    ],
    Movie: ["movie", "cinema"],
    Medicine: ["medicine", "medicines", "dawa"],
    Doctor: ["doctor", "clinic", "hospital"],
    Tuition: ["tuition", "tution", "school fee", "college fee"],
    "Credit Card": ["credit card", "credit card bill"],
    Insurance: ["insurance", "lic"],
    Haircut: ["haircut", "salon", "parlour"],
  };

  for (const [title, keywords] of Object.entries(titleKeywords)) {
    if (keywords.some((keyword) => matchesPhrase(normalizedInput, keyword))) {
      return title;
    }
  }

  return null;
}

export function parseQuickAddInput(input: string): QuickAddDraft {
  const amount = extractAmount(input);
  const type = extractTransactionType(input);
  const category = extractCategory(input, type);
  const title = extractTitle(input);

  return {
    amount,
    type,
    category,
    title,
    date: null,
    description: input.trim(),
    needsReview: !amount || !type || !category || !title,
  };
}
