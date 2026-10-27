import Image from "next/image";
import { Sparkles } from "lucide-react";
import type { User } from "@/types/auth";
type WelcomeCardProps = {
  user: User;
  progress: number;
};
const WelcomeCard = ({ user, progress }: WelcomeCardProps) => {
  return (
    <section className="relative isolate min-w-0 overflow-hidden rounded-[28px] border border-emerald-100 bg-gradient-to-br from-white via-white to-emerald-50 p-4 shadow-sm sm:p-7 lg:p-8">
      <div className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-emerald-100/50 blur-3xl" />
      <div className="relative flex min-w-0 items-start justify-between gap-4 sm:gap-6">
        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-800">
            <Sparkles className="size-3.5" />
            Your money overview
          </span>
          <h1 className="mt-3 sm:mt-4 break-words text-xl font-bold tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
            Welcome back, {user.name ?? "there"}! <span aria-hidden="true">👋</span>
          </h1>
          <p className="mt-1.5 sm:mt-2 max-w-xl text-xs sm:text-sm leading-5 sm:leading-6 text-slate-600">
            A clearer view of your spending, goals, and the progress you&apos;re making.
          </p>
        </div>
        <div className="relative hidden shrink-0 rounded-3xl bg-white/80 p-2 shadow-sm ring-1 ring-emerald-100 md:block">
          <Image
            src="/checklist.svg"
            height={132}
            width={132}
            alt=""
            aria-hidden="true"
            className="size-24 object-contain lg:size-32"
            priority={false}
          />
        </div>
      </div>

      <div className="relative mt-5 sm:mt-7 max-w-3xl rounded-2xl border border-emerald-100/80 bg-white/75 p-3.5 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-semibold text-slate-800">Setup progress</span>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
            {progress}% complete
          </span>
        </div>
        <div
          className="h-2.5 overflow-hidden rounded-full bg-slate-100"
          role="progressbar"
          aria-label="Setup progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-green-400 transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  );
};

export default WelcomeCard;
