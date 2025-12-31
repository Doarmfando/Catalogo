"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface CategoryData {
  id?: string;
  name: string;
  slug?: string;
  description?: string;
}

interface CategoryFormProps {
  initialData?: CategoryData;
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

export function CategoryForm({ initialData, mode = "create" }: CategoryFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setSlug(initialData.slug || "");
      setDescription(initialData.description || "");
    }
  }, [initialData]);

  const handleNameChange = (value: string) => {
    setName(value);
    if (mode === "create" || !slug) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("❌ El nombre es requerido");
      return;
    }

    if (!slug.trim()) {
      alert("❌ La etiqueta es requerida");
      return;
    }

    // Verificar si el nombre ya existe
    try {
      const checkNameRes = await fetch("/api/admin/categories/check-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          excludeId: mode === "edit" ? initialData?.id : undefined,
        }),
      });

      if (!checkNameRes.ok) {
        alert("Error al verificar el nombre de la categoría");
        return;
      }

      const { exists } = await checkNameRes.json();
      if (exists) {
        alert("❌ Ya existe una categoría con este nombre. Por favor usa un nombre diferente.");
        return;
      }
    } catch (error) {
      console.error("Error checking category name:", error);
      alert("Error al verificar el nombre de la categoría");
      return;
    }

    setSubmitting(true);

    try {
      const categoryData = {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || null,
      };

      const endpoint = mode === "edit"
        ? `/api/admin/categories/${initialData?.id}`
        : "/api/admin/categories";

      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al guardar la categoría");
      }

      alert(mode === "edit" ? "Categoría actualizada exitosamente" : "Categoría creada exitosamente");
      router.push("/admin/categorias");
      router.refresh();
    } catch (error: any) {
      console.error("Error saving category:", error);
      alert(error.message || "Error al guardar la categoría");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        {mode === "edit" ? "Editar Categoría" : "Nueva Categoría"}
      </h3>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la Categoría *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none"
            placeholder="Ej: SUV"
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
            placeholder="ej: suv"
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
            placeholder="Descripción breve de la categoría..."
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full px-4 py-2 bg-[#002C5F] text-white rounded-lg hover:bg-[#0957a5] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting
            ? "Guardando..."
            : mode === "edit"
            ? "Guardar Cambios"
            : "Crear Categoría"}
        </button>
      </div>
    </form>
  );
}
