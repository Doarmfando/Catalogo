"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { useRealtimeTable } from "@/hooks/use-realtime-table";
import { useUser } from "@/contexts/user-context";

interface BrandsGridProps {
  brands: any[];
}

export function BrandsGrid({ brands: initialBrands }: BrandsGridProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const { isAdmin } = useUser();

  // Realtime subscription
  const { data: brands } = useRealtimeTable({
    table: 'brands',
    initialData: initialBrands,
    select: '*, cars(count)',
  });

  const handleImageError = (brandId: string) => {
    setImageErrors(prev => new Set(prev).add(brandId));
  };

  const handleDelete = async (brandId: string, brandName: string, carCount: number) => {
    if (carCount > 0) {
      alert(`No se puede eliminar la marca "${brandName}" porque tiene ${carCount} auto${carCount > 1 ? 's' : ''} asociado${carCount > 1 ? 's' : ''}.`);
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar la marca "${brandName}"?`)) {
      return;
    }

    setDeleting(brandId);

    try {
      const res = await fetch(`/api/admin/brands/${brandId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al eliminar");
      }

      // No need for router.refresh() - Realtime will update automatically
    } catch (error: any) {
      alert(error.message || "Error al eliminar la marca. Intenta de nuevo.");
    } finally {
      setDeleting(null);
    }
  };

  if (brands.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-500">No hay marcas creadas aún</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {brands.map((brand) => {
        const carCount = brand.cars?.[0]?.count || 0;

        return (
        <div
          key={brand.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          {/* Logo */}
          <div className="h-24 flex items-center justify-center mb-4 bg-gray-50 rounded-lg">
            {brand.logo_url && !imageErrors.has(brand.id) ? (
              <img
                src={brand.logo_url}
                alt={brand.name}
                className="h-16 w-auto object-contain"
                onError={() => handleImageError(brand.id)}
              />
            ) : (
              <span className="text-3xl font-bold text-gray-400">
                {brand.name.charAt(0)}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{brand.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {carCount} {carCount === 1 ? "auto" : "autos"}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Link
              href={`/admin/marcas/${brand.id}/editar`}
              className={`${isAdmin ? 'flex-1' : 'flex-1'} flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors`}
            >
              <Pencil className="h-4 w-4" />
              Editar
            </Link>
            {isAdmin && (
              <button
                onClick={() => handleDelete(brand.id, brand.name, carCount)}
                disabled={deleting === brand.id}
                className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        );
      })}
    </div>
  );
}
