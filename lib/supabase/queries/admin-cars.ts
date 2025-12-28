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
    .order('created_at', { ascending: false })

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
