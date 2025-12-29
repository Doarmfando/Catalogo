import { Skeleton } from "@/shared/components/ui/skeleton";
import { AdminTopbar } from "@/features/admin-layout/components";

export default function TiposCombustibleLoading() {
  return (
    <>
      <AdminTopbar title="Gestión de Tipos de Combustible" />

      <div className="p-6">
        {/* Header with search and button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <Skeleton className="h-10 w-full sm:w-64" />
          <Skeleton className="h-10 w-full sm:w-48 rounded-lg" />
        </div>

        {/* Table skeleton */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <Skeleton className="h-4 w-24" />
                  </th>
                  <th className="px-6 py-3 text-left">
                    <Skeleton className="h-4 w-16" />
                  </th>
                  <th className="px-6 py-3 text-left">
                    <Skeleton className="h-4 w-20" />
                  </th>
                  <th className="px-6 py-3 text-left">
                    <Skeleton className="h-4 w-16" />
                  </th>
                  <th className="px-6 py-3 text-right">
                    <Skeleton className="h-4 w-20 ml-auto" />
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-12" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-8 w-8 rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
