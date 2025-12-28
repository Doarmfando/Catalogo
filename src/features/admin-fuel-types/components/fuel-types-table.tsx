"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface FuelTypesTableProps {
  fuelTypes: any[];
}

export function FuelTypesTable({ fuelTypes }: FuelTypesTableProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (fuelTypeId: string, fuelTypeName: string, carCount: number) => {
    if (carCount > 0) {
      alert(`No se puede eliminar el tipo de combustible "${fuelTypeName}" porque tiene ${carCount} auto${carCount > 1 ? 's' : ''} asociado${carCount > 1 ? 's' : ''}.`);
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar el tipo de combustible "${fuelTypeName}"?`)) {
      return;
    }

    setDeleting(fuelTypeId);

    try {
      const res = await fetch(`/api/admin/fuel-types/${fuelTypeId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al eliminar");
      }

      router.refresh();
    } catch (error: any) {
      alert(error.message || "Error al eliminar el tipo de combustible. Intenta de nuevo.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Autos
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fuelTypes.map((fuelType) => {
              const carCount = fuelType.cars?.[0]?.count || 0;

              return (
                <tr key={fuelType.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {fuelType.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 font-mono">
                      {fuelType.slug}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {carCount} {carCount === 1 ? "auto" : "autos"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/tipos-combustible/${fuelType.id}/editar`}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(fuelType.id, fuelType.name, carCount)}
                        disabled={deleting === fuelType.id}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {fuelTypes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay tipos de combustible creados aún</p>
        </div>
      )}
    </div>
  );
}
