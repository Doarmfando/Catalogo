/**
 * Cliente de Supabase con service role para operaciones administrativas
 * IMPORTANTE: Solo usar en API routes del servidor, NUNCA en el cliente
 */

import { createClient } from '@supabase/supabase-js'

/**
 * Crea un cliente de Supabase con service role key
 * Tiene permisos completos para todas las operaciones
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase admin credentials')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
