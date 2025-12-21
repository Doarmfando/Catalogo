/**
 * Barrel file para facilitar las importaciones de queries
 *
 * Uso:
 * import { getActiveCars, getActiveCategories } from '@/lib/supabase/queries'
 */

// Cars
export {
  getActiveCars,
  getCarBySlug,
  getCarById,
  getCarsByBrand,
  getCarsByCategory,
  getFeaturedCars,
  getCarsCountByBrand,
} from './cars'

// Categories
export {
  getActiveCategories,
  getCategoryBySlug,
  getCategoryById,
} from './categories'

// Brands
export {
  getActiveBrands,
  getBrandBySlug,
  getBrandById,
} from './brands'

// Banners
export {
  getActiveHeroBanners,
  getModelDetailBanner,
  getAllHeroBanners,
} from './banners'
