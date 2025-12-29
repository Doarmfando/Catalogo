/**
 * Queries públicas para tipos de combustible
 */

import { createClient } from '../server'

/**
 * Obtiene todos los tipos de combustible
 */
export async function getActiveFuelTypes() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('fuel_types')
    .select('id, name, slug')
    .order('display_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching fuel types:', error)
    return []
  }

  return data
}
