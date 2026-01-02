"use client";

import { useState, useEffect } from "react";
import { X, Upload, Trash2, ChevronUp, ChevronDown } from "lucide-react";

interface VersionColor {
  id: string;
  colorId: string;
  name: string;
  colorCode?: string;
  hex: string;
  images: File[];
  imageUrls: string[];
}

interface ColorManagerProps {
  versionColor: VersionColor | null;
  availableColors: any[];
  selectedColorIds: string[];
  onSave: (versionColor: VersionColor) => void;
  onCancel: () => void;
}

export function ColorManager({
  versionColor,
  availableColors,
  selectedColorIds,
  onSave,
  onCancel,
}: ColorManagerProps) {
  const [selectedColorId, setSelectedColorId] = useState("");
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Drag and drop states
  const [draggedExistingIndex, setDraggedExistingIndex] = useState<number | null>(null);
  const [draggedNewIndex, setDraggedNewIndex] = useState<number | null>(null);

  useEffect(() => {
    if (versionColor) {
      setSelectedColorId(versionColor.colorId);
      const color = availableColors.find((c) => c.id === versionColor.colorId);
      setSelectedColor(color);
      setExistingImageUrls(versionColor.imageUrls);
      setNewImages(versionColor.images || []);

      // Create previews for new images
      if (versionColor.images && versionColor.images.length > 0) {
        const previews = versionColor.images.map((file) => URL.createObjectURL(file));
        setImagePreviews(previews);
      }
    }
  }, [versionColor, availableColors]);

  useEffect(() => {
    if (selectedColorId) {
      const color = availableColors.find((c) => c.id === selectedColorId);
      setSelectedColor(color);
    }
  }, [selectedColorId, availableColors]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const newPreviews = fileArray.map((file) => URL.createObjectURL(file));

      setNewImages((prev) => [...prev, ...fileArray]);
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveExistingImage = async (index: number) => {
    const imageUrl = existingImageUrls[index];

    // Confirmar eliminación
    if (!confirm('¿Estás seguro de eliminar esta imagen? Esta acción no se puede deshacer y la imagen se eliminará permanentemente del servidor.')) {
      return;
    }

    try {
      // Eliminar del bucket de Supabase
      const response = await fetch('/api/admin/delete-image', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la imagen del servidor');
      }

      // Si se eliminó correctamente del bucket, eliminar del estado
      setExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error al eliminar la imagen. Por favor intenta de nuevo.');
    }
  };

  const handleRemoveNewImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const moveExistingImageUp = (index: number) => {
    if (index === 0) return;
    setExistingImageUrls((prev) => {
      const newArray = [...prev];
      [newArray[index - 1], newArray[index]] = [newArray[index], newArray[index - 1]];
      return newArray;
    });
  };

  const moveExistingImageDown = (index: number) => {
    setExistingImageUrls((prev) => {
      if (index === prev.length - 1) return prev;
      const newArray = [...prev];
      [newArray[index], newArray[index + 1]] = [newArray[index + 1], newArray[index]];
      return newArray;
    });
  };

  const moveNewImageUp = (index: number) => {
    if (index === 0) return;
    setNewImages((prev) => {
      const newArray = [...prev];
      [newArray[index - 1], newArray[index]] = [newArray[index], newArray[index - 1]];
      return newArray;
    });
    setImagePreviews((prev) => {
      const newArray = [...prev];
      [newArray[index - 1], newArray[index]] = [newArray[index], newArray[index - 1]];
      return newArray;
    });
  };

  const moveNewImageDown = (index: number) => {
    setNewImages((prev) => {
      if (index === prev.length - 1) return prev;
      const newArray = [...prev];
      [newArray[index], newArray[index + 1]] = [newArray[index + 1], newArray[index]];
      return newArray;
    });
    setImagePreviews((prev) => {
      if (index === prev.length - 1) return prev;
      const newArray = [...prev];
      [newArray[index], newArray[index + 1]] = [newArray[index + 1], newArray[index]];
      return newArray;
    });
  };

  // Drag and drop handlers for existing images
  const handleDragStartExisting = (index: number) => {
    setDraggedExistingIndex(index);
  };

  const handleDragOverExisting = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedExistingIndex === null || draggedExistingIndex === index) return;

    setExistingImageUrls((prev) => {
      const newArray = [...prev];
      const draggedItem = newArray[draggedExistingIndex];
      newArray.splice(draggedExistingIndex, 1);
      newArray.splice(index, 0, draggedItem);
      return newArray;
    });
    setDraggedExistingIndex(index);
  };

  const handleDragEndExisting = () => {
    setDraggedExistingIndex(null);
  };

  // Drag and drop handlers for new images
  const handleDragStartNew = (index: number) => {
    setDraggedNewIndex(index);
  };

  const handleDragOverNew = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedNewIndex === null || draggedNewIndex === index) return;

    setNewImages((prev) => {
      const newArray = [...prev];
      const draggedItem = newArray[draggedNewIndex];
      newArray.splice(draggedNewIndex, 1);
      newArray.splice(index, 0, draggedItem);
      return newArray;
    });

    setImagePreviews((prev) => {
      const newArray = [...prev];
      const draggedItem = newArray[draggedNewIndex];
      newArray.splice(draggedNewIndex, 1);
      newArray.splice(index, 0, draggedItem);
      return newArray;
    });

    setDraggedNewIndex(index);
  };

  const handleDragEndNew = () => {
    setDraggedNewIndex(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedColorId) {
      alert("Por favor selecciona un color");
      return;
    }

    // Nota: Se permite guardar colores sin imágenes
    // Los colores pueden existir sin imágenes asociadas

    onSave({
      id: versionColor?.id || Date.now().toString(),
      colorId: selectedColorId,
      name: selectedColor.name,
      colorCode: selectedColor.color_code,
      hex: selectedColor.hex_code,
      images: newImages,
      imageUrls: existingImageUrls,
    });

    // Cleanup
    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
  };

  // Filter out already selected colors (except the one being edited)
  const filteredColors = availableColors.filter(
    (color) =>
      !selectedColorIds.includes(color.id) ||
      color.id === versionColor?.colorId
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {versionColor ? "Editar Color de Versión" : "Agregar Color a Versión"}
          </h3>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Color del Catálogo *
            </label>
            <select
              required
              value={selectedColorId}
              onChange={(e) => setSelectedColorId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none"
            >
              <option value="">Selecciona un color...</option>
              {filteredColors.map((color) => (
                <option key={color.id} value={color.id}>
                  {color.color_code ? `[${color.color_code}] ` : ''}{color.name}
                </option>
              ))}
            </select>

            {/* Color Preview */}
            {selectedColor && (
              <div className="mt-3 flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div
                  className="h-12 w-12 rounded-lg border-2 border-gray-300 flex-shrink-0"
                  style={{ backgroundColor: selectedColor.hex_code }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {selectedColor.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {selectedColor.color_code && (
                      <span className="text-xs font-semibold text-gray-700 font-mono bg-gray-200 px-2 py-0.5 rounded">
                        {selectedColor.color_code}
                      </span>
                    )}
                    <span className="text-xs text-gray-500 font-mono">
                      {selectedColor.hex_code}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Gallery */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Galería de Imágenes (Opcional)
              </label>
              <span className="text-xs text-gray-500 italic">
                Arrastra las imágenes para reordenarlas
              </span>
            </div>

            {/* Upload Area */}
            <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#002C5F] transition-colors mb-4">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">
                Click para subir imágenes
              </span>
              <span className="text-xs text-gray-400 mt-1">
                Puedes seleccionar múltiples imágenes
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {/* Images Grid */}
            {(existingImageUrls.length > 0 || imagePreviews.length > 0) && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Existing images from database */}
                {existingImageUrls.map((imageUrl, index) => (
                  <div
                    key={`existing-${index}`}
                    draggable
                    onDragStart={() => handleDragStartExisting(index)}
                    onDragOver={(e) => handleDragOverExisting(e, index)}
                    onDragEnd={handleDragEndExisting}
                    className={`relative aspect-video rounded-lg overflow-hidden bg-gray-100 border-2 group cursor-move transition-all ${
                      draggedExistingIndex === index
                        ? 'border-blue-500 opacity-50 scale-95'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    <img
                      src={imageUrl}
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-full object-cover pointer-events-none"
                    />

                    {/* Botones de reordenar */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        type="button"
                        onClick={() => moveExistingImageUp(index)}
                        disabled={index === 0}
                        className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Mover arriba"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveExistingImageDown(index)}
                        disabled={index === existingImageUrls.length - 1}
                        className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Mover abajo"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Botón eliminar */}
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100"
                      title="Eliminar"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>

                    {/* Número de orden */}
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-60 text-white text-xs rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}

                {/* New images to upload */}
                {imagePreviews.map((preview, index) => (
                  <div
                    key={`new-${index}`}
                    draggable
                    onDragStart={() => handleDragStartNew(index)}
                    onDragOver={(e) => handleDragOverNew(e, index)}
                    onDragEnd={handleDragEndNew}
                    className={`relative aspect-video rounded-lg overflow-hidden bg-gray-100 border-2 group cursor-move transition-all ${
                      draggedNewIndex === index
                        ? 'border-green-500 opacity-50 scale-95'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    <img
                      src={preview}
                      alt={`Nueva imagen ${index + 1}`}
                      className="w-full h-full object-cover pointer-events-none"
                    />

                    {/* Botones de reordenar */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        type="button"
                        onClick={() => moveNewImageUp(index)}
                        disabled={index === 0}
                        className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Mover arriba"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveNewImageDown(index)}
                        disabled={index === imagePreviews.length - 1}
                        className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Mover abajo"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Botón eliminar */}
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100"
                      title="Eliminar"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>

                    {/* Número de orden */}
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-green-600 text-white text-xs rounded">
                      Nueva {existingImageUrls.length + index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {existingImageUrls.length === 0 && imagePreviews.length === 0 && (
              <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                <p className="text-sm text-gray-500">
                  No hay imágenes agregadas aún
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#002C5F] text-white rounded-lg hover:bg-[#0957a5] transition-colors font-medium"
            >
              {versionColor ? "Guardar Cambios" : "Agregar Color"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
