/**
 * Queries de administración para autos
 */

import { createClient } from '../server'

/**
 * Obtiene todos los autos (activos e inactivos) para el panel admin
 */
export async function getAllCarsAdmin() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('cars')
    .select(`
      *,
      brands (
        id,
        name,
        slug
      ),
      categories (
        id,
        name,
        slug
      ),
      fuel_types (
        id,
        name,
        slug
      )
    `)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching all cars for admin:', error)
    return []
  }

  return data
}

/**
 * Obtiene un auto por ID para edición en el panel admin
 */
export async function getCarByIdAdmin(carId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('cars')
    .select(`
      *,
      brands (
        id,
        name,
        slug
      ),
      categories (
        id,
        name,
        slug
      ),
      fuel_types (
        id,
        name,
        slug
      )
    `)
    .eq('id', carId)
    .single()

  if (error) {
    console.error('Error fetching car by ID for admin:', error)
    return null
  }

  return data
}

/**
 * Crea un nuevo auto
 */
export async function createCar(carData: any) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('cars')
    .insert([carData])
    .select()
    .single()

  if (error) {
    console.error('Error creating car:', error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

/**
 * Actualiza un auto existente
 */
export async function updateCar(carId: string, carData: any) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('cars')
    .update(carData)
    .eq('id', carId)
    .select()
    .single()

  if (error) {
    console.error('Error updating car:', error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

/**
 * Elimina un auto
 */
export async function deleteCar(carId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('cars')
    .delete()
    .eq('id', carId)

  if (error) {
    console.error('Error deleting car:', error)
    return { error: error.message }
  }

  return { error: null }
}

/**
 * Toggle estado activo/inactivo de un auto
 */
export async function toggleCarStatus(carId: string, isActive: boolean) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('cars')
    .update({ is_active: isActive })
    .eq('id', carId)
    .select()
    .single()

  if (error) {
    console.error('Error toggling car status:', error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

/**
 * Verifica si existe un auto con el mismo nombre
 */
export async function checkCarNameExists(name: string, excludeId?: string) {
  const supabase = await createClient()

  let query = supabase
    .from('cars')
    .select('id, name')
    .ilike('name', name)

  // Si estamos editando, excluir el ID actual
  if (excludeId) {
    query = query.neq('id', excludeId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error checking car name:', error)
    return { exists: false, error: error.message }
  }

  return { exists: data && data.length > 0, error: null }
}
