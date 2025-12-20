import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { VersionsTable } from "@/features/admin-versions/components/versions-table";

export default function VersionesPage({ params }: { params: { id: string } }) {
  // Mock car data
  const carName = "Hyundai Accent";

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/autos"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Autos
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Versiones - {carName}
            </h1>
            <p className="text-gray-600 mt-1">
              Gestiona las versiones y colores de este modelo
            </p>
          </div>
          <Link
            href={`/admin/autos/${params.id}/versiones/nueva`}
            className="px-4 py-2 bg-[#002C5F] text-white rounded-lg hover:bg-[#0957a5] transition-colors font-medium flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Nueva Versión
          </Link>
        </div>
      </div>

      {/* Versions Table */}
      <VersionsTable carId={params.id} />
    </div>
  );
}
