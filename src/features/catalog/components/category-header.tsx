import { CarCategory } from "@/shared/types/car";

interface CategoryHeaderProps {
  category: CarCategory;
  categories: Array<{ id: string; name: string; slug: string; description?: string }>;
}

// Fallback solo para "Todos" que no está en BD
const specialCategoryInfo: Record<string, { title: string; description: string }> = {
  "Todos": {
    title: "Todos los Modelos",
    description: "Explora nuestra línea completa de vehículos. Encuentra el auto perfecto para ti entre nuestra amplia selección de modelos.",
  },
};

export function CategoryHeader({ category, categories }: CategoryHeaderProps) {
  // Buscar la categoría en la BD (normalizando a mayúsculas)
  const dbCategory = categories.find(
    (cat) => cat.name.toUpperCase() === category
  );

  // Usar descripción de BD si existe, sino usar fallback especial, sino genérico
  const info = dbCategory
    ? {
        title: `Modelos ${dbCategory.name}`,
        description: dbCategory.description || `Descubre nuestra línea de vehículos ${dbCategory.name.toLowerCase()}. Encuentra el modelo perfecto para ti.`,
      }
    : specialCategoryInfo[category] || {
        title: `Modelos ${category}`,
        description: `Descubre nuestra línea de vehículos ${category.toLowerCase()}. Encuentra el modelo perfecto para ti.`,
      };

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{info.title}</h1>
      <p className="text-base text-gray-600 leading-relaxed max-w-4xl">
        {info.description}
      </p>
    </div>
  );
}
