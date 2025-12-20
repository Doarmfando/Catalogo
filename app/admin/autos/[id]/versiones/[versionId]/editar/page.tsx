import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { VersionForm } from "@/features/admin-versions/components/version-form";

export default function EditarVersionPage({
  params,
}: {
  params: { id: string; versionId: string };
}) {
  // Mock data - en producción vendría de una API
  const mockVersionData = {
    id: params.versionId,
    name: "GL 1.6 MT",
    priceUSD: 19990,
    highlights: ["Motor 1.6L", "Transmisión Manual", "A/C"],
    colors: [
      {
        id: "c1",
        name: "Blanco Polar",
        hex: "#FFFFFF",
        images: ["/images/ACCENT-2026.png"],
      },
      {
        id: "c2",
        name: "Negro Phantom",
        hex: "#1a1a1a",
        images: ["/images/ACCENT-2026.png"],
      },
    ],
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Editar Versión</h1>
          <p className="text-gray-600 mt-1">{carName}</p>
        </div>
      </div>

      {/* Form */}
      <VersionForm initialData={mockVersionData} mode="edit" />
    </div>
  );
}
