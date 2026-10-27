import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();

function readSource(relativeFilePath) {
  const fullPath = path.join(rootDir, relativeFilePath);
  return fs.readFileSync(fullPath, "utf-8");
}

test("Dashboard layout: Prevents unintentional horizontal scrollbars", () => {
  const layoutSource = readSource("src/app/(dashboard)/layout.tsx");

  assert.ok(
    layoutSource.includes("overflow-x-clip"),
    "Dashboard layout shell must specify overflow-x-clip to prevent horizontal scrollbars on mobile viewports",
  );
  assert.ok(
    layoutSource.includes('className="min-w-0 flex-1 overflow-x-clip"'),
    "Main dashboard content container must include overflow-x-clip",
  );
});

test("DashboardContent: Responsive mobile-first padding and spacing", () => {
  const contentSource = readSource("src/components/dashboard/DashboardContent.tsx");

  assert.ok(
    contentSource.includes("px-3.5") && contentSource.includes("sm:px-6"),
    "DashboardContent must use comfortable mobile gutters (px-3.5) scaling up on sm+ breakpoints",
  );
  assert.ok(
    contentSource.includes("space-y-4") && contentSource.includes("sm:space-y-5"),
    "DashboardContent must use responsive vertical card spacing",
  );
});

test("HeaderClient: Mobile menu drawer, touch targets, and notification constraints", () => {
  const headerSource = readSource("src/components/layout/Header/HeaderClient.tsx");

  // Mobile menu button touch target
  assert.ok(
    headerSource.includes("size-10 shrink-0 rounded-xl"),
    "Hamburger menu button should have a comfortable touch target (size-10)",
  );

  // Notifications popover viewport boundary
  assert.ok(
    headerSource.includes("max-w-[calc(100vw-1.5rem)]"),
    "Notification popover must constrain max width to prevent clipping on 320px screens",
  );

  // Mobile drawer width
  assert.ok(
    headerSource.includes("max-w-[85vw]"),
    "Mobile drawer must respect max-w-[85vw] so backdrop remains accessible",
  );

  // Close button touch target
  assert.ok(
    headerSource.includes('className="size-10 rounded-xl text-slate-500'),
    "Drawer close button should have a comfortable touch target (size-10)",
  );
});

test("MicButton: Circular geometry and flex safety", () => {
  const micSource = readSource("src/components/dashboard/QuickAdd/MicButton.tsx");

  assert.ok(
    micSource.includes("group shrink-0"),
    "MicButton wrapper must include shrink-0 to prevent flex parents from squashing circular shape",
  );
  assert.ok(
    micSource.includes("size-11 sm:size-12"),
    "MicButton must have minimum 44px (size-11) touch target on mobile viewports",
  );
  assert.ok(
    micSource.includes("mic-rotating-ring"),
    "MicButton must retain the continuous rotating gradient ring",
  );
});

test("QuickAddCard: Responsive layout, action buttons, and suggestion chips", () => {
  const cardSource = readSource("src/components/dashboard/QuickAdd/QuickAddCard.tsx");

  // Mobile padding
  assert.ok(
    cardSource.includes("p-3.5 shadow-sm") && cardSource.includes("sm:p-6"),
    "QuickAddCard must reduce padding on mobile (p-3.5) while keeping desktop padding (sm:p-6)",
  );

  // Stacked input and action button row
  assert.ok(
    cardSource.includes("flex flex-col gap-2.5 sm:flex-row sm:items-center"),
    "Form must stack on mobile (flex-col) and align horizontally on desktop (sm:flex-row)",
  );

  // Responsive action button row
  assert.ok(
    cardSource.includes("flex w-full items-center gap-2 sm:w-auto shrink-0"),
    "Mic and Parse button row must expand to full-width on mobile and auto-width on desktop",
  );

  // Parse button flexibility
  assert.ok(
    cardSource.includes("flex-1 sm:flex-initial"),
    "Parse Transaction button must expand on mobile (flex-1) and return to natural width on desktop",
  );

  // Suggestion chips touch targets and wrapping
  assert.ok(
    cardSource.includes("flex flex-wrap items-center gap-1.5 sm:gap-2"),
    "Suggestion chips must wrap naturally onto multiple lines",
  );
  assert.ok(
    cardSource.includes("min-h-[30px] sm:min-h-7"),
    "Suggestion chips must provide touch-friendly minimum heights",
  );
});

test("QuickAddReview: Single column on narrow screens, touch targets, and stacked actions", () => {
  const reviewSource = readSource("src/components/dashboard/QuickAdd/QuickAddReview.tsx");

  // Container padding
  assert.ok(
    reviewSource.includes("p-3.5 transition") && reviewSource.includes("sm:p-5"),
    "QuickAddReview must use responsive container padding (p-3.5 sm:p-5)",
  );

  // Grid responsiveness: 1 column on mobile, 2 columns on sm
  const gridMatches = reviewSource.match(/grid grid-cols-1 gap-3 sm:grid-cols-2/g);
  assert.equal(
    gridMatches?.length,
    3,
    "All three review form rows (Title/Amount, Type/Category, Date/Description) must use grid-cols-1 sm:grid-cols-2",
  );

  // Input heights for touch ergonomics
  assert.ok(
    reviewSource.includes("h-11 sm:h-10"),
    "Inputs must provide 44px (h-11) touch targets on mobile viewports",
  );

  // Type toggle height and min-w-0
  assert.ok(
    reviewSource.includes('role="radiogroup"') &&
    reviewSource.includes('aria-label="Transaction Type"') &&
    reviewSource.includes('className="flex h-11 gap-2"'),
    "Transaction type toggle must have 44px (h-11) height",
  );

  // Category trigger min-w-0 and truncate
  assert.ok(
    reviewSource.includes("min-w-0 truncate"),
    "Category SelectValue must be wrapped in min-w-0 truncate to prevent horizontal overflow",
  );

  // Stacked actions bar on mobile
  assert.ok(
    reviewSource.includes("flex flex-col-reverse gap-2.5 pt-3 border-t") &&
    reviewSource.includes("sm:flex-row sm:items-center sm:justify-between"),
    "Actions bar must stack on mobile (flex-col-reverse) with Save Transaction on top, flipping to sm:flex-row on desktop",
  );

  // Primary Save Transaction button prominence
  assert.ok(
    reviewSource.includes("h-11 w-full sm:w-auto"),
    "Save Transaction button must be full-width (w-full) with 44px height (h-11) on mobile",
  );
});

test("SummaryCards & SummaryCard: Reflow, typography clamping, and icon sizing", () => {
  const cardsSource = readSource("src/components/dashboard/TransactionSummaryCard/SummaryCards.tsx");
  const cardSource = readSource("src/components/dashboard/TransactionSummaryCard/SummaryCard.tsx");

  assert.ok(
    cardsSource.includes("grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4"),
    "SummaryCards must reflow from 1 col on mobile to 2 cols on tablet and 4 cols on desktop",
  );
  assert.ok(
    cardSource.includes("text-[clamp(1.15rem,4vw,1.75rem)]"),
    "SummaryCard amount must use fluid typography clamp to scale smoothly without overflow",
  );
  assert.ok(
    cardSource.includes("size-10 sm:size-11 shrink-0"),
    "SummaryCard icon must scale appropriately and remain shrink-0",
  );
});

test("RecentTransaction: Touch targets and row truncation", () => {
  const recentSource = readSource("src/components/dashboard/RecentTransaction/RecentTransaction.tsx");

  assert.ok(
    recentSource.includes("p-3.5 shadow-sm sm:p-5"),
    "RecentTransaction must use responsive card padding (p-3.5 sm:p-5)",
  );
  assert.ok(
    recentSource.includes("size-9 rounded-xl text-slate-500 hover:text-slate-900"),
    "Recent transaction row menu button must have comfortable touch target (size-9)",
  );
  assert.ok(
    recentSource.includes("aria-label={`Options for ${data.title}`}"),
    "Recent transaction row menu button must include descriptive accessible label",
  );
});

test("Dialog & AddTransactionForm: Responsive constraints and footer actions", () => {
  const dialogSource = readSource("src/components/ui/dialog.tsx");
  const formSource = readSource("src/components/transactions/AddTransactionDialog/add-transaction-form.tsx");

  assert.ok(
    dialogSource.includes("max-w-[calc(100%-1.5rem)]"),
    "DialogContent must provide comfortable margins on 320px screens",
  );
  assert.ok(
    dialogSource.includes("p-4 sm:p-6"),
    "DialogContent must use responsive padding (p-4 on mobile, sm:p-6 on desktop)",
  );
  assert.ok(
    formSource.includes("grid grid-cols-2 gap-2.5"),
    "AddTransactionForm type radio group must use grid grid-cols-2 gap-2.5",
  );
  assert.ok(
    formSource.includes("flex-col-reverse gap-2 sm:flex-row sm:justify-end"),
    "AddTransactionForm footer buttons must stack on mobile and row on desktop",
  );
});

test("Select & Dialog: Dropdown anti-overlap, stacking hierarchy, and scroll containment", () => {
  const selectSource = readSource("src/components/ui/select.tsx");
  const dialogSource = readSource("src/components/ui/dialog.tsx");

  assert.ok(
    selectSource.includes("alignItemWithTrigger = false"),
    "SelectContent must default alignItemWithTrigger to false to prevent popover from jumping over trigger and covering previous form fields",
  );
  assert.ok(
    selectSource.includes('side = "bottom"'),
    "SelectContent must default side to bottom to open naturally below the trigger",
  );
  assert.ok(
    selectSource.includes('z-[70]'),
    "SelectContent positioner and popup must sit at z-[70] above dialog z-50",
  );
  assert.ok(
    selectSource.includes("max-h-60 sm:max-h-72") && selectSource.includes("overflow-y-auto"),
    "SelectContent popup must have bounded height and vertical scroll for long category lists",
  );
  assert.ok(
    selectSource.includes("bg-white") && selectSource.includes("dark:bg-slate-900"),
    "SelectContent popup must have opaque background to prevent underlying labels and inputs from bleeding through",
  );
  assert.ok(
    dialogSource.includes("overscroll-contain"),
    "DialogContent must use overscroll-contain to prevent background document scrolling",
  );
});

