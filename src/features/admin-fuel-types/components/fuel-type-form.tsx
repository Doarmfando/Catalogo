"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface FuelTypeFormProps {
  initialData?: any;
  mode?: "create" | "edit";
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-'); // Replace multiple - with single -
}

export function FuelTypeForm({ initialData, mode = "create" }: FuelTypeFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setSlug(initialData.slug || "");
    }
  }, [initialData]);

  const handleNameChange = (value: string) => {
    setName(value);
    // Auto-generate slug only in create mode or if slug is empty
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
      const checkNameRes = await fetch("/api/admin/fuel-types/check-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          excludeId: mode === "edit" ? initialData?.id : undefined,
        }),
      });

      if (!checkNameRes.ok) {
        alert("Error al verificar el nombre del tipo de combustible");
        return;
      }

      const { exists } = await checkNameRes.json();
      if (exists) {
        alert("❌ Ya existe un tipo de combustible con este nombre. Por favor usa un nombre diferente.");
        return;
      }
    } catch (error) {
      console.error("Error checking fuel type name:", error);
      alert("Error al verificar el nombre del tipo de combustible");
      return;
    }

    setSubmitting(true);

    try {
      const fuelTypeData = {
        name: name.trim(),
        slug: slug.trim(),
      };

      const endpoint = mode === "edit"
        ? `/api/admin/fuel-types/${initialData.id}`
        : "/api/admin/fuel-types";

      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fuelTypeData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al guardar el tipo de combustible");
      }

      alert(mode === "edit" ? "Tipo de combustible actualizado exitosamente" : "Tipo de combustible creado exitosamente");
      router.push("/admin/tipos-combustible");
      router.refresh();
    } catch (error: any) {
      console.error("Error saving fuel type:", error);
      alert(error.message || "Error al guardar el tipo de combustible");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        {mode === "edit" ? "Editar Tipo de Combustible" : "Nuevo Tipo de Combustible"}
      </h3>

      <div className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Tipo de Combustible *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none"
            placeholder="Ej: Gasolina"
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
            placeholder="ej: gasolina"
          />
          <p className="mt-1 text-xs text-gray-500">
            URL amigable para el tipo de combustible (se genera automáticamente)
          </p>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-4 py-2 bg-[#002C5F] text-white rounded-lg hover:bg-[#0957a5] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting
              ? "Guardando..."
              : mode === "edit"
              ? "Guardar Cambios"
              : "Crear Tipo de Combustible"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            disabled={submitting}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
}
