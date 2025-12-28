/**
 * Queries de administración para colores
 */

import { createClient } from '../server'

/**
 * Obtiene todos los colores del catálogo
 */
export async function getAllColors() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('colors')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching colors:', error)
    return []
  }

  return data
}

/**
 * Crea un nuevo color
 */
export async function createColor(colorData: { name: string; hex_code: string }) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('colors')
    .insert([colorData])
    .select()
    .single()

  if (error) {
    console.error('Error creating color:', error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

/**
 * Obtiene un color por ID
 */
export async function getColorById(colorId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('colors')
    .select('*')
    .eq('id', colorId)
    .single()

  if (error) {
    console.error('Error fetching color:', error)
    return null
  }

  return data
}

/**
 * Actualiza un color
 */
export async function updateColor(
  colorId: string,
  colorData: { name?: string; hex_code?: string }
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('colors')
    .update(colorData)
    .eq('id', colorId)
    .select()
    .single()

  if (error) {
    console.error('Error updating color:', error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

/**
 * Elimina un color
 */
export async function deleteColor(colorId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('colors')
    .delete()
    .eq('id', colorId)

  if (error) {
    console.error('Error deleting color:', error)
    return { error: error.message }
  }

  return { error: null }
}
