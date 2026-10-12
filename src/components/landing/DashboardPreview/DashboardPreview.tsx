import Image from "next/image";
import { ArrowUpRight, Sparkles, TrendingUp } from "lucide-react";

const DashboardPreview = () => {
  return (
    <div id="howItWorks" className="dashboard-preview relative mx-auto w-full max-w-[650px] scroll-mt-28">
      <div className="dashboard-preview-glow" aria-hidden="true" />
      <div className="dashboard-image-frame landing-surface relative overflow-hidden rounded-[24px] border landing-border p-1.5 sm:rounded-[28px] sm:p-2">
        <Image
          src="/Dashboard 2.PNG"
          alt="SaveMyMoney dashboard with balance cards, spending insights, transactions, and a monthly trend chart"
          width={1536}
          height={1024}
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="h-auto w-full rounded-[18px] sm:rounded-[22px]"
        />
      </div>
      <div className="dashboard-float-card landing-surface absolute -bottom-5 left-3 flex items-center gap-3 rounded-2xl border landing-border p-3.5 sm:bottom-5 sm:-left-8 sm:p-4">
        <span className="landing-icon-box flex size-10 items-center justify-center rounded-xl"><Sparkles className="size-5" /></span>
        <span className="flex flex-col gap-0.5">
          <span className="landing-muted text-[10px] font-medium uppercase tracking-[0.08em]">A little more clarity</span>
          <span className="text-xs font-semibold sm:text-sm">Your money, at a glance</span>
        </span>
        <ArrowUpRight className="landing-accent-text ml-1 size-4" />
      </div>
      <span
        className="dashboard-orbit grid place-items-center"
        role="img"
        aria-label="Savings trend is moving up"
        style={{
          color: "var(--lp-accent)",
          background: "linear-gradient(145deg, var(--lp-accent-soft), var(--lp-surface))",
          borderColor: "color-mix(in srgb, var(--lp-accent) 24%, transparent)",
          boxShadow: "0 12px 28px rgb(31 64 43 / 13%)",
        }}
      >
        <TrendingUp className="size-5" aria-hidden="true" strokeWidth={2.4} />
      </span>
    </div>
  );
};

export default DashboardPreview;
