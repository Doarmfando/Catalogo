'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Lock, Eye, EyeOff } from 'lucide-react'
import {
  CirclesBackground,
  LeftPanel,
  BrandLogo,
  FooterBanner,
} from '@/features/auth/components'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  // Verificar si ya hay sesión activa
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/session')
        const data = await res.json()

        if (data.user) {
          // Ya hay sesión activa, redirigir al admin
          router.push('/admin/autos')
          router.refresh()
        } else {
          setCheckingSession(false)
        }
      } catch (error) {
        console.error('Error checking session:', error)
        setCheckingSession(false)
      }
    }

    checkSession()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!email.trim() || !password) {
        setError('Por favor ingresa email y contraseña')
        setLoading(false)
        return
      }

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al iniciar sesión')
        setLoading(false)
        return
      }

      // Redirigir al admin después del login exitoso
      router.push('/admin/autos')
      router.refresh()
    } catch (err) {
      setError('Error al iniciar sesión')
      setLoading(false)
    }
  }

  // Mostrar loading mientras se verifica sesión
  if (checkingSession) {
    return (
      <>
        <div className="font-['Segoe_UI'] relative min-h-screen w-full">
          <CirclesBackground />
          <div className="flex h-screen w-screen items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-[#002C5F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#002C5F] font-semibold">Verificando sesión...</p>
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

        <div className="flex h-screen w-screen relative z-10 login-wrapper">
          <LeftPanel panelImage="/images/consecionarixda.png" altText="Panel lateral del login">
            <BrandLogo />
          </LeftPanel>

          <div className="flex-1 flex items-center justify-center bg-transparent relative z-20 login-main-content px-4 md:px-0">
            <div className="w-full max-w-[400px] bg-white/95 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.08)] flex flex-col gap-6 md:gap-8 z-30 login-card">
              <div className="flex flex-col items-center">
                <h1 className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-[#002C5F] via-[#0957a5] to-[#002C5F] bg-[length:200%_100%] bg-clip-text text-transparent animate-rayFlash">
                  Inicia Sesión
                </h1>
              </div>

              {/* Mostrar error si existe */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Email */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) setError(null)
                    }}
                    placeholder="Correo electrónico"
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-[#002C5F] outline-none transition-all"
                  />
                </div>

                {/* Contraseña */}
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
                    placeholder="Contraseña"
                    disabled={loading}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-[#002C5F] outline-none transition-all password-input"
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

                <button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="bg-[#002C5F] text-white p-3 text-base font-semibold rounded-lg cursor-pointer transition-all duration-300 outline-none hover:bg-[#0957a5] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Iniciando sesión...
                    </span>
                  ) : (
                    'Acceder'
                  )}
                </button>

                {/* Link de recuperación de contraseña */}
                <div className="text-center">
                  <a
                    href="#"
                    className="text-sm text-[#002C5F] hover:text-[#0957a5] hover:underline transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </form>
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

        :global(.password-input::-ms-reveal),
        :global(.password-input::-webkit-textfield-decoration-container),
        :global(.password-input::-webkit-credentials-auto-fill-button),
        :global(.password-input::-webkit-strong-password-auto-fill-button) {
          display: none !important;
        }

        @media (max-width: 768px) {
          :global(.left-panel) {
            display: none !important;
          }
          :global(.login-bottom-banner) {
            display: none !important;
          }
          :global(.login-main-content) {
            height: 100vh;
            width: 100% !important;
            padding: 20px;
          }
          :global(.login-card) {
            margin: auto;
            max-width: 350px;
            padding: 24px;
          }
          :global(.min-h-screen) {
            min-height: 100vh;
            min-height: 100svh;
          }
        }

        @media (max-width: 480px) {
          :global(.login-card) {
            max-width: 320px;
            padding: 20px;
            gap: 20px;
          }
          :global(.login-main-content) {
            padding: 16px;
          }
        }
      `}</style>
    </>
  )
}
