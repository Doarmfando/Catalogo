"use client";

import Link from "next/link";
import { Pencil, Trash2, Eye, Palette } from "lucide-react";
import { useState } from "react";
import type { Car } from "@/shared/types/car";
import { useUser } from "@/contexts/user-context";

interface CarsTableProps {
  cars: Car[];
}

export function CarsTable({ cars }: CarsTableProps) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const { isAdmin } = useUser();

  const handleDelete = async (carId: string, carName: string) => {
    if (!confirm(`¿Estás seguro de eliminar "${carName}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    setDeleting(carId);

    try {
      const res = await fetch(`/api/admin/cars/${carId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Error al eliminar");
      }

      // Realtime will update automatically
    } catch (error) {
      alert("Error al eliminar el auto. Intenta de nuevo.");
    } finally {
      setDeleting(null);
    }
  };

  if (cars.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-500">No hay autos registrados. Crea el primero.</p>
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
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Imagen
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Marca
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Año
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cars.map((car, index) => (
              <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 text-center text-sm font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4">
                  <div className="h-16 w-24 rounded-lg overflow-hidden bg-gray-100">
                    {car.image && (
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-900">{car.name}</div>
                  <div className="text-xs text-gray-500">{car.fuelType}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900">{car.brand}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900">{car.year}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {car.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-gray-900">
                    ${car.priceUSD?.toLocaleString("en-US") || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/modelos/${car.id}`}
                      target="_blank"
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Ver en sitio público"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/admin/autos/${car.id}/versiones`}
                      className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Gestionar Versiones"
                    >
                      <Palette className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/admin/autos/${car.id}/editar`}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(car.id, car.name)}
                        disabled={deleting === car.id}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-gray-200">
        {cars.map((car) => (
          <div key={car.id} className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="h-20 w-28 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                {car.image && (
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {car.name}
                </h3>
                <p className="text-xs text-gray-500 mb-2">{car.fuelType}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="text-gray-600">{car.brand}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{car.year}</span>
                  <span className="text-gray-400">•</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium">
                    {car.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <div className="text-lg font-bold text-gray-900">
                ${car.priceUSD?.toLocaleString("en-US") || "N/A"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
              <Link
                href={`/modelos/${car.id}`}
                target="_blank"
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>Ver</span>
              </Link>
              <Link
                href={`/admin/autos/${car.id}/versiones`}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <Palette className="h-4 w-4" />
                <span>Versiones</span>
              </Link>
              <Link
                href={`/admin/autos/${car.id}/editar`}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <Pencil className="h-4 w-4" />
                <span>Editar</span>
              </Link>
              {isAdmin && (
                <button
                  onClick={() => handleDelete(car.id, car.name)}
                  disabled={deleting === car.id}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Eliminar</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="px-4 lg:px-6 py-4 border-t border-gray-200">
        <div className="text-xs sm:text-sm text-gray-500">
          Mostrando <span className="font-semibold">{cars.length}</span> resultado{cars.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
