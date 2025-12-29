import { Skeleton } from "@/shared/components/ui/skeleton";
import { AdminTopbar } from "@/features/admin-layout/components";

export default function EditColorLoading() {
  return (
    <>
      <AdminTopbar title="Editar Color" />

      <div className="p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Skeleton className="h-9 w-36" />
            <Skeleton className="h-10 w-full sm:w-40 rounded-lg" />
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Skeleton className="h-6 w-36 mb-6" />

            <div className="space-y-4">
              {/* 3 campos + preview del color */}
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-28 mb-1" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              ))}
              <div className="flex items-center gap-3">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
