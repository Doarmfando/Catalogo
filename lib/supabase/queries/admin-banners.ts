/**
 * Queries de administración para banners del hero
 * Usa service role para bypassar RLS
 */

import { createAdminClient } from '../admin'

/**
 * Obtiene todos los banners del hero (sin filtro de fecha)
 */
export async function getAllBannersAdmin() {
  const supabase = createAdminClient()

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
    console.error('Error fetching banners:', error)
    return []
  }

  return data
}

/**
 * Obtiene un banner por ID
 */
export async function getBannerByIdAdmin(bannerId: string) {
  const supabase = createAdminClient()

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
    .eq('id', bannerId)
    .single()

  if (error) {
    console.error('Error fetching banner by ID:', error)
    return null
  }

  return data
}

/**
 * Crea un nuevo banner
 */
export async function createBanner(bannerData: {
  car_id?: string | null
  title: string
  subtitle?: string | null
  description?: string | null
  image_url?: string | null
  image_mobile_url?: string | null
  background_color?: string
  text_color?: string
  cta_primary_text?: string | null
  cta_primary_link?: string | null
  cta_secondary_text?: string | null
  cta_secondary_link?: string | null
  display_order?: number
  is_active?: boolean
  start_date?: string | null
  end_date?: string | null
}) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('hero_banners')
    .insert([bannerData])
    .select()
    .single()

  if (error) {
    console.error('Error creating banner:', error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

/**
 * Actualiza un banner
 */
export async function updateBanner(
  bannerId: string,
  bannerData: {
    car_id?: string | null
    title?: string
    subtitle?: string | null
    description?: string | null
    image_url?: string | null
    image_mobile_url?: string | null
    background_color?: string
    text_color?: string
    cta_primary_text?: string | null
    cta_primary_link?: string | null
    cta_secondary_text?: string | null
    cta_secondary_link?: string | null
    display_order?: number
    is_active?: boolean
    start_date?: string | null
    end_date?: string | null
  }
) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('hero_banners')
    .update(bannerData)
    .eq('id', bannerId)
    .select()
    .single()

  if (error) {
    console.error('Error updating banner:', error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

/**
 * Elimina un banner
 */
export async function deleteBanner(bannerId: string) {
  const supabase = createAdminClient()

  const { error } = await supabase.from('hero_banners').delete().eq('id', bannerId)

  if (error) {
    console.error('Error deleting banner:', error)
    return { error: error.message }
  }

  return { error: null }
}
