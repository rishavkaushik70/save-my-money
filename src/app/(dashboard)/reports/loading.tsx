const SkeletonBlock = ({ className = "" }: { className?: string }) => (
  <div
    aria-hidden="true"
    className={`animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800 ${className}`}
  />
);

export default function ReportsLoading() {
  return (
    <div
      aria-label="Loading financial reports"
      className="min-w-0 w-full space-y-5 bg-slate-50 px-4 pb-8 pt-5 dark:bg-slate-950 sm:space-y-6 sm:px-6 sm:pt-6 lg:px-8 2xl:px-10"
    >
      <div className="flex min-h-40 flex-col justify-between gap-5 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 lg:flex-row lg:items-center dark:border-slate-800 dark:bg-[#111b16]">
        <div className="space-y-3">
          <SkeletonBlock className="h-6 w-36 rounded-full" />
          <SkeletonBlock className="h-9 w-64 max-w-full" />
          <SkeletonBlock className="h-4 w-[min(32rem,80vw)] max-w-full" />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <SkeletonBlock className="h-11 w-full sm:w-44" />
          <SkeletonBlock className="h-11 w-full sm:w-32" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="min-w-0 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:bg-[#111b16]"
          >
            <div className="flex justify-between gap-3">
              <div className="space-y-3">
                <SkeletonBlock className="h-3 w-24" />
                <SkeletonBlock className="h-8 w-32" />
              </div>
              <SkeletonBlock className="size-11 rounded-2xl" />
            </div>
            <SkeletonBlock className="mt-4 h-3 w-36" />
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.85fr)]">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#111b16]">
          <SkeletonBlock className="h-3 w-24" />
          <SkeletonBlock className="mt-2 h-6 w-52" />
          <SkeletonBlock className="mt-1 h-3 w-40" />
          <SkeletonBlock className="mt-5 h-72 w-full rounded-2xl" />
        </div>
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#111b16]">
          <SkeletonBlock className="h-3 w-24" />
          <SkeletonBlock className="mt-2 h-6 w-48" />
          <SkeletonBlock className="mt-1 h-3 w-40" />
          <div className="mt-7 space-y-5">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index}>
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="mt-2 h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <SkeletonBlock className="h-80 rounded-3xl" />
        <SkeletonBlock className="h-80 rounded-3xl" />
      </div>
    </div>
  );
}
