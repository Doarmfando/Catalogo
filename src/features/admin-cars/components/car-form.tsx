"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type CarFormProps = {
  mode: "create" | "edit";
  initialData?: any;
};

export function CarForm({ mode, initialData }: CarFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    brand: initialData?.brand || "Hyundai",
    year: initialData?.year || 2026,
    category: initialData?.category || "SUV",
    fuelType: initialData?.fuelType || "GASOLINA",
    priceUSD: initialData?.priceUSD || "",
    pricePEN: initialData?.pricePEN || "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image || null
  );
  const [frontalPreview, setFrontalPreview] = useState<string | null>(
    initialData?.imageFrontal || null
  );

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "main" | "frontal"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "main") {
          setImagePreview(reader.result as string);
        } else {
          setFrontalPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de guardado (por ahora solo maqueta)
    alert("Formulario enviado (maqueta)");
    router.push("/admin/autos");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/autos"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a la lista
        </Link>
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#002C5F] text-white rounded-lg hover:bg-[#0957a5] transition-colors font-medium"
        >
          <Save className="h-5 w-5" />
          {mode === "create" ? "Crear Auto" : "Guardar Cambios"}
        </button>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Basic Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Información Básica
            </h3>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Vehículo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none"
                  placeholder="Ej: TUCSON Hybrid 2026"
                />
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marca *
                </label>
                <select
                  required
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none"
                >
                  <option value="Hyundai">Hyundai</option>
                  <option value="JMC">JMC</option>
                  <option value="Nissan">Nissan</option>
                  <option value="Toyota">Toyota</option>
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Año *
                </label>
                <input
                  type="number"
                  required
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none"
                  min="2020"
                  max="2030"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none"
                >
                  <option value="ECOLÓGICOS">Ecológicos</option>
                  <option value="HATCHBACK">Hatchback</option>
                  <option value="SEDÁN">Sedán</option>
                  <option value="SUV">SUV</option>
                  <option value="UTILITARIOS">Utilitarios</option>
                  <option value="COMERCIALES">Comerciales</option>
                </select>
              </div>

              {/* Fuel Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Combustible *
                </label>
                <select
                  required
                  value={formData.fuelType}
                  onChange={(e) =>
                    setFormData({ ...formData, fuelType: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none"
                >
                  <option value="ELÉCTRICO">Eléctrico</option>
                  <option value="GASOLINA">Gasolina</option>
                  <option value="DIESEL">Diésel</option>
                </select>
              </div>
            </div>
          </div>

          {/* Prices */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Precios
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Price USD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio USD *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    required
                    value={formData.priceUSD}
                    onChange={(e) =>
                      setFormData({ ...formData, priceUSD: e.target.value })
                    }
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Price PEN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio PEN *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    S/
                  </span>
                  <input
                    type="number"
                    required
                    value={formData.pricePEN}
                    onChange={(e) =>
                      setFormData({ ...formData, pricePEN: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Images */}
        <div className="space-y-6">
          {/* Main Image */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Imagen Principal *
            </h3>

            <div className="space-y-4">
              {imagePreview ? (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#002C5F] transition-colors">
                  <Upload className="h-12 w-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Click o arrastra una imagen
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    PNG, JPG hasta 5MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, "main")}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Frontal Image */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Imagen Frontal (Opcional)
            </h3>

            <div className="space-y-4">
              {frontalPreview ? (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={frontalPreview}
                    alt="Preview Frontal"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFrontalPreview(null)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#002C5F] transition-colors">
                  <Upload className="h-12 w-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Click o arrastra una imagen
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    PNG, JPG hasta 5MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, "frontal")}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
