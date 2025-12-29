import { Skeleton } from "@/shared/components/ui/skeleton";
import { AdminTopbar } from "@/features/admin-layout/components";

export default function BannersLoading() {
  return (
    <>
      <AdminTopbar title="Gestión de Banners" />

      <div className="p-6">
        {/* Header with search and button */}
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>

        {/* Table skeleton */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Table header */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-4 px-6 py-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>

          {/* Table rows */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border-b border-gray-200 last:border-0">
              <div className="flex items-center gap-4 px-6 py-4">
                <Skeleton className="h-20 w-32 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
