/**
 * Queries de administración para versiones de autos
 * Usa service role para bypassar RLS
 */

import { createAdminClient } from '../admin'

/**
 * Genera un slug a partir del nombre
 */
function generateSlug(name: string): string {
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
 * Obtiene todas las versiones de un auto específico
 */
export async function getVersionsByCar(carId: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('versions')
    .select(`
      *,
      version_colors (
        id,
        color_id,
        colors (
          id,
          name,
          hex_code
        ),
        color_images (
          id,
          image_url,
          display_order
        )
      )
    `)
    .eq('car_id', carId)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching versions:', error)
    return []
  }

  return data
}

/**
 * Obtiene una versión específica por ID
 */
export async function getVersionById(versionId: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('versions')
    .select(`
      *,
      version_colors (
        id,
        color_id,
        colors (
          id,
          name,
          color_code,
          hex_code
        ),
        color_images (
          id,
          image_url,
          display_order
        )
      )
    `)
    .eq('id', versionId)
    .order('display_order', { referencedTable: 'version_colors.color_images', ascending: true })
    .single()

  if (error) {
    console.error('Error fetching version:', error)
    return null
  }

  return data
}

/**
 * Crea una nueva versión
 */
export async function createVersion(versionData: any) {
  const supabase = createAdminClient()

  // Generar slug automáticamente si no se proporciona
  const dataWithSlug = {
    ...versionData,
    slug: versionData.slug || generateSlug(versionData.name),
  }

  const { data, error } = await supabase
    .from('versions')
    .insert([dataWithSlug])
    .select()
    .single()

  if (error) {
    console.error('Error creating version:', error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

/**
 * Actualiza una versión existente
 */
export async function updateVersion(versionId: string, versionData: any) {
  const supabase = createAdminClient()

  // Regenerar slug si se cambió el nombre
  const dataWithSlug = versionData.name
    ? {
        ...versionData,
        slug: versionData.slug || generateSlug(versionData.name),
      }
    : versionData

  const { data, error } = await supabase
    .from('versions')
    .update(dataWithSlug)
    .eq('id', versionId)
    .select()
    .single()

  if (error) {
    console.error('Error updating version:', error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

/**
 * Elimina una versión
 */
export async function deleteVersion(versionId: string) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('versions')
    .delete()
    .eq('id', versionId)

  if (error) {
    console.error('Error deleting version:', error)
    return { error: error.message }
  }

  return { error: null }
}

/**
 * Asigna un color a una versión
 */
export async function assignColorToVersion(versionId: string, colorId: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('version_colors')
    .insert([{ version_id: versionId, color_id: colorId }])
    .select()
    .single()

  if (error) {
    console.error('Error assigning color to version:', error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

/**
 * Remueve un color de una versión
 */
export async function removeColorFromVersion(versionColorId: string) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('version_colors')
    .delete()
    .eq('id', versionColorId)

  if (error) {
    console.error('Error removing color from version:', error)
    return { error: error.message }
  }

  return { error: null }
}

/**
 * Añade una imagen a un color de versión
 */
export async function addColorImage(versionColorId: string, imageUrl: string, displayOrder: number = 0) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('color_images')
    .insert([{
      version_color_id: versionColorId,
      image_url: imageUrl,
      display_order: displayOrder
    }])
    .select()
    .single()

  if (error) {
    console.error('Error adding color image:', error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

/**
 * Elimina una imagen de color
 */
export async function deleteColorImage(imageId: string) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('color_images')
    .delete()
    .eq('id', imageId)

  if (error) {
    console.error('Error deleting color image:', error)
    return { error: error.message }
  }

  return { error: null }
}

/**
 * Actualiza el orden de múltiples imágenes de manera optimizada
 * Usa una sola query UPDATE con CASE statement
 */
export async function updateColorImagesOrder(
  imageUpdates: { imageUrl: string; displayOrder: number }[]
) {
  const supabase = createAdminClient()

  // Actualizar cada imagen individualmente (Supabase no soporta CASE en el cliente)
  const promises = imageUpdates.map(({ imageUrl, displayOrder }) =>
    supabase
      .from('color_images')
      .update({ display_order: displayOrder })
      .eq('image_url', imageUrl)
  )

  const results = await Promise.all(promises)

  const errors = results.filter(r => r.error).map(r => r.error)

  if (errors.length > 0) {
    console.error('Error updating color images order:', errors)
    return { error: errors[0]?.message }
  }

  return { error: null }
}

/**
 * Verifica si existe una versión con el mismo nombre para un auto
 */
export async function checkVersionNameExists(carId: string, name: string, excludeId?: string) {
  const supabase = createAdminClient()

  let query = supabase
    .from('versions')
    .select('id, name')
    .eq('car_id', carId)
    .ilike('name', name)

  // Si estamos editando, excluir el ID actual
  if (excludeId) {
    query = query.neq('id', excludeId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error checking version name:', error)
    return { exists: false, error: error.message }
  }

  return { exists: data && data.length > 0, error: null }
}
