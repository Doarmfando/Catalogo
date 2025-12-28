/**
 * Funciones de autenticación para Server Components
 */

import { createClient } from './server'

/**
 * Verifica si hay un usuario autenticado (Server Side)
 */
export async function getServerUser() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

/**
 * Verifica si el usuario tiene rol de admin o personal
 */
export async function checkUserRole(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single()

  if (error || !data) {
    return null
  }

  return data.role
}
