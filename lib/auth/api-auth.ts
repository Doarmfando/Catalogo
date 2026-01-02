/**
 * Utilidades de autenticación para API Routes
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export type AuthUser = {
  id: string
  email: string
  role: 'administrador' | 'personal'
  is_active: boolean
}

/**
 * Valida que el usuario esté autenticado y activo
 * Retorna el usuario si está autenticado, o un NextResponse con error
 */
export async function validateAuth(): Promise<
  { user: AuthUser } | { error: NextResponse }
> {
  const supabase = await createClient()

  // Verificar sesión
  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !authUser) {
    return {
      error: NextResponse.json(
        { error: 'No autorizado. Debes iniciar sesión.' },
        { status: 401 }
      ),
    }
  }

  // Obtener perfil del usuario
  const { data: userProfile, error: profileError } = await supabase
    .from('users')
    .select('id, email, role, is_active')
    .eq('id', authUser.id)
    .single()

  if (profileError || !userProfile) {
    return {
      error: NextResponse.json(
        { error: 'Usuario no encontrado en el sistema.' },
        { status: 404 }
      ),
    }
  }

  // Verificar que esté activo
  if (!userProfile.is_active) {
    return {
      error: NextResponse.json(
        { error: 'Tu cuenta está desactivada. Contacta al administrador.' },
        { status: 403 }
      ),
    }
  }

  return { user: userProfile as AuthUser }
}

/**
 * Valida que el usuario sea administrador
 * Retorna el usuario si es admin, o un NextResponse con error
 */
export async function validateAdmin(): Promise<
  { user: AuthUser } | { error: NextResponse }
> {
  const result = await validateAuth()

  if ('error' in result) {
    return result
  }

  if (result.user.role !== 'administrador') {
    return {
      error: NextResponse.json(
        { error: 'Acceso denegado. Solo administradores pueden realizar esta acción.' },
        { status: 403 }
      ),
    }
  }

  return result
}

/**
 * Valida que el usuario pueda eliminar (solo administradores)
 * El personal puede crear/editar, pero NO eliminar
 */
export async function validateDelete(): Promise<
  { user: AuthUser } | { error: NextResponse }
> {
  return validateAdmin()
}
