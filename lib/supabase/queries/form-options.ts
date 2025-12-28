/**
 * Queries para obtener opciones de formularios
 */

import { createClient } from '../server'

/**
 * Obtiene todas las marcas activas para selects
 */
export async function getAllBrands() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching brands:', error)
    return []
  }

  return data
}

/**
 * Obtiene todas las categorías activas para selects
 */
export async function getAllCategories() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data
}

/**
 * Obtiene todos los tipos de combustible para selects
 */
export async function getAllFuelTypes() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('fuel_types')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching fuel types:', error)
    return []
  }

  return data
}
