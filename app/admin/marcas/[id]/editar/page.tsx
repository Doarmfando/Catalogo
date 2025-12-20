import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandForm } from "@/features/admin-brands/components/brand-form";

export default function EditarMarcaPage({ params }: { params: { id: string } }) {
  // Mock data - en producción vendría de una API
  const mockBrandData = {
    id: params.id,
    name: "Hyundai",
    logo: "/images/brands/logo_hyundai.png",
  };

  return (
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar Marca</h1>
          <p className="text-gray-600 mt-1">
            Actualiza la información de la marca
          </p>
        </div>
      </div>

      {/* Form */}
      <BrandForm initialData={mockBrandData} mode="edit" />
    </div>
  );
}
