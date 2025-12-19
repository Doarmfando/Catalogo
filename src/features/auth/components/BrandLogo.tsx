'use client'

import React from 'react'
import Image from 'next/image'

const BrandLogo: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full px-4">
      {/* Logo principal de Hyundai */}
      <div className="relative w-32 h-32">
        <Image
          src="/logo-pr.png"
          alt="Hyundai Logo"
          fill
          sizes="128px"
          className="object-contain"
          priority
        />
      </div>

      {/* Texto del catálogo */}
      <div className="text-center">
        <h2 className="text-white text-xl font-bold uppercase tracking-wider">
          Catálogo Perú
        </h2>
        <p className="text-white/80 text-sm mt-1">
          2025-2026
        </p>
      </div>
    </div>
  )
}

export default BrandLogo
