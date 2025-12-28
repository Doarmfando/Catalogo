import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminTopbar } from "@/features/admin-layout/components";
import { BrandForm } from "@/features/admin-brands/components";

export default function NuevaMarcaPage() {
  return (
    <>
      <AdminTopbar title="Nueva Marca" />

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
          <h1 className="text-2xl font-bold text-gray-900">Nueva Marca</h1>
        </div>

        {/* Form */}
        <BrandForm mode="create" />
      </div>
    </>
  );
}
