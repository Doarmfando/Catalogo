"use client";

import Link from "next/link";
import { Pencil, Trash2, ChevronDown, ChevronRight, Images } from "lucide-react";
import { useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import { useRealtimeTable } from "@/hooks/use-realtime-table";
import { useUser } from "@/contexts/user-context";

interface VersionsTableProps {
  carId: string;
  versions: any[];
}

export function VersionsTable({ carId, versions: initialVersions }: VersionsTableProps) {
  const router = useRouter();
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState<string | null>(null);
  const { isAdmin } = useUser();

  // Realtime subscription for versions
  const { data: versions } = useRealtimeTable({
    table: 'versions',
    initialData: initialVersions,
  });

  const toggleVersion = (versionId: string) => {
    setExpandedVersions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(versionId)) {
        newSet.delete(versionId);
      } else {
        newSet.add(versionId);
      }
      return newSet;
    });
  };

  const handleDelete = async (versionId: string, versionName: string) => {
    if (!confirm(`¿Estás seguro de eliminar la versión "${versionName}"? Esto eliminará todos sus colores e imágenes.`)) {
      return;
    }

    setDeleting(versionId);

    try {
      const res = await fetch(`/api/admin/versions/${versionId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Error al eliminar");
      }

      // No need for router.refresh() - Realtime will update automatically
    } catch (error) {
      alert("Error al eliminar la versión. Intenta de nuevo.");
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
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Versión
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio USD
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Características
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Colores
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {versions.map((version, index) => {
              const colors = version.version_colors?.map((vc: any) => ({
                id: vc.id,
                name: vc.colors.name,
                hex: vc.colors.hex_code,
                imageCount: vc.color_images?.length || 0,
                versionColorId: vc.id,
              })) || [];

              return (
              <Fragment key={version.id}>
                {/* Version Row */}
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-center text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleVersion(version.id)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        {expandedVersions.has(version.id) ? (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                      <span className="text-sm font-medium text-gray-900">
                        {version.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">
                      ${version.price_usd?.toLocaleString("en-US") || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {version.highlights?.slice(0, 2).map((highlight: string, idx: number) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {highlight}
                        </span>
                      ))}
                      {(version.highlights?.length || 0) > 2 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          +{version.highlights.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {colors.slice(0, 4).map((color: any) => (
                        <div
                          key={color.id}
                          className="h-6 w-6 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        />
                      ))}
                      {colors.length > 4 && (
                        <span className="text-xs text-gray-500 ml-1">
                          +{colors.length - 4}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/autos/${carId}/versiones/${version.id}/editar`}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(version.id, version.name)}
                          disabled={deleting === version.id}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>

                {/* Expanded Colors Row */}
                {expandedVersions.has(version.id) && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 bg-gray-50">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                          Colores Disponibles
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {colors.map((color: any) => (
                            <div
                              key={color.id}
                              className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200"
                            >
                              <div
                                className="h-10 w-10 rounded-lg border-2 border-gray-300 flex-shrink-0"
                                style={{ backgroundColor: color.hex }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">
                                  {color.name}
                                </p>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <Images className="h-3 w-3" />
                                  {color.imageCount} {color.imageCount === 1 ? "imagen" : "imágenes"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
            })}
          </tbody>
        </table>
      </div>

      {versions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay versiones creadas aún</p>
        </div>
      )}
    </div>
  );
}
