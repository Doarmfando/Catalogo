/**
 * Queries para obtener marcas de vehículos
 */

import { createClient } from '../server'

/**
 * Obtiene todas las marcas activas ordenadas por fecha de creación
 */
export async function getActiveBrands() {
  const supabase = await createClient()

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
 * Obtiene una marca por su slug
 */
export async function getBrandBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching brand by slug:', error)
    return null
  }

  return data
}

/**
 * Obtiene una marca por su ID
 */
export async function getBrandById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching brand by id:', error)
    return null
  }

  return data
}
