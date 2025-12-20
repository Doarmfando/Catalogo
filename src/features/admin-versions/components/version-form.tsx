"use client";

import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { ColorManager } from "./color-manager";

interface Color {
  id: string;
  name: string;
  hex: string;
  images: string[];
}

interface VersionData {
  id?: string;
  name: string;
  priceUSD: number;
  highlights: string[];
  colors: Color[];
}

interface VersionFormProps {
  initialData?: VersionData;
  mode?: "create" | "edit";
}

export function VersionForm({ initialData, mode = "create" }: VersionFormProps) {
  const [name, setName] = useState("");
  const [priceUSD, setPriceUSD] = useState("");
  const [highlights, setHighlights] = useState<string[]>([""]);
  const [colors, setColors] = useState<Color[]>([]);
  const [showColorManager, setShowColorManager] = useState(false);
  const [editingColor, setEditingColor] = useState<Color | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPriceUSD(initialData.priceUSD.toString());
      setHighlights(initialData.highlights.length > 0 ? initialData.highlights : [""]);
      setColors(initialData.colors);
    }
  }, [initialData]);

  const handleAddHighlight = () => {
    setHighlights([...highlights, ""]);
  };

  const handleRemoveHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const handleHighlightChange = (index: number, value: string) => {
    const newHighlights = [...highlights];
    newHighlights[index] = value;
    setHighlights(newHighlights);
  };

  const handleAddColor = () => {
    setEditingColor(null);
    setShowColorManager(true);
  };

  const handleEditColor = (color: Color) => {
    setEditingColor(color);
    setShowColorManager(true);
  };

  const handleSaveColor = (color: Color) => {
    if (editingColor) {
      setColors(colors.map((c) => (c.id === color.id ? color : c)));
    } else {
      setColors([...colors, { ...color, id: Date.now().toString() }]);
    }
    setShowColorManager(false);
    setEditingColor(null);
  };

  const handleDeleteColor = (colorId: string) => {
    setColors(colors.filter((c) => c.id !== colorId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validHighlights = highlights.filter((h) => h.trim() !== "");
    const action = mode === "edit" ? "actualizada" : "creada";
    alert(`Versión ${action} (maqueta)\nNombre: ${name}\nPrecio: $${priceUSD}\nCaracterísticas: ${validHighlights.length}\nColores: ${colors.length}`);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          {mode === "edit" ? "Editar Versión" : "Nueva Versión"}
        </h3>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Versión *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none"
                placeholder="Ej: GL 1.6 MT"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio USD *
              </label>
              <input
                type="number"
                required
                value={priceUSD}
                onChange={(e) => setPriceUSD(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none"
                placeholder="19990"
              />
            </div>
          </div>

          {/* Highlights */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Características Destacadas
              </label>
              <button
                type="button"
                onClick={handleAddHighlight}
                className="text-sm text-[#002C5F] hover:text-[#0957a5] font-medium flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Agregar
              </button>
            </div>
            <div className="space-y-2">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) => handleHighlightChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none"
                    placeholder="Ej: Motor 1.6L"
                  />
                  {highlights.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Colores Disponibles
              </label>
              <button
                type="button"
                onClick={handleAddColor}
                className="px-4 py-2 bg-[#002C5F] text-white rounded-lg hover:bg-[#0957a5] transition-colors font-medium text-sm flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Agregar Color
              </button>
            </div>

            {colors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {colors.map((color) => (
                  <div
                    key={color.id}
                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div
                      className="h-12 w-12 rounded-lg border-2 border-gray-300 flex-shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {color.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {color.images.length} {color.images.length === 1 ? "imagen" : "imágenes"}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleEditColor(color)}
                        className="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteColor(color.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-sm text-gray-500">
                  No hay colores agregados aún
                </p>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#002C5F] text-white rounded-lg hover:bg-[#0957a5] transition-colors font-medium"
            >
              {mode === "edit" ? "Guardar Cambios" : "Crear Versión"}
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

      {/* Color Manager Modal */}
      {showColorManager && (
        <ColorManager
          color={editingColor}
          onSave={handleSaveColor}
          onCancel={() => {
            setShowColorManager(false);
            setEditingColor(null);
          }}
        />
      )}
    </>
  );
}
