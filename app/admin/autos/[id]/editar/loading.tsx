import { Skeleton } from "@/shared/components/ui/skeleton";
import { AdminTopbar } from "@/features/admin-layout/components";

export default function EditCarLoading() {
  return (
    <>
      <AdminTopbar title="Editar Auto" />

      <div className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Skeleton className="h-9 w-36" />
            <Skeleton className="h-10 w-full sm:w-40 rounded-lg" />
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <Skeleton className="h-6 w-40 mb-4" />

                <div className="space-y-4">
                  {/* 6 campos de formulario */}
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Prices & Images */}
            <div className="space-y-6">
              {/* Pricing Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <Skeleton className="h-6 w-24 mb-4" />

                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Images Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <Skeleton className="h-6 w-32 mb-4" />

                <div className="space-y-4">
                  {/* Image upload boxes */}
                  {[1, 2].map((i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-28 mb-1" />
                      <Skeleton className="h-32 w-full rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
