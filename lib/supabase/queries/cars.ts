/**
 * Queries para obtener datos de vehículos
 */

import { createClient } from '../server'

/**
 * Obtiene todos los autos activos con sus relaciones
 */
export async function getActiveCars() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('cars')
    .select(`
      *,
      brands (
        id,
        name,
        slug,
        logo_url
      ),
      categories (
        id,
        name,
        slug
      ),
      fuel_types (
        id,
        name,
        slug,
        icon_name
      )
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching active cars:', error)
    return []
  }

  return data
}

/**
 * Obtiene un auto por su slug
 */
export async function getCarBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('cars')
    .select(`
      *,
      brands (
        id,
        name,
        slug,
        logo_url,
        website_url
      ),
      categories (
        id,
        name,
        slug
      ),
      fuel_types (
        id,
        name,
        slug,
        icon_name
      ),
      versions (
        *,
        version_colors (
          *,
          colors (
            id,
            name,
            slug,
            hex_code,
            is_metallic,
            is_premium
          ),
          color_images (
            id,
            image_url,
            image_type,
            display_order,
            alt_text
          )
        )
      )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching car by slug:', error)
    return null
  }

  return data
}

/**
 * Obtiene un auto por su ID
 */
export async function getCarById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('cars')
    .select(`
      *,
      brands (
        id,
        name,
        slug,
        logo_url
      ),
      categories (
        id,
        name,
        slug
      ),
      fuel_types (
        id,
        name,
        slug,
        icon_name
      ),
      versions (
        *,
        version_colors (
          *,
          colors (
            id,
            name,
            slug,
            hex_code
          ),
          color_images (
            id,
            image_url,
            image_type,
            display_order
          )
        )
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching car by id:', error)
    return null
  }

  return data
}

/**
 * Obtiene autos de una marca específica
 */
export async function getCarsByBrand(brandId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('cars')
    .select(`
      *,
      brands (
        id,
        name,
        slug,
        logo_url
      ),
      categories (
        id,
        name,
        slug
      ),
      fuel_types (
        id,
        name,
        slug,
        icon_name
      )
    `)
    .eq('brand_id', brandId)
    .eq('is_active', true)
    .order('year', { ascending: false })

  if (error) {
    console.error('Error fetching cars by brand:', error)
    return []
  }

  return data
}

/**
 * Obtiene autos de una categoría específica
 */
export async function getCarsByCategory(categoryId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('cars')
    .select(`
      *,
      brands (
        id,
        name,
        slug,
        logo_url
      ),
      categories (
        id,
        name,
        slug
      ),
      fuel_types (
        id,
        name,
        slug,
        icon_name
      )
    `)
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching cars by category:', error)
    return []
  }

  return data
}

/**
 * Obtiene autos destacados (para hero section)
 */
export async function getFeaturedCars(limit: number = 5) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('cars')
    .select(`
      *,
      brands (
        id,
        name,
        slug,
        logo_url
      ),
      categories (
        id,
        name,
        slug
      ),
      fuel_types (
        id,
        name,
        slug,
        icon_name
      )
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching featured cars:', error)
    return []
  }

  return data
}

/**
 * Obtiene el conteo de autos por marca
 */
export async function getCarsCountByBrand() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('cars')
    .select('brand_id, brands(name, slug)')
    .eq('is_active', true)

  if (error) {
    console.error('Error fetching cars count by brand:', error)
    return {}
  }

  // Agrupar y contar
  const counts: Record<string, number> = {}
  data.forEach((car: any) => {
    const brandSlug = car.brands?.slug
    if (brandSlug) {
      counts[brandSlug] = (counts[brandSlug] || 0) + 1
    }
  })

  return counts
}
