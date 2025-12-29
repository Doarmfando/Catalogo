"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { uploadImage } from "@/lib/utils/image-upload";

type CarFormProps = {
  mode: "create" | "edit";
  initialData?: any;
  brands: any[];
  categories: any[];
  fuelTypes: any[];
};

// Helper para generar slug desde el nombre
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Quitar acentos
    .replace(/[^a-z0-9\s-]/g, "") // Quitar caracteres especiales
    .trim()
    .replace(/\s+/g, "-") // Reemplazar espacios con guiones
    .replace(/-+/g, "-"); // Eliminar guiones duplicados
}

export function CarForm({ mode, initialData, brands, categories, fuelTypes }: CarFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    brand_id: initialData?.brand_id || brands[0]?.id || "",
    year: initialData?.year || new Date().getFullYear(),
    category_id: initialData?.category_id || categories[0]?.id || "",
    fuel_type_id: initialData?.fuel_type_id || fuelTypes[0]?.id || "",
    price_usd: initialData?.price_usd || "",
    price_pen: initialData?.price_pen || "",
    image_url: initialData?.image_url || "",
    image_frontal_url: initialData?.image_frontal_url || "",
    is_active: initialData?.is_active ?? true,
  });

  // Estados separados para los archivos nuevos
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [frontalFile, setFrontalFile] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image_url || null
  );
  const [frontalPreview, setFrontalPreview] = useState<string | null>(
    initialData?.image_frontal_url || null
  );

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "main" | "frontal"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Guardar el archivo para subirlo después
      if (type === "main") {
        setImageFile(file);
      } else {
        setFrontalFile(file);
      }

      // Crear preview local
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const slug = generateSlug(formData.name);

      // Subir imágenes nuevas si existen
      let imageUrl = formData.image_url;
      let frontalUrl = formData.image_frontal_url;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile, "cars");
      }

      if (frontalFile) {
        frontalUrl = await uploadImage(frontalFile, "frontal");
      }

      // Validar que haya imagen principal
      if (!imageUrl) {
        throw new Error("La imagen principal es requerida");
      }

      const payload = {
        ...formData,
        slug,
        image_url: imageUrl,
        image_frontal_url: frontalUrl,
        price_usd: parseFloat(formData.price_usd as any),
        price_pen: parseFloat(formData.price_pen as any),
      };

      const url = mode === "create"
        ? "/api/admin/cars"
        : `/api/admin/cars/${initialData.id}`;

      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al guardar");
      }

      router.push("/admin/autos");
      router.refresh();
    } catch (error: any) {
      alert(error.message || "Error al guardar el auto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          href="/admin/autos"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a la lista
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#002C5F] text-white rounded-lg hover:bg-[#0957a5] transition-colors font-medium disabled:opacity-50 whitespace-nowrap"
        >
          <Save className="h-5 w-5" />
          {loading ? "Guardando..." : mode === "create" ? "Crear Auto" : "Guardar Cambios"}
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
                  value={formData.brand_id}
                  onChange={(e) =>
                    setFormData({ ...formData, brand_id: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none"
                >
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
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
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fuel Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Combustible *
                </label>
                <select
                  required
                  value={formData.fuel_type_id}
                  onChange={(e) =>
                    setFormData({ ...formData, fuel_type_id: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none"
                >
                  {fuelTypes.map((fuelType) => (
                    <option key={fuelType.id} value={fuelType.id}>
                      {fuelType.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Prices */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Precios
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    step="0.01"
                    required
                    value={formData.price_usd}
                    onChange={(e) =>
                      setFormData({ ...formData, price_usd: e.target.value })
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
                    step="0.01"
                    required
                    value={formData.price_pen}
                    onChange={(e) =>
                      setFormData({ ...formData, price_pen: e.target.value })
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
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                      setFormData({ ...formData, image_url: "" });
                    }}
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
                  <img
                    src={frontalPreview}
                    alt="Preview Frontal"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFrontalPreview(null);
                      setFrontalFile(null);
                      setFormData({ ...formData, image_frontal_url: "" });
                    }}
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
