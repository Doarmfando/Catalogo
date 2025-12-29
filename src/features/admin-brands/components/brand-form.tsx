"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Loader2 } from "lucide-react";
import { uploadImage } from "@/lib/utils/image-upload";

interface BrandData {
  id?: string;
  name: string;
  logo_url?: string;
  slug?: string;
  description?: string;
}

interface BrandFormProps {
  initialData?: BrandData;
  mode?: "create" | "edit";
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function BrandForm({ initialData, mode = "create" }: BrandFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setSlug(initialData.slug || "");
      setDescription(initialData.description || "");
      setLogoUrl(initialData.logo_url || "");
      if (initialData.logo_url) {
        setLogoPreview(initialData.logo_url);
      }
    }
  }, [initialData]);

  const handleNameChange = (value: string) => {
    setName(value);
    if (mode === "create" || !slug) {
      setSlug(generateSlug(value));
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setImageError(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setLogoUrl("");
    setImageError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("El nombre es requerido");
      return;
    }

    if (!slug.trim()) {
      alert("La etiqueta es requerida");
      return;
    }

    setSubmitting(true);

    try {
      let finalLogoUrl = logoUrl;
      if (logoFile) {
        finalLogoUrl = await uploadImage(logoFile, "brands");
      }

      const brandData = {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || null,
        logo_url: finalLogoUrl || null,
      };

      const endpoint = mode === "edit"
        ? `/api/admin/brands/${initialData?.id}`
        : "/api/admin/brands";

      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(brandData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al guardar la marca");
      }

      alert(mode === "edit" ? "Marca actualizada exitosamente" : "Marca creada exitosamente");

      if (mode === "create") {
        setName("");
        setSlug("");
        setDescription("");
        setLogoFile(null);
        setLogoPreview(null);
        setLogoUrl("");
      }

      router.refresh();
    } catch (error: any) {
      console.error("Error saving brand:", error);
      alert(error.message || "Error al guardar la marca");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {mode === "edit" ? "Editar Marca" : "Nueva Marca"}
      </h3>

      <div className="space-y-4">
        {/* Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Logo
          </label>
          {logoPreview && !imageError ? (
            <div className="relative h-32 rounded-lg overflow-hidden bg-gray-100 border border-gray-300">
              <img
                src={logoPreview}
                alt="Logo Preview"
                className="w-full h-full object-contain p-4"
                onError={() => setImageError(true)}
              />
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#002C5F] transition-colors">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">
                Click para subir logo
              </span>
              <span className="text-xs text-gray-400 mt-1">
                PNG con fondo transparente
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la Marca *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none"
            placeholder="Ej: Hyundai"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Etiqueta *
          </label>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none font-mono text-sm"
            placeholder="ej: hyundai"
          />
          <p className="mt-1 text-xs text-gray-500">
            Se genera automáticamente
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none resize-none"
            placeholder="Descripción breve de la marca (opcional)"
          />
          <p className="mt-1 text-xs text-gray-500">
            Opcional - Información adicional sobre la marca
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full px-4 py-2 bg-[#002C5F] text-white rounded-lg hover:bg-[#0957a5] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting
            ? "Guardando..."
            : mode === "edit"
            ? "Guardar Cambios"
            : "Crear Marca"}
        </button>
      </div>
    </form>
  );
}
