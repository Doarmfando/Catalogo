"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { useRealtimeTable } from "@/hooks/use-realtime-table";
import { useUser } from "@/contexts/user-context";

interface CategoriesTableProps {
  categories: any[];
}

export function CategoriesTable({ categories: initialCategories }: CategoriesTableProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const { isAdmin } = useUser();

  // Realtime subscription
  const { data: categories } = useRealtimeTable({
    table: 'categories',
    initialData: initialCategories,
    select: '*, cars(count)',
  });

  const handleDelete = async (categoryId: string, categoryName: string, carCount: number) => {
    if (carCount > 0) {
      alert(`No se puede eliminar la categoría "${categoryName}" porque tiene ${carCount} auto${carCount > 1 ? 's' : ''} asociado${carCount > 1 ? 's' : ''}.`);
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar la categoría "${categoryName}"?`)) {
      return;
    }

    setDeleting(categoryId);

    try {
      const res = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al eliminar");
      }

      // No need for router.refresh() - Realtime will update automatically
    } catch (error: any) {
      alert(error.message || "Error al eliminar la categoría. Intenta de nuevo.");
    } finally {
      setDeleting(null);
    }
  };

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-500">No hay categorías creadas aún</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Etiqueta
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Autos
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => {
              const carCount = category.cars?.[0]?.count || 0;

              return (
                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">
                      {category.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 font-mono">
                      {category.slug}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 line-clamp-2">
                      {category.description || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {carCount}
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
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(category.id, category.name, carCount)}
                          disabled={deleting === category.id}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Eliminar"
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
    </div>
  );
}
