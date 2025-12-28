import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminTopbar } from "@/features/admin-layout/components";
import { BrandForm } from "@/features/admin-brands/components/brand-form";
import { getBrandByIdAdmin } from "@/lib/supabase/queries/admin-brands";

export default async function EditarMarcaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const brand = await getBrandByIdAdmin(id);

  if (!brand) {
    notFound();
  }

  return (
    <>
      <AdminTopbar title={`Editar: ${brand.name}`} />

      <div className="p-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin/marcas"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Marcas
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Editar: {brand.name}
          </h1>
        </div>

        {/* Form */}
        <BrandForm initialData={brand} mode="edit" />
      </div>
    </>
  );
}
