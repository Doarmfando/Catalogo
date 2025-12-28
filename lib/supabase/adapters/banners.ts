/**
 * Adapters para transformar datos de banners de Supabase al formato de la app
 */

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string | null;
  imageMobileUrl: string | null;
  backgroundColor: string;
  textColor: string;
  ctaPrimaryText: string;
  ctaPrimaryLink: string;
  ctaSecondaryText: string;
  ctaSecondaryLink: string;
  displayOrder: number;
  car: {
    id: string;
    name: string;
    slug: string;
    imageUrl: string;
    priceUSD: number;
    pricePEN: number;
  } | null;
}

/**
 * Transforma datos de Supabase al formato HeroBanner que espera la app
 */
export function adaptSupabaseHeroBanner(supabaseBanner: any): HeroBanner {
  return {
    id: supabaseBanner.id,
    title: supabaseBanner.title,
    subtitle: supabaseBanner.subtitle || '',
    description: supabaseBanner.description || '',
    imageUrl: supabaseBanner.image_url,
    imageMobileUrl: supabaseBanner.image_mobile_url,
    backgroundColor: supabaseBanner.background_color || '#020617',
    textColor: supabaseBanner.text_color || 'white',
    ctaPrimaryText: supabaseBanner.cta_primary_text || 'Ver Catálogo Completo',
    ctaPrimaryLink: supabaseBanner.cta_primary_link || '#modelos',
    ctaSecondaryText: supabaseBanner.cta_secondary_text || 'Quiero cotizar',
    ctaSecondaryLink: supabaseBanner.cta_secondary_link || '#contacto',
    displayOrder: supabaseBanner.display_order,
    car: supabaseBanner.cars ? {
      id: supabaseBanner.cars.id,
      name: supabaseBanner.cars.name,
      slug: supabaseBanner.cars.slug,
      imageUrl: supabaseBanner.cars.image_url,
      priceUSD: Number(supabaseBanner.cars.price_usd),
      pricePEN: Number(supabaseBanner.cars.price_pen),
    } : null,
  };
}

/**
 * Transforma array de datos de Supabase
 */
export function adaptSupabaseHeroBanners(supabaseBanners: any[]): HeroBanner[] {
  return supabaseBanners.map(adaptSupabaseHeroBanner);
}
