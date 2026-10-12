import { ChevronDown } from "lucide-react";

const questions = [
  {
    question: "Can I start using SaveMyMoney for free?",
    answer:
      "Yes. The Free plan includes the essentials for tracking your income, expenses, reports, and a financial goal. You can upgrade whenever you need more.",
  },
  {
    question: "What can the AI financial advisor help with?",
    answer:
      "It can help you understand spending patterns and find practical ways to work toward your savings goals using your financial activity.",
  },
  {
    question: "Can I change plans later?",
    answer:
      "You can choose the plan that suits you now and move to another plan as your needs change.",
  },
  {
    question: "Is my financial information protected?",
    answer:
      "SaveMyMoney is built with privacy and security in mind. Your account also gives you controls for managing your profile and data.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="landing-section pt-4 sm:pt-8">
      <div className="landing-container-faq mx-auto">
        <div className="mb-9 text-center">
          <p className="landing-eyebrow mb-3">A few quick answers</p>
          <h2 className="landing-section-title">Good to know</h2>
        </div>
        <div className="space-y-3">
          {questions.map((item) => (
            <details key={item.question} className="landing-faq-card landing-surface group rounded-2xl border landing-border px-5 sm:px-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-sm font-semibold sm:text-[15px] [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <span className="landing-icon-box flex size-8 shrink-0 items-center justify-center rounded-full">
                  <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
                </span>
              </summary>
              <p className="landing-muted max-w-[650px] pb-5 pr-10 text-sm leading-6">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
