/**
 * Queries de administración para marcas
 * Usa service role para bypassar RLS
 */

import { createAdminClient } from '../admin'

/**
 * Obtiene todas las marcas con conteo de autos
 */
export async function getAllBrandsAdmin() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('brands')
    .select(`
      *,
      cars (count)
    `)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching brands:', error)
    return []
  }

  return data
}

/**
 * Obtiene una marca por ID
 */
export async function getBrandByIdAdmin(brandId: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('brands')
    .select(`
      *,
      cars (count)
    `)
    .eq('id', brandId)
    .single()

  if (error) {
    console.error('Error fetching brand by ID:', error)
    return null
  }

  return data
}

/**
 * Crea una nueva marca
 */
export async function createBrand(brandData: {
  name: string
  slug: string
  logo_url?: string
  description?: string
}) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('brands')
    .insert([brandData])
    .select()
    .single()

  if (error) {
    console.error('Error creating brand:', error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

/**
 * Actualiza una marca
 */
export async function updateBrand(
  brandId: string,
  brandData: {
    name: string
    slug: string
    logo_url?: string
    description?: string
  }
) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('brands')
    .update(brandData)
    .eq('id', brandId)
    .select()
    .single()

  if (error) {
    console.error('Error updating brand:', error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

/**
 * Elimina una marca
 * Solo si no tiene autos asociados
 */
export async function deleteBrand(brandId: string) {
  const supabase = createAdminClient()

  // Primero verificar si tiene autos asociados
  const { count } = await supabase
    .from('cars')
    .select('*', { count: 'exact', head: true })
    .eq('brand_id', brandId)

  if (count && count > 0) {
    return {
      error: `No se puede eliminar la marca porque tiene ${count} auto${count > 1 ? 's' : ''} asociado${count > 1 ? 's' : ''}`,
    }
  }

  const { error } = await supabase.from('brands').delete().eq('id', brandId)

  if (error) {
    console.error('Error deleting brand:', error)
    return { error: error.message }
  }

  return { error: null }
}

/**
 * Genera un slug a partir del nombre
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-') // Replace multiple - with single -
}

/**
 * Verifica si existe una marca con el mismo nombre
 */
export async function checkBrandNameExists(name: string, excludeId?: string) {
  const supabase = createAdminClient()

  let query = supabase
    .from('brands')
    .select('id, name')
    .ilike('name', name)

  // Si estamos editando, excluir el ID actual
  if (excludeId) {
    query = query.neq('id', excludeId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error checking brand name:', error)
    return { exists: false, error: error.message }
  }

  return { exists: data && data.length > 0, error: null }
}
