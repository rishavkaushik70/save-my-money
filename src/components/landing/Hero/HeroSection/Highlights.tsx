import { Brain, Handshake, ShieldCheck } from "lucide-react";

const highlights = [
  { icon: ShieldCheck, title: "Privacy comes first", detail: "Your data stays yours" },
  { icon: Brain, title: "Insights that make sense", detail: "A clearer view of spending" },
  { icon: Handshake, title: "Made for real life", detail: "Plans for every money goal" },
];

const Highlights = () => {
  return (
    <div className="hero-highlights mx-auto grid w-full max-w-[1240px] grid-cols-1 gap-3 px-5 pt-10 sm:grid-cols-3 sm:px-8 md:gap-4 lg:px-0">
      {highlights.map(({ icon: Icon, title, detail }) => (
        <div key={title} className="landing-surface flex min-h-16 min-w-0 items-center gap-3 rounded-2xl border landing-border px-3 py-3 sm:gap-2 sm:px-2 lg:gap-3 lg:px-3">
          <span className="landing-icon-box flex size-10 shrink-0 items-center justify-center rounded-xl sm:size-9 lg:size-10"><Icon className="size-[19px]" /></span>
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="text-[13px] font-semibold leading-5">{title}</span>
            <span className="landing-muted text-xs leading-4">{detail}</span>
          </span>
        </div>
      ))}
    </div>
  );
};

export default Highlights;
