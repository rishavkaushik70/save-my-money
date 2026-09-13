import { Skeleton } from "@/components/ui/skeleton";

const PageSkeleton = () => {
  return (
    <main className="w-full bg-gray-100 px-4 pt-6 md:px-10 md:pt-10 min-h-[calc(100vh-68px)]">
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-full max-w-72" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>

        <Skeleton className="h-80 rounded-xl" />
      </div>
    </main>
  );
};

export default PageSkeleton;
