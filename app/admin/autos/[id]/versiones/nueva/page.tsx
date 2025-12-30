import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminTopbarClient } from "@/features/admin-layout/components";
import { VersionForm } from "@/features/admin-versions/components/version-form";
import { getCarByIdAdmin } from "@/lib/supabase/queries/admin-cars";
import { notFound } from "next/navigation";

export default async function NuevaVersionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const car = await getCarByIdAdmin(id);

  if (!car) {
    notFound();
  }

  return (
    <>
      <AdminTopbarClient title={`Nueva Versión: ${car.name}`} />

      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={`/admin/autos/${id}/versiones`}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Versiones
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nueva Versión</h1>
            <p className="text-gray-600 mt-1">{car.name}</p>
          </div>
        </div>

        {/* Form */}
        <VersionForm carId={id} mode="create" />
      </div>
    </>
  );
}
