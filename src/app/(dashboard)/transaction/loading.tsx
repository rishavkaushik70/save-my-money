import { Skeleton } from "@/components/ui/skeleton";

const TransactionLoading = () => {
  return (
    <main className="w-full bg-gray-100 md:px-10 md:pt-10 flex flex-col gap-6 md:pb-1 min-h-[calc(100vh-68px)] p-2">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 h-32 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="size-10 rounded-lg" />
          </div>

          <Skeleton className="h-7 w-28" />
        </div>

        <div className="bg-white rounded-xl p-5 h-32 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="size-10 rounded-lg" />
          </div>

          <Skeleton className="h-7 w-32" />
        </div>

        <div className="bg-white rounded-xl p-5 h-32 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="size-10 rounded-lg" />
          </div>

          <Skeleton className="h-7 w-32" />
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-xl p-5">
        {/* List Header */}
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>

        {/* Transactions */}
        <div className="flex flex-col">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-5 border-b last:border-b-0"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="size-10 rounded-full" />

                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default TransactionLoading;
