/**
 * Queries relacionadas con autenticación
 */

import { createClient } from '../server'

/**
 * Obtiene el usuario autenticado actual con sus datos del perfil
 */
export async function getCurrentUser() {
  const supabase = await createClient()

  // Obtener el usuario autenticado
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return null
  }

  // Obtener datos adicionales del usuario desde la tabla users
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id, full_name, email, role')
    .eq('id', user.id)
    .single()

  if (userError) {
    // Si no hay datos en la tabla users, usar datos básicos del auth
    return {
      id: user.id,
      name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario',
      email: user.email || '',
      role: user.user_metadata?.role || 'user'
    }
  }

  // Transformar full_name a name para mantener consistencia
  return {
    id: userData.id,
    name: userData.full_name,
    email: userData.email,
    role: userData.role
  }
}
