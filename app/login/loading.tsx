import { Skeleton } from "@/shared/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-[400px] bg-white/95 backdrop-blur-sm p-12 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.08)] flex flex-col gap-8">
        {/* Title Skeleton */}
        <div className="flex flex-col items-center">
          <Skeleton className="h-10 w-64" />
        </div>

        {/* Form Skeletons */}
        <div className="flex flex-col gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-6 w-48 mx-auto" />
        </div>
      </div>
    </div>
  );
}
