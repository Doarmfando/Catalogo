"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface ColorFormProps {
  initialData?: any;
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

export function ColorForm({ initialData, mode = "create" }: ColorFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [colorCode, setColorCode] = useState("");
  const [hexCode, setHexCode] = useState("#000000");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setColorCode(initialData.color_code || "");
      setHexCode(initialData.hex_code || "#000000");
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("El nombre es requerido");
      return;
    }

    if (!colorCode.trim()) {
      alert("El código del color es requerido");
      return;
    }

    if (!hexCode.match(/^#[0-9A-F]{6}$/i)) {
      alert("El código hexadecimal debe tener el formato #RRGGBB");
      return;
    }

    setSubmitting(true);

    try {
      const colorData = {
        name: name.trim(),
        slug: generateSlug(name),
        color_code: colorCode.trim().toUpperCase(),
        hex_code: hexCode.toUpperCase(),
      };

      const endpoint = mode === "edit"
        ? `/api/admin/colors/${initialData?.id}`
        : "/api/admin/colors";

      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(colorData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || `Error al ${mode === "edit" ? "actualizar" : "crear"} el color`);
      }

      alert(mode === "edit" ? "Color actualizado exitosamente" : "Color creado exitosamente");
      router.push("/admin/colores");
      router.refresh();
    } catch (error: any) {
      console.error("Error saving color:", error);
      alert(error.message || "Error al guardar el color");
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
        {mode === "edit" ? "Editar Color" : "Nuevo Color"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Color *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none"
            placeholder="Ej: Rojo Metálico"
          />
        </div>

        {/* Color Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código *
          </label>
          <input
            type="text"
            required
            value={colorCode}
            onChange={(e) => setColorCode(e.target.value.toUpperCase())}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none font-mono uppercase"
            placeholder="Ej: ROJ-001"
            maxLength={10}
          />
          <p className="mt-1 text-xs text-gray-500">
            Código interno del negocio
          </p>
        </div>

        {/* Hex Code - Full width */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código Hexadecimal *
          </label>
          <div className="flex gap-3">
            <input
              type="color"
              value={hexCode}
              onChange={(e) => setHexCode(e.target.value)}
              className="h-10 w-20 border border-gray-300 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              required
              value={hexCode}
              onChange={(e) => setHexCode(e.target.value)}
              className="flex-1 max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none font-mono uppercase"
              placeholder="#FF0000"
              pattern="^#[0-9A-Fa-f]{6}$"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Formato: #RRGGBB
          </p>
        </div>
      </div>

      {/* Preview */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Vista Previa
        </label>
        <div className="flex items-center gap-4">
          <div
            className="h-16 w-32 rounded-lg border-2 border-gray-300"
            style={{ backgroundColor: hexCode }}
          />
          <div>
            <p className="text-sm font-semibold text-gray-900">{name || "Nombre del color"}</p>
            <p className="text-xs text-gray-600 font-mono font-semibold">{colorCode || "CÓDIGO"}</p>
            <p className="text-xs text-gray-500 font-mono">{hexCode}</p>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-6 border-t border-gray-200 mt-6">
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
            : "Crear Color"}
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
    </form>
  );
}
