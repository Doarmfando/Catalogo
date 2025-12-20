"use client";

import { useState, useEffect } from "react";

interface CategoryData {
  id?: string;
  name: string;
  displayName: string;
  description: string;
  status: string;
}

interface CategoryFormProps {
  initialData?: CategoryData;
  mode?: "create" | "edit";
}

export function CategoryForm({ initialData, mode = "create" }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    description: "",
    status: "Activo",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        displayName: initialData.displayName,
        description: initialData.description,
        status: initialData.status,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const action = mode === "edit" ? "actualizada" : "creada";
    alert(
      `Categoría ${action} (maqueta)\nNombre: ${formData.name}\nNombre para mostrar: ${formData.displayName}`
    );

    if (mode === "create") {
      setFormData({
        name: "",
        displayName: "",
        description: "",
        status: "Activo",
      });
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
        {/* Name (Code) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre (Código) *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value.toUpperCase() })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none uppercase"
            placeholder="Ej: SUV"
            disabled={mode === "edit"}
          />
          <p className="text-xs text-gray-500 mt-1">
            {mode === "edit"
              ? "El código no puede ser modificado"
              : "Se usa internamente en el sistema"}
          </p>
        </div>

        {/* Display Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre para Mostrar *
          </label>
          <input
            type="text"
            required
            value={formData.displayName}
            onChange={(e) =>
              setFormData({ ...formData, displayName: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none"
            placeholder="Ej: Vehículos SUV"
          />
          <p className="text-xs text-gray-500 mt-1">
            Este nombre se mostrará en el catálogo público
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none resize-none"
            placeholder="Descripción breve de la categoría..."
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado *
          </label>
          <select
            required
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none"
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Las categorías inactivas no se mostrarán en los filtros
          </p>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-[#002C5F] text-white rounded-lg hover:bg-[#0957a5] transition-colors font-medium"
          >
            {mode === "edit" ? "Guardar Cambios" : "Crear Categoría"}
          </button>
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
}
