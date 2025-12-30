import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminTopbarClient } from "@/features/admin-layout/components";
import { ColorForm } from "@/features/admin-colors/components";

export default function NuevoColorPage() {
  return (
    <>
      <AdminTopbarClient title="Nuevo Color" />

      <div className="p-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin/colores"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Colores
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Nuevo Color</h1>
        </div>

        {/* Form */}
        <ColorForm mode="create" />
      </div>
    </>
  );
}
