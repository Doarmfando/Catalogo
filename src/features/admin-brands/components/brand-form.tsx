"use client";

import { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface BrandData {
  id?: string;
  name: string;
  logo: string;
}

interface BrandFormProps {
  initialData?: BrandData;
  mode?: "create" | "edit";
}

export function BrandForm({ initialData, mode = "create" }: BrandFormProps) {
  const [name, setName] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setLogoPreview(initialData.logo);
    }
  }, [initialData]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const action = mode === "edit" ? "actualizada" : "creada";
    alert(`Marca ${action} (maqueta)`);
    if (mode === "create") {
      setName("");
      setLogoPreview(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {mode === "edit" ? "Editar Marca" : "Nueva Marca"}
      </h3>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la Marca *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none"
            placeholder="Ej: Toyota"
          />
        </div>

        {/* Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Logo *
          </label>
          {logoPreview ? (
            <div className="relative h-32 rounded-lg overflow-hidden bg-gray-100 border border-gray-300">
              <Image
                src={logoPreview}
                alt="Logo Preview"
                fill
                className="object-contain p-4"
              />
              <button
                type="button"
                onClick={() => setLogoPreview(null)}
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

        {/* Submit */}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-[#002C5F] text-white rounded-lg hover:bg-[#0957a5] transition-colors font-medium"
        >
          {mode === "edit" ? "Guardar Cambios" : "Crear Marca"}
        </button>
      </div>
    </form>
  );
}
