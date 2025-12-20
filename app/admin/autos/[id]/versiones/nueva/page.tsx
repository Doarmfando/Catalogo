import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { VersionForm } from "@/features/admin-versions/components/version-form";

export default function NuevaVersionPage({ params }: { params: { id: string } }) {
  // Mock car data
  const carName = "Hyundai Accent";

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href={`/admin/autos/${params.id}/versiones`}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Versiones
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nueva Versión</h1>
          <p className="text-gray-600 mt-1">
            {carName}
          </p>
        </div>
      </div>

      {/* Form */}
      <VersionForm />
    </div>
  );
}
