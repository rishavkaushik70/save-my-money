import { Skeleton } from "@/components/ui/skeleton";

export default function PageSkeleton() {
  return (
    <main className="w-full bg-gray-100 px-10 pt-10 min-h-[calc(100vh-68px)]">
      <div className="flex flex-col gap-6">
        {/* Welcome */}
        <div className="bg-white rounded-xl p-6 space-y-3">
          <Skeleton className="h-8 w-52 bg-gray-200" />
          <Skeleton className="h-4 w-72 bg-gray-200" />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl p-5 h-32">
              <div className="flex flex-col gap-4">
                <Skeleton className="h-4 w-28 bg-gray-200" />
                <Skeleton className="h-8 w-36 bg-gray-200" />
              </div>
            </div>
          ))}
        </div>

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5">
            <Skeleton className="h-6 w-36 bg-gray-200 mb-6" />
            <Skeleton className="h-56 w-full bg-gray-200" />
          </div>

          <div className="bg-white rounded-xl p-5">
            <Skeleton className="h-6 w-40 bg-gray-200 mb-6" />
            <Skeleton className="h-56 w-full bg-gray-200" />
          </div>

          <div className="bg-white rounded-xl p-5">
            <Skeleton className="h-6 w-40 bg-gray-200 mb-6" />
            <Skeleton className="h-56 w-full bg-gray-200" />
          </div>
        </div>

        {/* Tip Section */}
        <div className="bg-white rounded-xl p-6">
          <Skeleton className="h-6 w-40 bg-gray-200 mb-3" />
          <Skeleton className="h-4 w-80 bg-gray-200" />
        </div>
      </div>
    </main>
  );
}
