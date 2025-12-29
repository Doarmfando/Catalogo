import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminTopbarWrapper } from "@/features/admin-layout/components";
import { FuelTypeForm } from "@/features/admin-fuel-types/components";
import { getFuelTypeByIdAdmin } from "@/lib/supabase/queries/admin-fuel-types";

export default async function EditarTipoCombustiblePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const fuelType = await getFuelTypeByIdAdmin(id);

  if (!fuelType) {
    notFound();
  }

  return (
    <>
      <AdminTopbarWrapper title={`Editar: ${fuelType.name}`} />

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
          <h1 className="text-2xl font-bold text-gray-900">
            Editar: {fuelType.name}
          </h1>
        </div>

        {/* Form */}
        <FuelTypeForm initialData={fuelType} mode="edit" />
      </div>
    </>
  );
}
