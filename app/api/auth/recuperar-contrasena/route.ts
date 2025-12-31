import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'El correo electrónico es requerido' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Verificar si el usuario existe
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email.toLowerCase())
      .single()

    if (userError || !userData) {
      // Por seguridad, siempre devolvemos éxito aunque el usuario no exista
      // Esto previene que alguien descubra qué emails están registrados
      return NextResponse.json({
        success: true,
        message: 'Si el correo existe, recibirás un enlace de recuperación'
      })
    }

    // Usar Supabase Auth para enviar el email de recuperación
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/restablecer-contrasena`,
    })

    if (error) {
      console.error('Error sending recovery email:', error)
      return NextResponse.json(
        { error: 'Error al enviar el correo de recuperación' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Correo de recuperación enviado'
    })
  } catch (error: any) {
    console.error('Error in recuperar-contrasena:', error)
    return NextResponse.json(
      { error: error.message || 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}
