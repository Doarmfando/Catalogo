/**
 * Queries para obtener categorías de vehículos
 */

import { createClient } from '../server'

/**
 * Obtiene todas las categorías activas
 */
export async function getActiveCategories() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching active categories:', error)
    return []
  }

  return data
}

/**
 * Obtiene una categoría por su slug
 */
export async function getCategoryBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching category by slug:', error)
    return null
  }

  return data
}

/**
 * Obtiene una categoría por su ID
 */
export async function getCategoryById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching category by id:', error)
    return null
  }

  return data
}
