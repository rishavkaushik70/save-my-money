"use client";

import { ArrowUpRight, Check, Lightbulb, MessageCircle, Sparkles, Wallet } from "lucide-react";
import { FormEvent, useState } from "react";

const recommendations = {
  default: [
    { title: "Dining out", detail: "Spend 20% less to save about ₹2,300", amount: 2300 },
    { title: "Subscriptions", detail: "Review a recurring payment you rarely use", amount: 1200 },
    { title: "Weekly commute", detail: "Two more public-transport trips could help", amount: 1000 },
  ],
  dining: [
    { title: "Dining out", detail: "Try setting a weekly eating-out limit", amount: 2300 },
    { title: "Coffee runs", detail: "A few home-made coffees add up over a month", amount: 800 },
    { title: "Meal planning", detail: "Plan a few meals before your next shop", amount: 1200 },
  ],
  subscriptions: [
    { title: "Streaming services", detail: "Keep the services you use most", amount: 700 },
    { title: "App memberships", detail: "Review smaller recurring payments", amount: 500 },
    { title: "Annual plans", detail: "Compare annual and monthly billing", amount: 1000 },
  ],
  transport: [
    { title: "Weekly commute", detail: "Use public transport for two more trips", amount: 1000 },
    { title: "Ride sharing", detail: "Share a ride on your regular route", amount: 900 },
    { title: "Travel planning", detail: "Group errands into one trip", amount: 600 },
  ],
};

type RecommendationGroup = keyof typeof recommendations;

const exampleQuestions = [
  "How can I save ₹5,000 this month?",
  "Where can I reduce dining costs?",
  "Can I spend less on subscriptions?",
];

function getRecommendationGroup(question: string): RecommendationGroup {
  const normalizedQuestion = question.toLowerCase();

  if (/subscription|streaming|membership/.test(normalizedQuestion)) return "subscriptions";
  if (/transport|commute|travel|ride/.test(normalizedQuestion)) return "transport";
  if (/food|dining|restaurant|coffee|meal/.test(normalizedQuestion)) return "dining";
  return "default";
}

const AiFeature = () => {
  const [draft, setDraft] = useState("");
  const [question, setQuestion] = useState(exampleQuestions[0]);
  const currentRecommendations = recommendations[getRecommendationGroup(question)];
  const potentialSavings = currentRecommendations.reduce((total, item) => total + item.amount, 0);

  function askQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuestion = draft.trim();

    if (!trimmedQuestion) return;

    setQuestion(trimmedQuestion);
    setDraft("");
  }

  function chooseExample(example: string) {
    setQuestion(example);
    setDraft("");
  }

  return (
    <section id="ai-coach" className="landing-section scroll-mt-24 pt-4 sm:pt-8">
      <div className="landing-container ai-feature-grid mx-auto grid items-center gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
        <div className="max-w-[450px]">
          <div className="landing-pill mb-5 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold">
            <Sparkles className="size-3.5" /> Personalised with AI
          </div>
          <h2 className="landing-section-title max-w-[420px]">Ask a question. Get a clearer next step.</h2>
          <p className="landing-muted mt-4 max-w-[390px] text-sm leading-7 sm:text-base">
            Make sense of spending patterns with practical guidance built around your financial activity.
          </p>
          <ul className="mt-7 space-y-3.5">
            {[
              "Ask questions in natural language",
              "Get recommendations shaped around you",
              "Find small ways to save more",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm font-medium">
                <span className="landing-check flex size-5 shrink-0 items-center justify-center rounded-full"><Check className="size-3.5" /></span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="ai-showcase landing-surface relative rounded-[26px] border landing-border p-4 sm:p-7">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="landing-icon-box flex size-10 shrink-0 items-center justify-center rounded-[14px]"><Sparkles className="size-5" /></span>
              <span className="flex min-w-0 flex-col gap-0.5"><span className="text-sm font-semibold">Your AI money coach</span><span className="landing-muted text-xs">Interactive preview · sample data</span></span>
            </div>
            <span className="landing-status inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold"><span className="size-1.5 rounded-full bg-current" /> Preview</span>
          </div>

          <div className="mb-3 flex flex-wrap gap-2">
            {exampleQuestions.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => chooseExample(example)}
                aria-pressed={question === example}
                className="ai-example-chip rounded-full border landing-border px-3 py-2 text-[11px] font-medium"
              >
                {example}
              </button>
            ))}
          </div>

          <div aria-live="polite" className="ai-question mb-4 ml-auto flex max-w-[420px] items-start gap-2.5 rounded-2xl px-4 py-3.5 text-sm font-medium">
            <MessageCircle className="landing-accent-text mt-0.5 size-4 shrink-0" />
            <span>{question}</span>
          </div>

          <div className="ai-answer rounded-2xl border landing-border p-3.5 sm:p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <Lightbulb className="landing-accent-text size-4 shrink-0" /> A few ideas to get you started
            </div>
            <div className="space-y-2.5">
              {currentRecommendations.map((item) => (
                <div key={item.title} className="ai-suggestion flex items-center gap-2.5 rounded-xl px-2.5 py-3 sm:gap-3 sm:px-3">
                  <span className="landing-icon-box flex size-8 shrink-0 items-center justify-center rounded-lg sm:size-9 sm:rounded-xl"><Wallet className="size-4" /></span>
                  <span className="flex min-w-0 flex-1 flex-col gap-1"><span className="text-xs font-semibold">{item.title}</span><span className="landing-muted text-[11px] leading-4">{item.detail}</span></span>
                  <span className="landing-accent-text shrink-0 whitespace-nowrap text-[11px] font-semibold sm:text-xs">+₹{item.amount.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
            <div className="landing-border mt-4 flex items-center justify-between gap-3 border-t pt-4">
              <span className="landing-muted text-xs">Potential monthly savings</span>
              <span className="text-sm font-semibold">Up to ₹{potentialSavings.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <form onSubmit={askQuestion} className="ai-input mt-4 flex items-center gap-3 rounded-full border landing-border px-4 py-2">
            <label className="sr-only" htmlFor="money-coach-question">Ask a sample question about your finances</label>
            <input
              id="money-coach-question"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Try a question about your spending..."
              className="landing-ai-input min-w-0 flex-1 bg-transparent py-1 text-xs outline-none sm:text-sm"
            />
            <button
              type="submit"
              aria-label="Show a sample answer"
              disabled={!draft.trim()}
              className="landing-button flex size-8 shrink-0 items-center justify-center rounded-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowUpRight className="size-4" />
            </button>
          </form>
          <p className="landing-muted mt-2 px-2 text-[10px] leading-4">This preview uses example insights; it doesn’t connect to your account.</p>
        </div>
      </div>
    </section>
  );
};

export default AiFeature;
