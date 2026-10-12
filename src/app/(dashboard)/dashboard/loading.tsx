import { Skeleton } from "@/components/ui/skeleton";

export default function PageSkeleton() {
  return (
    <main className="min-w-0 w-full space-y-5 bg-slate-50 px-4 pb-8 pt-5 sm:px-6 sm:pt-6 lg:px-8 2xl:px-10">
      <div className="flex min-w-0 flex-col gap-5">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <Skeleton className="h-8 w-52 bg-slate-100" />
          <Skeleton className="mt-3 h-4 w-72 max-w-full bg-slate-100" />
          <Skeleton className="mt-8 h-2.5 w-full max-w-3xl rounded-full bg-slate-100" />
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <Skeleton className="h-4 w-28 bg-slate-100" />
              <Skeleton className="mt-4 h-8 w-36 bg-slate-100" />
              <Skeleton className="mt-4 h-3 w-28 bg-slate-100" />
            </div>
          ))}
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <section className="flex h-full min-w-0 flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <Skeleton className="h-3 w-28 bg-slate-100" />
                <Skeleton className="mt-2 h-6 w-56 max-w-full bg-slate-100" />
                <Skeleton className="mt-2 h-4 w-64 max-w-full bg-slate-100" />
              </div>
              <Skeleton className="h-7 w-12 shrink-0 rounded-full bg-slate-100" />
            </div>
            <div className="mt-5 flex flex-1 flex-col justify-evenly gap-2.5">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 p-3.5">
                  <Skeleton className="size-10 shrink-0 rounded-xl bg-slate-100" />
                  <div className="min-w-0 flex-1">
                    <Skeleton className="h-4 w-40 max-w-full bg-slate-100" />
                    <Skeleton className="mt-2 h-3 w-32 max-w-full bg-slate-100" />
                  </div>
                  <Skeleton className="h-8 w-20 shrink-0 rounded-xl bg-slate-100" />
                </div>
              ))}
            </div>
            <Skeleton className="mt-4 h-1.5 w-full rounded-full bg-slate-100" />
          </section>

          <section className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <Skeleton className="h-3 w-24 bg-slate-100" />
                <Skeleton className="mt-2 h-6 w-48 bg-slate-100" />
              </div>
              <Skeleton className="h-9 w-24 rounded-xl bg-slate-100" />
            </div>
            <div className="mt-3 divide-y divide-slate-100">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex min-w-0 items-center gap-3 py-3.5">
                  <Skeleton className="size-10 shrink-0 rounded-xl bg-slate-100" />
                  <div className="min-w-0 flex-1">
                    <Skeleton className="h-4 w-36 max-w-full bg-slate-100" />
                    <Skeleton className="mt-2 h-3 w-28 max-w-full bg-slate-100" />
                  </div>
                  <div className="shrink-0">
                    <Skeleton className="h-4 w-20 bg-slate-100" />
                    <Skeleton className="mt-2 h-3 w-12 bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 xl:col-span-2">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <Skeleton className="size-11 shrink-0 rounded-2xl bg-slate-100" />
                <div className="min-w-0">
                  <Skeleton className="h-3 w-28 bg-slate-100" />
                  <Skeleton className="mt-2 h-6 w-52 max-w-full bg-slate-100" />
                </div>
              </div>
              <Skeleton className="h-10 w-full rounded-xl bg-slate-100 sm:w-40" />
            </header>

            <div className="mt-4 flex items-center justify-between gap-3">
              <Skeleton className="h-3 w-48 max-w-[65%] bg-slate-100" />
              <Skeleton className="h-3 w-14 bg-slate-100" />
            </div>

            <div className="mt-2 grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(17rem,0.8fr)]">
              <div className="grid min-w-0 grid-cols-1 items-center gap-3 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(13rem,0.9fr)]">
                <div className="grid h-56 place-items-center sm:h-64">
                  <div className="grid size-44 place-items-center rounded-full border-[18px] border-slate-100 bg-white">
                    <div className="grid size-24 place-items-center rounded-full bg-slate-50">
                      <Skeleton className="h-4 w-16 bg-slate-100" />
                    </div>
                  </div>
                </div>
                <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-100 px-3 py-2">
                      <Skeleton className="size-2.5 shrink-0 rounded-full bg-slate-100" />
                      <Skeleton className="h-4 min-w-0 flex-1 bg-slate-100" />
                      <Skeleton className="h-4 w-16 shrink-0 bg-slate-100" />
                    </div>
                  ))}
                </div>
              </div>

              <aside className="min-w-0 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3.5 sm:p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Skeleton className="size-8 rounded-xl bg-white" />
                  <div>
                    <Skeleton className="h-3 w-28 bg-white" />
                    <Skeleton className="mt-1.5 h-4 w-40 bg-white" />
                  </div>
                </div>
                <div className="grid min-w-0 grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-1">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className={`min-w-0 rounded-xl border border-white bg-white/90 p-3 shadow-sm ${index === 2 ? "sm:col-span-2 md:col-span-1" : ""}`}>
                      <Skeleton className="h-3 w-24 bg-slate-100" />
                      <Skeleton className="mt-2 h-4 w-32 max-w-full bg-slate-100" />
                      <Skeleton className="mt-2 h-3 w-28 max-w-full bg-slate-100" />
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </section>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <Skeleton className="mb-3 h-6 w-40 bg-slate-100" />
          <Skeleton className="h-4 w-80 max-w-full bg-slate-100" />
        </div>
      </div>
    </main>
  );
}
