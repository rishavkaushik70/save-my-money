import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-[calc(100vh-68px)] w-full min-w-0 space-y-6 bg-slate-50 px-4 pb-8 pt-5 sm:px-6 sm:pt-6 lg:px-8 2xl:px-10">
      <header className="flex min-w-0 flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div className="min-w-0">
          <Skeleton className="h-6 w-40 rounded-full bg-slate-100" />
          <Skeleton className="mt-3 h-8 w-72 max-w-full bg-slate-100 sm:h-9" />
          <Skeleton className="mt-2 h-4 w-full max-w-xl bg-slate-100" />
        </div>
        <Skeleton className="h-11 w-full rounded-2xl bg-slate-100 sm:w-36" />
      </header>

      <div className="grid min-w-0 grid-cols-1 items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <section key={index} className="flex h-full min-h-[25rem] min-w-0 flex-col rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <Skeleton className="size-12 shrink-0 rounded-2xl bg-slate-100 sm:size-14" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-20 rounded-full bg-slate-100" />
                <Skeleton className="size-9 rounded-xl bg-slate-100" />
              </div>
            </div>

            <div className="mt-4">
              <Skeleton className="h-3 w-20 bg-slate-100" />
              <Skeleton className="mt-2 h-6 w-48 max-w-full bg-slate-100" />
              <Skeleton className="mt-2 h-4 w-full max-w-[15rem] bg-slate-100" />
              <Skeleton className="mt-1.5 h-4 w-4/5 max-w-[12rem] bg-slate-100" />
            </div>

            <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <Skeleton className="h-3 w-20 bg-white" />
                  <Skeleton className="mt-2 h-6 w-28 bg-white" />
                </div>
                <div>
                  <Skeleton className="h-3 w-12 bg-white" />
                  <Skeleton className="mt-2 h-5 w-24 bg-white" />
                </div>
              </div>
              <Skeleton className="mt-4 h-2.5 w-full rounded-full bg-white" />
              <div className="mt-2 flex justify-between gap-3">
                <Skeleton className="h-3 w-20 bg-white" />
                <Skeleton className="h-3 w-24 bg-white" />
              </div>
            </div>

            <div className="mt-4 flex justify-between gap-3">
              <Skeleton className="h-4 w-24 bg-slate-100" />
              <Skeleton className="h-4 w-20 bg-slate-100" />
            </div>
            <div className="mt-auto pt-5">
              <Skeleton className="h-11 w-full rounded-xl bg-slate-100" />
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
