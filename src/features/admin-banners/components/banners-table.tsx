"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface Car {
  id: string;
  name: string;
  slug: string;
}

interface Banner {
  id: string;
  car_id: string | null;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  image_mobile_url: string | null;
  background_color: string;
  text_color: string;
  cta_primary_text: string | null;
  cta_primary_url: string | null;
  cta_secondary_text: string | null;
  cta_secondary_url: string | null;
  display_order: number;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  cars: Car | null;
}

interface BannersTableProps {
  banners: Banner[];
}

export function BannersTable({ banners }: BannersTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (bannerId: string, bannerTitle: string) => {
    if (!confirm(`¿Estás seguro de eliminar el banner "${bannerTitle}"?`)) {
      return;
    }

    setDeletingId(bannerId);
    try {
      const res = await fetch(`/api/admin/banners/${bannerId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Error al eliminar banner");
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
      alert("Error al eliminar banner");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (banners.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay banners
        </h3>
        <p className="text-gray-600 mb-4">
          Comienza creando tu primer banner para el hero del sitio
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Desktop table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Banner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Auto Asociado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Orden
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vigencia
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {banners.map((banner) => (
              <tr key={banner.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {banner.image_url ? (
                      <div className="relative h-16 w-28 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                        <Image
                          src={banner.image_url}
                          alt={banner.title}
                          fill
                          className="object-cover"
                          sizes="112px"
                        />
                      </div>
                    ) : (
                      <div className="h-16 w-28 flex-shrink-0 rounded bg-gray-100 flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {banner.title}
                      </p>
                      {banner.subtitle && (
                        <p className="text-sm text-gray-500 truncate">
                          {banner.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {banner.cars ? (
                    <span className="text-sm text-gray-900">
                      {banner.cars.name}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500 italic">
                      Sin auto
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900">
                    {banner.display_order}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {banner.is_active ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Activo
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Inactivo
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {formatDate(banner.start_date)} - {formatDate(banner.end_date)}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() =>
                        router.push(`/admin/banners/${banner.id}/editar`)
                      }
                      className="text-[#002C5F] hover:text-[#0957a5] transition-colors p-1"
                      title="Editar"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id, banner.title)}
                      disabled={deletingId === banner.id}
                      className="text-red-600 hover:text-red-800 transition-colors p-1 disabled:opacity-50"
                      title="Eliminar"
                    >
                      {deletingId === banner.id ? (
                        <div className="h-5 w-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden divide-y divide-gray-200">
        {banners.map((banner) => (
          <div key={banner.id} className="p-4">
            <div className="flex items-start gap-3 mb-3">
              {banner.image_url ? (
                <div className="relative h-20 w-32 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                  <Image
                    src={banner.image_url}
                    alt={banner.title}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
              ) : (
                <div className="h-20 w-32 flex-shrink-0 rounded bg-gray-100 flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-gray-400" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {banner.title}
                </p>
                {banner.subtitle && (
                  <p className="text-sm text-gray-500 mt-1">
                    {banner.subtitle}
                  </p>
                )}
                <div className="mt-2">
                  {banner.is_active ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      Activo
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      Inactivo
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm mb-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Auto:</span>
                <span className="text-gray-900 font-medium">
                  {banner.cars?.name || "Sin auto"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Orden:</span>
                <span className="text-gray-900">{banner.display_order}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Vigencia:</span>
                <span className="text-gray-900">
                  {formatDate(banner.start_date)} - {formatDate(banner.end_date)}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-gray-200">
              <button
                onClick={() =>
                  router.push(`/admin/banners/${banner.id}/editar`)
                }
                className="flex-1 px-3 py-2 text-sm font-medium text-[#002C5F] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Editar
              </button>
              <button
                onClick={() => handleDelete(banner.id, banner.title)}
                disabled={deletingId === banner.id}
                className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {deletingId === banner.id ? (
                  <>
                    <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Stats footer */}
      <div
        className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-sm text-gray-600"
        suppressHydrationWarning
      >
        Mostrando {banners.length} banner{banners.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
