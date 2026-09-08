import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="w-full bg-gray-100 px-10 pt-10 min-h-[calc(100vh-68px)]">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-4 w-72" />
        </div>

        <Skeleton className="h-10 w-32 rounded-md" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white rounded-md p-5 space-y-6">
            <div className="flex gap-4">
              <Skeleton className="size-25 rounded-md" />

              <div className="space-y-3 flex-1">
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>

            <Skeleton className="h-7 w-40" />

            <Skeleton className="h-2.5 w-full rounded-full" />

            <div className="flex justify-between">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-32" />
            </div>

            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}
      </div>
    </main>
  );
}
