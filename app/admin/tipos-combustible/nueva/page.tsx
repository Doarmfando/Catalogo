import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminTopbar } from "@/features/admin-layout/components";
import { FuelTypeForm } from "@/features/admin-fuel-types/components";

export default function NuevoTipoCombustiblePage() {
  return (
    <>
      <AdminTopbar title="Nuevo Tipo de Combustible" />

      <div className="p-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin/tipos-combustible"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Tipos de Combustible
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Nuevo Tipo de Combustible</h1>
        </div>

        {/* Form */}
        <FuelTypeForm mode="create" />
      </div>
    </>
  );
}
