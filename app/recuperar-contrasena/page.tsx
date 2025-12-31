'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import {
  CirclesBackground,
  LeftPanel,
  BrandLogo,
  FooterBanner,
} from '@/features/auth/components'

export default function RecuperarContrasenaPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!email.trim()) {
        setError('Por favor ingresa tu correo electrónico')
        setLoading(false)
        return
      }

      const res = await fetch('/api/auth/recuperar-contrasena', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al enviar el correo')
        setLoading(false)
        return
      }

      setSuccess(true)
    } catch (err) {
      setError('Error al enviar el correo de recuperación')
      setLoading(false)
    }
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
                      Recuperar Contraseña
                    </h1>
                    <p className="text-sm text-gray-600 mt-3 text-center">
                      Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
                    </p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                        <Mail className="w-5 h-5 text-gray-400" />
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

                    <button
                      type="submit"
                      disabled={loading || !email}
                      className="bg-[#002C5F] text-white p-3 text-base font-semibold rounded-lg cursor-pointer transition-all duration-300 outline-none hover:bg-[#0957a5] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Enviando...
                        </span>
                      ) : (
                        'Enviar Enlace de Recuperación'
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
                    ¡Correo Enviado!
                  </h2>
                  <p className="text-gray-600">
                    Hemos enviado un enlace de recuperación a <strong>{email}</strong>
                  </p>
                  <p className="text-sm text-gray-500">
                    Por favor revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
                  </p>
                  <Link
                    href="/login"
                    className="mt-4 flex items-center justify-center gap-2 text-sm text-[#002C5F] hover:text-[#0957a5] hover:underline transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Volver al inicio de sesión
                  </Link>
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
