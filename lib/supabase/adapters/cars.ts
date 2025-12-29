/**
 * Adapters para transformar datos de Supabase al formato esperado por la app
 */

import type { Car, CarBrand, FuelType, CarCategory, CarVersion, CarColor } from "@/shared/types/car";

/**
 * Transforma un color de Supabase al formato CarColor
 */
function adaptSupabaseColor(versionColor: any): CarColor {
  const color = versionColor.colors;
  const images = (versionColor.color_images || [])
    .sort((a: any, b: any) => a.display_order - b.display_order)
    .map((img: any) => img.image_url);

  return {
    id: color.id,
    name: color.name,
    hex: color.hex_code,
    images,
  };
}

/**
 * Transforma una versión de Supabase al formato CarVersion
 */
function adaptSupabaseVersion(version: any): CarVersion {
  const colors = (version.version_colors || [])
    .map(adaptSupabaseColor)
    .sort((a: CarColor, b: CarColor) => {
      // El color default primero
      const aIsDefault = version.version_colors?.find((vc: any) => vc.color_id === a.id)?.is_default;
      const bIsDefault = version.version_colors?.find((vc: any) => vc.color_id === b.id)?.is_default;
      if (aIsDefault && !bIsDefault) return -1;
      if (!aIsDefault && bIsDefault) return 1;
      return 0;
    });

  return {
    id: version.id,
    name: version.name,
    shortDescription: version.short_description,
    priceUSD: version.price_usd ? Number(version.price_usd) : undefined,
    pricePEN: version.price_pen ? Number(version.price_pen) : undefined,
    highlights: version.highlights || [],
    colors,
  };
}

/**
 * Transforma datos de Supabase al formato Car que espera la app
 */
export function adaptSupabaseCar(supabaseCar: any): Car {
  const versions = (supabaseCar.versions || [])
    .map(adaptSupabaseVersion)
    .sort((a: CarVersion, b: CarVersion) => {
      // Ordenar por display_order si existe en los datos originales
      const aOrder = supabaseCar.versions?.find((v: any) => v.id === a.id)?.display_order ?? 999;
      const bOrder = supabaseCar.versions?.find((v: any) => v.id === b.id)?.display_order ?? 999;
      return aOrder - bOrder;
    });

  return {
    id: supabaseCar.id,
    slug: supabaseCar.slug,
    brand: supabaseCar.brands?.name as CarBrand,
    name: supabaseCar.name,
    year: supabaseCar.year,
    category: supabaseCar.categories?.name?.toUpperCase() as CarCategory,
    fuelType: supabaseCar.fuel_types?.name?.toUpperCase() as FuelType,
    priceUSD: Number(supabaseCar.price_usd),
    pricePEN: Number(supabaseCar.price_pen),
    image: supabaseCar.image_url,
    imageFrontal: supabaseCar.image_frontal_url,
    versions,
  };
}

/**
 * Transforma array de datos de Supabase
 */
export function adaptSupabaseCars(supabaseCars: any[]): Car[] {
  return supabaseCars.map(adaptSupabaseCar);
}
