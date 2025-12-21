/**
 * Cliente de Supabase para uso en el NAVEGADOR (Client Components)
 *
 * Usa las variables de entorno NEXT_PUBLIC_* que son seguras para exponer
 * Respeta las políticas de Row Level Security (RLS)
 */

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
