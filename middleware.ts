// ============================================================================
// MIDDLEWARE DESHABILITADO TEMPORALMENTE
// Se habilitará después de terminar el desarrollo del panel de administración
// ============================================================================

import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Middleware deshabilitado durante desarrollo
  // Solo permite pasar todas las requests sin verificación
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}

// ============================================================================
// CÓDIGO ORIGINAL (Se activará al final)
// ============================================================================
// import { createServerClient } from '@supabase/ssr'
// import { NextResponse, type NextRequest } from 'next/server'

// export async function middleware(request: NextRequest) {
//   let response = NextResponse.next({
//     request: {
//       headers: request.headers,
//     },
//   })

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return request.cookies.getAll()
//         },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value, options }) =>
//             request.cookies.set(name, value)
//           )
//           response = NextResponse.next({
//             request,
//           })
//           cookiesToSet.forEach(({ name, value, options }) =>
//             response.cookies.set(name, value, options)
//           )
//         },
//       },
//     }
//   )

//   const { data: { user } } = await supabase.auth.getUser()

//   // Si intenta acceder a /admin sin estar autenticado
//   if (request.nextUrl.pathname.startsWith('/admin') &&
//       !request.nextUrl.pathname.startsWith('/admin/login') &&
//       !user) {
//     return NextResponse.redirect(new URL('/admin/login', request.url))
//   }

//   // Si está autenticado e intenta ir a /admin/login, redirigir al dashboard
//   if (request.nextUrl.pathname.startsWith('/admin/login') && user) {
//     return NextResponse.redirect(new URL('/admin', request.url))
//   }

//   return response
// }
