import {
  Brain,
  ChartCandlestick,
  ChartNoAxesColumn,
  CreditCard,
  ShieldCheck,
  Target,
} from "lucide-react";

const features = [
  {
    icon: ChartNoAxesColumn,
    title: "Smart analytics",
    description: "See where your money goes with clear charts and spending patterns.",
  },
  {
    icon: Brain,
    title: "AI financial advisor",
    description: "Get personal suggestions shaped around your everyday finances.",
  },
  {
    icon: Target,
    title: "Budget planning",
    description: "Set flexible limits and keep your goals moving in the right direction.",
  },
  {
    icon: CreditCard,
    title: "Subscription tracker",
    description: "Keep recurring expenses in view and stay ahead of payment dates.",
  },
  {
    icon: ChartCandlestick,
    title: "Investment insights",
    description: "Bring your investments into the bigger picture of your money.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & private",
    description: "Manage your finances with privacy and security in mind.",
  },
];

const FeaturesCard = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {features.map(({ icon: Icon, title, description }) => (
        <article key={title} className="feature-card landing-surface group rounded-[22px] border landing-border p-6 sm:p-7">
          <div className="landing-icon-box mb-6 flex size-11 items-center justify-center rounded-[14px] transition-transform group-hover:-translate-y-0.5">
            <Icon className="size-[19px]" strokeWidth={1.8} />
          </div>
          <h3 className="mb-2 text-[15px] font-semibold tracking-[-0.02em]">{title}</h3>
          <p className="landing-muted text-sm leading-6">{description}</p>
        </article>
      ))}
    </div>
  );
};

export default FeaturesCard;
