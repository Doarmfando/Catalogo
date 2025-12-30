"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, Pencil } from "lucide-react";
import { useRealtimeTable } from "@/hooks/use-realtime-table";

interface ColorsTableProps {
  colors: any[];
}

export function ColorsTable({ colors: initialColors }: ColorsTableProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  // Realtime subscription
  const { data: colors } = useRealtimeTable({
    table: 'colors',
    initialData: initialColors,
  });

  const handleDelete = async (colorId: string, colorName: string) => {
    if (!confirm(`¿Estás seguro de eliminar el color "${colorName}"?`)) {
      return;
    }

    setDeleting(colorId);

    try {
      const res = await fetch(`/api/admin/colors/${colorId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al eliminar");
      }

      // No need for router.refresh() - Realtime will update automatically
    } catch (error: any) {
      alert(error.message || "Error al eliminar el color. Intenta de nuevo.");
    } finally {
      setDeleting(null);
    }
  };

  if (colors.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-500">No hay colores creados aún</p>
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
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Color
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Código
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Código Hex
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {colors.map((color) => (
              <tr key={color.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div
                    className="h-8 w-16 rounded border border-gray-300"
                    style={{ backgroundColor: color.hex_code }}
                  />
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-gray-900">
                    {color.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                    {color.color_code || "—"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600 font-mono">
                    {color.hex_code}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/colores/${color.id}/editar`}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(color.id, color.name)}
                      disabled={deleting === color.id}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
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

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-gray-200">
        {colors.map((color) => (
          <div key={color.id} className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <div
                className="h-12 w-12 rounded-lg border border-gray-300 flex-shrink-0"
                style={{ backgroundColor: color.hex_code }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {color.name}
                </h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  {color.color_code && (
                    <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">
                      {color.color_code}
                    </span>
                  )}
                  <span className="font-mono text-gray-600">
                    {color.hex_code}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <Link
                href={`/admin/colores/${color.id}/editar`}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <Pencil className="h-4 w-4" />
                <span>Editar</span>
              </Link>
              <button
                onClick={() => handleDelete(color.id, color.name)}
                disabled={deleting === color.id}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
