"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { uploadImage } from "@/lib/utils/image-upload";
import Image from "next/image";

interface Car {
  id: string;
  name: string;
  slug: string;
}

interface BannerData {
  id?: string;
  car_id?: string | null;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  image_url?: string | null;
  image_mobile_url?: string | null;
  background_color?: string;
  text_color?: string;
  cta_primary_text?: string | null;
  cta_primary_link?: string | null;
  cta_secondary_text?: string | null;
  cta_secondary_link?: string | null;
  display_order?: number;
  is_active?: boolean;
  start_date?: string | null;
  end_date?: string | null;
}

interface BannerFormProps {
  initialData?: BannerData;
  cars: Car[];
  mode?: "create" | "edit";
}

export function BannerForm({
  initialData,
  cars,
  mode = "create",
}: BannerFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    car_id: "",
    title: "",
    subtitle: "",
    description: "",
    background_color: "#020617",
    text_color: "white",
    cta_primary_text: "Ver Catálogo Completo",
    cta_primary_link: "#modelos",
    cta_secondary_text: "Quiero cotizar",
    cta_secondary_link: "#contacto",
    display_order: 0,
    is_active: true,
    start_date: "",
    end_date: "",
  });

  // Image states
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [imageMobileUrl, setImageMobileUrl] = useState("");
  const [imageMobileFile, setImageMobileFile] = useState<File | null>(null);
  const [imageMobilePreview, setImageMobilePreview] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (initialData) {
      setFormData({
        car_id: initialData.car_id || "",
        title: initialData.title || "",
        subtitle: initialData.subtitle || "",
        description: initialData.description || "",
        background_color: initialData.background_color || "#020617",
        text_color: initialData.text_color || "white",
        cta_primary_text: initialData.cta_primary_text || "Ver Catálogo Completo",
        cta_primary_link: initialData.cta_primary_link || "#modelos",
        cta_secondary_text: initialData.cta_secondary_text || "Quiero cotizar",
        cta_secondary_link: initialData.cta_secondary_link || "#contacto",
        display_order: initialData.display_order || 0,
        is_active: initialData.is_active !== undefined ? initialData.is_active : true,
        start_date: initialData.start_date
          ? new Date(initialData.start_date).toISOString().split("T")[0]
          : "",
        end_date: initialData.end_date
          ? new Date(initialData.end_date).toISOString().split("T")[0]
          : "",
      });

      if (initialData.image_url) {
        setImageUrl(initialData.image_url);
        setImagePreview(initialData.image_url);
      }

      if (initialData.image_mobile_url) {
        setImageMobileUrl(initialData.image_mobile_url);
        setImageMobilePreview(initialData.image_mobile_url);
      }
    }
  }, [initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageMobileFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageMobilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageUrl("");
  };

  const removeImageMobile = () => {
    setImageMobileFile(null);
    setImageMobilePreview(null);
    setImageMobileUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      // Upload images if new files were selected
      let finalImageUrl = imageUrl;
      let finalImageMobileUrl = imageMobileUrl;

      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile, "banners");
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        }
      }

      if (imageMobileFile) {
        const uploadedUrl = await uploadImage(imageMobileFile, "banners");
        if (uploadedUrl) {
          finalImageMobileUrl = uploadedUrl;
        }
      }

      const body = {
        car_id: formData.car_id || null,
        title: formData.title,
        subtitle: formData.subtitle || null,
        description: formData.description || null,
        image_url: finalImageUrl || null,
        image_mobile_url: finalImageMobileUrl || null,
        background_color: formData.background_color,
        text_color: formData.text_color,
        cta_primary_text: formData.cta_primary_text || null,
        cta_primary_link: formData.cta_primary_link || null,
        cta_secondary_text: formData.cta_secondary_text || null,
        cta_secondary_link: formData.cta_secondary_link || null,
        display_order: formData.display_order,
        is_active: formData.is_active,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
      };

      const url =
        mode === "create"
          ? "/api/admin/banners"
          : `/api/admin/banners/${initialData?.id}`;

      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al guardar banner");
        setSubmitting(false);
        return;
      }

      router.push("/admin/banners");
      router.refresh();
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Error al guardar banner");
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        {mode === "edit" ? "Editar Banner" : "Nuevo Banner"}
      </h3>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Basic Info Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700 border-b pb-2">
            Información Básica
          </h4>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              required
              disabled={submitting}
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none disabled:opacity-50"
              placeholder="Ej: Nuevo Hyundai Tucson 2024"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subtítulo
            </label>
            <input
              type="text"
              disabled={submitting}
              value={formData.subtitle}
              onChange={(e) =>
                setFormData({ ...formData, subtitle: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none disabled:opacity-50"
              placeholder="Ej: El SUV de tu familia"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              disabled={submitting}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none disabled:opacity-50"
              placeholder="Descripción adicional del banner"
            />
          </div>

          {/* Associated Car */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Auto Asociado
            </label>
            <select
              disabled={submitting}
              value={formData.car_id}
              onChange={(e) =>
                setFormData({ ...formData, car_id: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none disabled:opacity-50"
            >
              <option value="">Sin auto (promocional)</option>
              {cars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Opcional. Asocia el banner con un auto específico del catálogo.
            </p>
          </div>
        </div>

        {/* Images Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700 border-b pb-2">
            Imágenes
          </h4>

          {/* Desktop Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen Desktop
            </label>
            {imagePreview ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 mb-2">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Click para subir imagen
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  Recomendado: 1920x800px
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={submitting}
                />
              </label>
            )}
          </div>

          {/* Mobile Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen Mobile
            </label>
            {imageMobilePreview ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 mb-2">
                <Image
                  src={imageMobilePreview}
                  alt="Preview Mobile"
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                <button
                  type="button"
                  onClick={removeImageMobile}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Click para subir imagen
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  Recomendado: 768x600px
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageMobileChange}
                  className="hidden"
                  disabled={submitting}
                />
              </label>
            )}
          </div>
        </div>

        {/* Colors Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color de Fondo
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                disabled={submitting}
                value={formData.background_color}
                onChange={(e) =>
                  setFormData({ ...formData, background_color: e.target.value })
                }
                className="h-10 w-16 rounded border border-gray-300 disabled:opacity-50"
              />
              <input
                type="text"
                disabled={submitting}
                value={formData.background_color}
                onChange={(e) =>
                  setFormData({ ...formData, background_color: e.target.value })
                }
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none disabled:opacity-50"
                placeholder="#020617"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color de Texto
            </label>
            <select
              disabled={submitting}
              value={formData.text_color}
              onChange={(e) =>
                setFormData({ ...formData, text_color: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none disabled:opacity-50"
            >
              <option value="white">Blanco</option>
              <option value="black">Negro</option>
            </select>
          </div>
        </div>

        {/* CTAs Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700 border-b pb-2">
            Botones de Acción (CTAs)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Texto Botón Primario
              </label>
              <input
                type="text"
                disabled={submitting}
                value={formData.cta_primary_text}
                onChange={(e) =>
                  setFormData({ ...formData, cta_primary_text: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none disabled:opacity-50"
                placeholder="Ver Catálogo Completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Botón Primario
              </label>
              <input
                type="text"
                disabled={submitting}
                value={formData.cta_primary_link}
                onChange={(e) =>
                  setFormData({ ...formData, cta_primary_link: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none disabled:opacity-50"
                placeholder="/catalogo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Texto Botón Secundario
              </label>
              <input
                type="text"
                disabled={submitting}
                value={formData.cta_secondary_text}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cta_secondary_text: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none disabled:opacity-50"
                placeholder="Opcional"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Botón Secundario
              </label>
              <input
                type="text"
                disabled={submitting}
                value={formData.cta_secondary_link}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cta_secondary_link: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none disabled:opacity-50"
                placeholder="Opcional"
              />
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700 border-b pb-2">
            Configuración
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Orden de Visualización
              </label>
              <input
                type="number"
                disabled={submitting}
                value={formData.display_order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    display_order: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none disabled:opacity-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                Menor número aparece primero
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                disabled={submitting}
                value={formData.is_active ? "true" : "false"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_active: e.target.value === "true",
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none disabled:opacity-50"
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Inicio
              </label>
              <input
                type="date"
                disabled={submitting}
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none disabled:opacity-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                Opcional. Fecha desde cuando mostrar
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Fin
              </label>
              <input
                type="date"
                disabled={submitting}
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none disabled:opacity-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                Opcional. Fecha hasta cuando mostrar
              </p>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-4 py-2 bg-[#002C5F] text-white rounded-lg hover:bg-[#0957a5] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {mode === "edit" ? "Guardando..." : "Creando..."}
              </>
            ) : (
              mode === "edit" ? "Guardar Cambios" : "Crear Banner"
            )}
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
}
