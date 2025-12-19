'use client'

import React from 'react'
import Image from 'next/image'

const BrandLogo: React.FC = () => {
  return (
<div className="flex flex-col items-stretch justify-center gap-6 w-full px-0">
  {/* Logo */}
  <div className="w-full">
<div className="w-full bg-black/60 backdrop-blur-sm ring-1 ring-black/10 px-4 py-3 flex items-center justify-center overflow-hidden">
      <Image
        src="/images/automecanica_blanco.png"
        alt="ASM Logo"
        width={320}
        height={120}
        priority
        className="h-14 w-auto max-w-[70%] object-contain"
      />
    </div>
  </div>

  {/* Texto */}
  <div className="text-center w-full px-4">
    <h2 className="text-white text-xl font-bold uppercase tracking-wider">
      Catálogo
    </h2>
    <p className="text-white/80 text-sm mt-1">(2025-2026)</p>
  </div>
</div>

  )
}

export default BrandLogo
