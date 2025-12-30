"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRealtimeTable } from "@/hooks/use-realtime-table";
import { useUser } from "@/contexts/user-context";

interface FuelTypesTableProps {
  fuelTypes: any[];
}

export function FuelTypesTable({ fuelTypes: initialFuelTypes }: FuelTypesTableProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const { isAdmin } = useUser();

  // Realtime subscription
  const { data: fuelTypes } = useRealtimeTable({
    table: 'fuel_types',
    initialData: initialFuelTypes,
    select: '*, cars(count)',
  });

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

      // No need for router.refresh() - Realtime will update automatically
    } catch (error: any) {
      alert(error.message || "Error al eliminar el tipo de combustible. Intenta de nuevo.");
    } finally {
      setDeleting(null);
    }
  };

  if (fuelTypes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-500">No hay tipos de combustible creados aún</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Etiqueta
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
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(fuelType.id, fuelType.name, carCount)}
                          disabled={deleting === fuelType.id}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-gray-200">
        {fuelTypes.map((fuelType) => {
          const carCount = fuelType.cars?.[0]?.count || 0;

          return (
            <div key={fuelType.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    {fuelType.name}
                  </h3>
                  <p className="text-xs text-gray-600 font-mono">
                    {fuelType.slug}
                  </p>
                </div>
                <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {carCount} {carCount === 1 ? "auto" : "autos"}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <Link
                  href={`/admin/tipos-combustible/${fuelType.id}/editar`}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                  <span>Editar</span>
                </Link>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(fuelType.id, fuelType.name, carCount)}
                    disabled={deleting === fuelType.id}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Eliminar</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
