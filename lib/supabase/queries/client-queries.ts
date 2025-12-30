/**
 * Client-side queries for Realtime subscriptions
 * These use the browser client instead of the server client
 */

import { createClient } from '../client'

/**
 * Obtiene todos los autos activos con sus relaciones (client-side)
 */
export async function getActiveCarsClient() {
  const supabase = createClient()

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
 * Obtiene todas las marcas activas (client-side)
 */
export async function getActiveBrandsClient() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching active brands:', error)
    return []
  }

  return data
}

/**
 * Obtiene todas las categorías activas (client-side)
 */
export async function getActiveCategoriesClient() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, description')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching active categories:', error)
    return []
  }

  return data
}

/**
 * Obtiene todos los tipos de combustible activos (client-side)
 */
export async function getActiveFuelTypesClient() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('fuel_types')
    .select('id, name, slug')
    .order('display_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching active fuel types:', error)
    return []
  }

  return data
}

/**
 * Obtiene un auto por su ID con todas sus relaciones (client-side)
 */
export async function getCarByIdClient(id: string) {
  const supabase = createClient()

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
    .eq('id', id)
    .order('display_order', { referencedTable: 'versions.version_colors.color_images', ascending: true })
    .single()

  if (error) {
    console.error('Error fetching car by id:', error)
    return null
  }

  return data
}
