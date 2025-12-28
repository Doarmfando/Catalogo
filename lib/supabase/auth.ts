/**
 * Funciones de autenticación con Supabase
 */

import { createClient as createServerClient } from './server'
import { createClient as createBrowserClient } from './client'

/**
 * Verifica si hay un usuario autenticado (Server Side)
 */
export async function getServerUser() {
  const supabase = await createServerClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

/**
 * Login con email y password
 */
export async function signIn(email: string, password: string) {
  const supabase = createBrowserClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { user: null, error: error.message }
  }

  return { user: data.user, error: null }
}

/**
 * Logout
 */
export async function signOut() {
  const supabase = createBrowserClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

/**
 * Verifica si el usuario tiene rol de admin o personal
 */
export async function checkUserRole(userId: string) {
  const supabase = await createServerClient()

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
