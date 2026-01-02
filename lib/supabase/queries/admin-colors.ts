/**
 * Queries de administración para colores
 * Usa service role para bypassar RLS
 */

import { createAdminClient } from '../admin'

/**
 * Obtiene todos los colores del catálogo
 */
export async function getAllColors() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('colors')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching colors:', error)
    return []
  }

  return data
}

/**
 * Crea un nuevo color
 */
export async function createColor(colorData: {
  name: string;
  slug: string;
  color_code: string;
  hex_code: string
}) {
  const supabase = createAdminClient()

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
  const supabase = createAdminClient()

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
  colorData: { name?: string; slug?: string; color_code?: string; hex_code?: string }
) {
  const supabase = createAdminClient()

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
  const supabase = createAdminClient()

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

/**
 * Verifica si existe un color con el mismo código
 */
export async function checkColorCodeExists(colorCode: string, excludeId?: string) {
  const supabase = createAdminClient()

  let query = supabase
    .from('colors')
    .select('id, color_code')
    .ilike('color_code', colorCode)

  // Si estamos editando, excluir el ID actual
  if (excludeId) {
    query = query.neq('id', excludeId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error checking color code:', error)
    return { exists: false, error: error.message }
  }

  return { exists: data && data.length > 0, error: null }
}
