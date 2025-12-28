import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { AdminTopbar } from "@/features/admin-layout/components";
import { VersionsTable } from "@/features/admin-versions/components/versions-table";
import { getCarByIdAdmin } from "@/lib/supabase/queries/admin-cars";
import { getVersionsByCar } from "@/lib/supabase/queries/admin-versions";
import { notFound } from "next/navigation";

export default async function VersionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [car, versions] = await Promise.all([
    getCarByIdAdmin(id),
    getVersionsByCar(id),
  ]);

  if (!car) {
    notFound();
  }

  return (
    <>
      <AdminTopbar title={`Versiones: ${car.name}`} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/admin/autos"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Autos
          </Link>

          <Link
            href={`/admin/autos/${id}/versiones/nueva`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#002C5F] text-white rounded-lg hover:bg-[#0957a5] transition-colors font-medium"
          >
            <Plus className="h-5 w-5" />
            Nueva Versión
          </Link>
        </div>

        {/* Info del Auto */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            {car.image_url && (
              <img
                src={car.image_url}
                alt={car.name}
                className="w-24 h-16 object-cover rounded"
              />
            )}
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{car.name}</h2>
              <p className="text-sm text-gray-500">
                {car.brands?.name} • {car.year} • {car.categories?.name}
              </p>
            </div>
          </div>
        </div>

        {/* Tabla de Versiones */}
        <VersionsTable carId={id} versions={versions} />
      </div>
    </>
  );
}
