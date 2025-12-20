"use client";

import Link from "next/link";
import { Pencil, Trash2, ChevronDown, ChevronRight, Images } from "lucide-react";
import { useState } from "react";

// Mock data
const mockVersions = [
  {
    id: "1",
    name: "GL 1.6 MT",
    priceUSD: 19990,
    highlights: ["Motor 1.6L", "Transmisión Manual", "A/C"],
    colors: [
      { id: "c1", name: "Blanco Polar", hex: "#FFFFFF", imageCount: 8 },
      { id: "c2", name: "Negro Phantom", hex: "#1a1a1a", imageCount: 8 },
      { id: "c3", name: "Gris Titanio", hex: "#71797E", imageCount: 6 },
    ],
  },
  {
    id: "2",
    name: "GLS 1.6 AT",
    priceUSD: 22990,
    highlights: ["Motor 1.6L", "Transmisión Automática", "A/C", "Llantas de Aleación"],
    colors: [
      { id: "c4", name: "Blanco Polar", hex: "#FFFFFF", imageCount: 10 },
      { id: "c5", name: "Rojo Pasión", hex: "#B91C1C", imageCount: 7 },
    ],
  },
];

interface VersionsTableProps {
  carId?: string;
}

export function VersionsTable({ carId = "1" }: VersionsTableProps) {
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set());

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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
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
            {mockVersions.map((version) => (
              <>
                {/* Version Row */}
                <tr key={version.id} className="hover:bg-gray-50">
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
                      ${version.priceUSD.toLocaleString("en-US")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {version.highlights.slice(0, 2).map((highlight, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {highlight}
                        </span>
                      ))}
                      {version.highlights.length > 2 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          +{version.highlights.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {version.colors.slice(0, 4).map((color) => (
                        <div
                          key={color.id}
                          className="h-6 w-6 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        />
                      ))}
                      {version.colors.length > 4 && (
                        <span className="text-xs text-gray-500 ml-1">
                          +{version.colors.length - 4}
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
                      <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Expanded Colors Row */}
                {expandedVersions.has(version.id) && (
                  <tr key={`${version.id}-colors`}>
                    <td colSpan={5} className="px-6 py-4 bg-gray-50">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                          Colores Disponibles
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {version.colors.map((color) => (
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
                              <div className="flex gap-1">
                                <button className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {mockVersions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay versiones creadas aún</p>
        </div>
      )}
    </div>
  );
}
