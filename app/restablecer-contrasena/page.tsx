'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  CirclesBackground,
  LeftPanel,
  BrandLogo,
  FooterBanner,
} from '@/features/auth/components'

export default function RestablecerContrasenaPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isValidSession, setIsValidSession] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // Listen for auth state changes to detect when the recovery session is established
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // Password recovery event detected
        setIsValidSession(true)
        setCheckingSession(false)
      } else if (session) {
        // Session exists
        setIsValidSession(true)
        setCheckingSession(false)
      } else if (event === 'SIGNED_OUT') {
        setError('El enlace de recuperación ha expirado o no es válido')
        setCheckingSession(false)
      }
    })

    // Also check current session immediately
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        setIsValidSession(true)
        setCheckingSession(false)
      } else {
        // Give Supabase some time to process URL hash fragments
        setTimeout(async () => {
          const { data: { session: retrySession } } = await supabase.auth.getSession()
          if (retrySession) {
            setIsValidSession(true)
          } else {
            setError('El enlace de recuperación ha expirado o no es válido')
          }
          setCheckingSession(false)
        }, 1000)
      }
    }

    checkSession()

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!password || !confirmPassword) {
        setError('Por favor completa todos los campos')
        setLoading(false)
        return
      }

      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden')
        setLoading(false)
        return
      }

      if (!isValidSession) {
        setError('Sesión de recuperación no válida')
        setLoading(false)
        return
      }

      const supabase = createClient()

      // Update the user's password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      })

      if (updateError) {
        console.error('Error updating password:', updateError)
        setError('Error al actualizar la contraseña. Por favor intenta de nuevo.')
        setLoading(false)
        return
      }

      // Mostrar mensaje de éxito
      setSuccess(true)
      setLoading(false)

      // Redirigir al admin después de 2 segundos (mantiene la sesión activa)
      setTimeout(() => {
        router.push('/admin/autos')
        router.refresh()
      }, 2000)
    } catch (err) {
      console.error('Error in password reset:', err)
      setError('Error al restablecer la contraseña')
      setLoading(false)
    }
  }

  // Mostrar loading mientras se verifica la sesión
  if (checkingSession) {
    return (
      <>
        <div className="font-['Segoe_UI'] relative min-h-screen w-full">
          <CirclesBackground />
          <div className="flex h-screen w-screen items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-[#002C5F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#002C5F] font-semibold">Verificando enlace de recuperación...</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="font-['Segoe_UI'] relative min-h-screen w-full">
        <CirclesBackground />

        <div className="flex h-screen w-screen relative z-10">
          <LeftPanel panelImage="/images/consecionarixda.png" altText="Panel lateral">
            <BrandLogo />
          </LeftPanel>

          <div className="flex-1 flex items-center justify-center bg-transparent relative z-20 px-4 md:px-0">
            <div className="w-full max-w-[400px] bg-white/95 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.08)] flex flex-col gap-6 md:gap-8 z-30">
              {!success ? (
                <>
                  <div className="flex flex-col items-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-[#002C5F] via-[#0957a5] to-[#002C5F] bg-[length:200%_100%] bg-clip-text text-transparent animate-rayFlash">
                      Nueva Contraseña
                    </h1>
                    <p className="text-sm text-gray-600 mt-3 text-center">
                      Ingresa tu nueva contraseña
                    </p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Nueva Contraseña */}
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          if (error) setError(null)
                        }}
                        placeholder="Nueva contraseña"
                        disabled={loading}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-[#002C5F] outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Confirmar Contraseña */}
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value)
                          if (error) setError(null)
                        }}
                        placeholder="Confirmar contraseña"
                        disabled={loading}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-[#002C5F] outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                        disabled={loading}
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !password || !confirmPassword || !isValidSession}
                      className="bg-[#002C5F] text-white p-3 text-base font-semibold rounded-lg cursor-pointer transition-all duration-300 outline-none hover:bg-[#0957a5] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Restableciendo...
                        </span>
                      ) : (
                        'Restablecer Contraseña'
                      )}
                    </button>

                    <Link
                      href="/login"
                      className="flex items-center justify-center gap-2 text-sm text-[#002C5F] hover:text-[#0957a5] hover:underline transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Volver al inicio de sesión
                    </Link>
                  </form>
                </>
              ) : (
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    ¡Contraseña Restablecida!
                  </h2>
                  <p className="text-gray-600">
                    Tu contraseña ha sido actualizada exitosamente.
                  </p>
                  <p className="text-sm text-gray-500">
                    Redirigiendo al panel de administración...
                  </p>
                  <div className="w-8 h-8 border-4 border-[#002C5F] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>

          <FooterBanner
            logo="/logo_icon.png"
            logo2="/XDlogo_text.png"
            logoAlt="Hyundai Logo"
            companyName="Fortex"
            contactLabel="Contacto:"
            phoneNumbers={['984 229 446', '944 532 822']}
            version="1.0.0"
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes rayFlash {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }

        :global(.animate-rayFlash) {
          animation: rayFlash 3s linear infinite alternate;
        }

        @media (max-width: 768px) {
          :global(.left-panel) {
            display: none !important;
          }
          :global(.login-bottom-banner) {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}
