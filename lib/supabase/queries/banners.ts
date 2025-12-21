/**
 * Queries para obtener banners (hero y detalle de modelos)
 */

import { createClient } from '../server'

/**
 * Obtiene banners activos del hero carousel
 * Solo devuelve banners vigentes (dentro del rango de fechas)
 */
export async function getActiveHeroBanners() {
  const supabase = await createClient()

  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('hero_banners')
    .select(`
      *,
      cars (
        id,
        name,
        slug,
        image_url,
        price_usd,
        price_pen
      )
    `)
    .eq('is_active', true)
    .or(`start_date.is.null,start_date.lte.${now}`)
    .or(`end_date.is.null,end_date.gte.${now}`)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching active hero banners:', error)
    return []
  }

  return data
}

/**
 * Obtiene el banner de detalle para un modelo específico
 */
export async function getModelDetailBanner(carId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('model_detail_banners')
    .select('*')
    .eq('car_id', carId)
    .eq('is_active', true)
    .single()

  if (error) {
    // Es normal que no exista banner para todos los modelos
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Error fetching model detail banner:', error)
    return null
  }

  return data
}

/**
 * Obtiene todos los banners del hero (sin filtro de fecha)
 * Útil para el panel de administración
 */
export async function getAllHeroBanners() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('hero_banners')
    .select(`
      *,
      cars (
        id,
        name,
        slug
      )
    `)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching all hero banners:', error)
    return []
  }

  return data
}
