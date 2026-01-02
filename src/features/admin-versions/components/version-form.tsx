"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Loader2, GripVertical } from "lucide-react";
import { ColorManager } from "./color-manager";

interface VersionColor {
  id: string;
  colorId: string;
  name: string;
  colorCode?: string;
  hex: string;
  images: File[];
  imageUrls: string[];
}

interface VersionFormProps {
  carId: string;
  initialData?: any;
  mode?: "create" | "edit";
}

export function VersionForm({ carId, initialData, mode = "create" }: VersionFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [priceUSD, setPriceUSD] = useState("");
  const [highlights, setHighlights] = useState<string[]>([""]);
  const [colors, setColors] = useState<VersionColor[]>([]);
  const [availableColors, setAvailableColors] = useState<any[]>([]);
  const [showColorManager, setShowColorManager] = useState(false);
  const [editingColor, setEditingColor] = useState<VersionColor | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [draggedHighlightIndex, setDraggedHighlightIndex] = useState<number | null>(null);

  // Formatear precio con comas
  const formatPrice = (value: string) => {
    // Remover todo excepto números y punto decimal
    const numericValue = value.replace(/[^\d.]/g, '');

    // Si está vacío, retornar vacío
    if (!numericValue) return '';

    // Separar parte entera y decimal
    const parts = numericValue.split('.');
    const integerPart = parts[0];

    // Manejar parte decimal: solo limitar a 2 dígitos, SIN auto-completar
    let decimalPart = '';
    if (parts[1] !== undefined) {
      // Limitar a 2 decimales máximo, mostrar tal cual lo escribió el usuario
      decimalPart = parts[1].length > 0 ? `.${parts[1].slice(0, 2)}` : '.';
    }

    // Agregar comas a la parte entera
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return formattedInteger + decimalPart;
  };

  const handlePriceChange = (value: string) => {
    // Guardar solo números y punto (sin comas) en el estado
    const numericValue = value.replace(/[^\d.]/g, '');
    setPriceUSD(numericValue);
  };

  useEffect(() => {
    loadColors();

    if (initialData) {
      setName(initialData.name);
      setPriceUSD(initialData.price_usd?.toString() || "");
      setHighlights(initialData.highlights?.length > 0 ? initialData.highlights : [""]);

      // Transform version_colors to local format
      if (initialData.version_colors) {
        const transformedColors = initialData.version_colors.map((vc: any) => ({
          id: vc.id,
          colorId: vc.color_id,
          name: vc.colors.name,
          colorCode: vc.colors.color_code,
          hex: vc.colors.hex_code,
          images: [],
          imageUrls: vc.color_images?.map((ci: any) => ci.image_url) || [],
        }));
        setColors(transformedColors);
      }
    }
  }, [initialData]);

  const loadColors = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/colors");
      if (!res.ok) {
        throw new Error("Error al cargar los colores");
      }
      const colorsData = await res.json();
      setAvailableColors(colorsData);
    } catch (error) {
      console.error("Error loading colors:", error);
      alert("Error al cargar los colores del catálogo");
    } finally {
      setLoading(false);
    }
  };

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

  // Drag and drop handlers for highlights
  const handleDragStartHighlight = (index: number) => {
    setDraggedHighlightIndex(index);
  };

  const handleDragOverHighlight = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedHighlightIndex === null || draggedHighlightIndex === index) return;

    const newHighlights = [...highlights];
    const draggedItem = newHighlights[draggedHighlightIndex];
    newHighlights.splice(draggedHighlightIndex, 1);
    newHighlights.splice(index, 0, draggedItem);
    setHighlights(newHighlights);
    setDraggedHighlightIndex(index);
  };

  const handleDragEndHighlight = () => {
    setDraggedHighlightIndex(null);
  };

  const handleAddColor = () => {
    setEditingColor(null);
    setShowColorManager(true);
  };

  const handleEditColor = (color: VersionColor) => {
    setEditingColor(color);
    setShowColorManager(true);
  };

  const handleSaveColor = (versionColor: VersionColor) => {
    if (editingColor) {
      setColors(colors.map((c) => (c.id === versionColor.id ? versionColor : c)));
    } else {
      setColors([...colors, { ...versionColor, id: Date.now().toString() }]);
    }
    setShowColorManager(false);
    setEditingColor(null);
  };

  const handleDeleteColor = async (colorId: string) => {
    const colorToDelete = colors.find((c) => c.id === colorId);

    if (!colorToDelete) return;

    if (!confirm(`¿Estás seguro de eliminar el color "${colorToDelete.name}"? Se eliminarán también todas sus imágenes del servidor. Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      // Eliminar todas las imágenes existentes del bucket
      if (colorToDelete.imageUrls.length > 0) {
        const deletePromises = colorToDelete.imageUrls.map(async (imageUrl) => {
          try {
            const response = await fetch('/api/admin/delete-image', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ imageUrl }),
            });

            if (!response.ok) {
              console.error(`Error al eliminar imagen: ${imageUrl}`);
            }
          } catch (error) {
            console.error(`Error deleting image ${imageUrl}:`, error);
          }
        });

        // Esperar a que todas las eliminaciones terminen
        await Promise.all(deletePromises);
      }

      // Eliminar el color del estado
      setColors(colors.filter((c) => c.id !== colorId));
    } catch (error) {
      console.error('Error deleting color:', error);
      alert('Error al eliminar el color. Algunas imágenes pueden no haberse eliminado.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar precio USD > 0
    const price = parseFloat(priceUSD);
    if (isNaN(price) || price <= 0) {
      alert("❌ El precio USD debe ser mayor a 0");
      return;
    }

    // Verificar si el nombre ya existe
    try {
      const checkNameRes = await fetch("/api/admin/versions/check-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId,
          name,
          excludeId: mode === "edit" ? initialData.id : undefined,
        }),
      });

      if (!checkNameRes.ok) {
        alert("Error al verificar el nombre de la versión");
        return;
      }

      const { exists } = await checkNameRes.json();
      if (exists) {
        alert("❌ Ya existe una versión con este nombre para este auto. Por favor usa un nombre diferente.");
        return;
      }
    } catch (error) {
      console.error("Error checking version name:", error);
      alert("Error al verificar el nombre de la versión");
      return;
    }

    const validHighlights = highlights.filter((h) => h.trim() !== "");

    if (validHighlights.length === 0) {
      alert("❌ Debe agregar al menos una característica destacada");
      return;
    }

    // Nota: Ya no se requiere que las versiones tengan colores
    // Las versiones pueden existir sin colores ni imágenes

    setSubmitting(true);

    try {
      // Upload new images for each color
      const colorsWithUploadedImages = await Promise.all(
        colors.map(async (color) => {
          if (color.images.length === 0) {
            return {
              colorId: color.colorId,
              imageUrls: color.imageUrls,
            };
          }

          // Upload images
          const uploadedUrls = await Promise.all(
            color.images.map(async (file) => {
              const formData = new FormData();
              formData.append("file", file);
              formData.append("folder", "colors");

              const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
              });

              if (!res.ok) {
                throw new Error("Error al subir imagen");
              }

              const data = await res.json();
              return data.url;
            })
          );

          return {
            colorId: color.colorId,
            imageUrls: [...color.imageUrls, ...uploadedUrls],
          };
        })
      );

      // Create version data
      const versionData = {
        car_id: carId,
        name,
        price_usd: parseFloat(priceUSD),
        highlights: validHighlights,
        display_order: 0,
      };

      const endpoint = mode === "edit"
        ? `/api/admin/versions/${initialData.id}`
        : "/api/admin/versions";

      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...versionData,
          colors: colorsWithUploadedImages,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al guardar la versión");
      }

      alert(mode === "edit" ? "Versión actualizada exitosamente" : "Versión creada exitosamente");
      router.push(`/admin/autos/${carId}/versiones`);
      router.refresh();
    } catch (error: any) {
      console.error("Error saving version:", error);
      alert(error.message || "Error al guardar la versión");
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    // Prevenir que Enter envíe el formulario
    if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
      e.preventDefault();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
                type="text"
                inputMode="decimal"
                required
                value={formatPrice(priceUSD)}
                onChange={(e) => handlePriceChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none"
                placeholder="19,990"
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
                <div
                  key={index}
                  draggable
                  onDragStart={() => handleDragStartHighlight(index)}
                  onDragOver={(e) => handleDragOverHighlight(e, index)}
                  onDragEnd={handleDragEndHighlight}
                  className={`flex gap-2 transition-all ${
                    draggedHighlightIndex === index
                      ? 'opacity-50 scale-95'
                      : ''
                  }`}
                >
                  <div className="flex items-center text-gray-400 hover:text-gray-600 cursor-move">
                    <GripVertical className="h-5 w-5" />
                  </div>
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
                      <div className="flex items-center gap-2 mt-0.5">
                        {color.colorCode && (
                          <span className="text-xs font-semibold text-gray-700 font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                            {color.colorCode}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {color.images.length + color.imageUrls.length} {(color.images.length + color.imageUrls.length) === 1 ? "imagen" : "imágenes"}
                        </span>
                      </div>
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
              disabled={submitting || loading}
              className="flex-1 px-4 py-2 bg-[#002C5F] text-white rounded-lg hover:bg-[#0957a5] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting
                ? "Guardando..."
                : mode === "edit"
                ? "Guardar Cambios"
                : "Crear Versión"}
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

      {/* Color Manager Modal */}
      {showColorManager && (
        <ColorManager
          versionColor={editingColor}
          availableColors={availableColors}
          selectedColorIds={colors.map((c) => c.colorId)}
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
