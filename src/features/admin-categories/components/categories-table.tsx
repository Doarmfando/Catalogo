"use client";

import Link from "next/link";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";

// Mock data
const mockCategories = [
  {
    id: "1",
    name: "ECOLÓGICOS",
    displayName: "Ecológicos",
    description: "Vehículos eléctricos e híbridos",
    totalCars: 5,
    status: "Activo",
  },
  {
    id: "2",
    name: "HATCHBACK",
    displayName: "Hatchback",
    description: "Autos compactos y versátiles",
    totalCars: 8,
    status: "Activo",
  },
  {
    id: "3",
    name: "SEDÁN",
    displayName: "Sedán",
    description: "Vehículos elegantes y espaciosos",
    totalCars: 6,
    status: "Activo",
  },
  {
    id: "4",
    name: "SUV",
    displayName: "SUV",
    description: "Camionetas deportivas utilitarias",
    totalCars: 12,
    status: "Activo",
  },
  {
    id: "5",
    name: "UTILITARIOS",
    displayName: "Utilitarios",
    description: "Minivans y minibuses para transporte",
    totalCars: 3,
    status: "Activo",
  },
  {
    id: "6",
    name: "COMERCIALES",
    displayName: "Comerciales",
    description: "Vehículos para uso comercial y empresarial",
    totalCars: 2,
    status: "Activo",
  },
];

const getStatusBadgeColor = (status: string) => {
  return status === "Activo"
    ? "bg-green-100 text-green-800"
    : "bg-gray-100 text-gray-800";
};

export function CategoriesTable() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nombre para Mostrar
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Autos
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockCategories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-gray-900">
                    {category.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900">
                    {category.displayName}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600 line-clamp-2">
                    {category.description}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-900">
                    {category.totalCars}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(
                      category.status
                    )}`}
                  >
                    {category.status === "Activo" ? (
                      <Eye className="h-3 w-3" />
                    ) : (
                      <EyeOff className="h-3 w-3" />
                    )}
                    {category.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/categorias/${category.id}/editar`}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
