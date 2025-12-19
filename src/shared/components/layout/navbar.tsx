"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 backdrop-blur-[16px] bg-[#FFFFFF] border-b border-[rgba(0,44,95,0.16)]">
      <div className="container-custom">
        <div className="flex items-center justify-between py-3 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4">
            <Image
              src="/logo-asm.png"
              alt="Hyundai"
              width={80}
              height={80}
              className="w-22 h-11 object-contain"
              priority
            />
            <div className="flex flex-col text-[0.8rem] uppercase tracking-[0.16em]">
              <span className="font-semibold text-[0.85rem] text-[#002C5F]">2025-2026</span>
              <span className="text-[#6b7280] text-[0.7rem]">Catálogo Perú</span>
            </div>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden border border-[rgba(0,44,95,0.4)] p-2 rounded-full text-[#002C5F] hover:bg-[rgba(0,44,95,0.06)]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 text-[0.82rem] uppercase tracking-[0.2em]">
            <Link
              href="#inicio"
              className="px-3 py-2 rounded-full text-[#6b7280] hover:bg-[rgba(0,44,95,0.06)] hover:text-[#002C5F] transition-all duration-[180ms] hover:-translate-y-px"
            >
              Inicio
            </Link>
            <Link
              href="#modelos"
              className="px-3 py-2 rounded-full text-[#6b7280] hover:bg-[rgba(0,44,95,0.06)] hover:text-[#002C5F] transition-all duration-[180ms] hover:-translate-y-px"
            >
              Modelos
            </Link>
            {/* <Link
              href="#marcas"
              className="px-3 py-2 rounded-full text-[#6b7280] hover:bg-[rgba(0,44,95,0.06)] hover:text-[#002C5F] transition-all duration-[180ms] hover:-translate-y-px"
            >
              Servicios
            </Link> */}

            <Link
              href="#contacto"
              className="px-3 py-2 rounded-full text-[#6b7280] hover:bg-[rgba(0,44,95,0.06)] hover:text-[#002C5F] transition-all duration-[180ms] hover:-translate-y-px"
            >
              Soporte
            </Link>

            <Link
              href="/login"
              className="px-3 py-2 rounded-full border border-[#002C5F] text-[#002C5F] hover:bg-[#002C5F] hover:text-white transition-all duration-[180ms] hover:-translate-y-px"
            >
              Ingresar
            </Link>
            <Link
              href="#modelos"
              className="px-4 py-2 rounded-full bg-gradient-to-br from-[#002C5F] to-[#0957a5] text-white font-semibold shadow-[0_10px_25px_rgba(0,44,95,0.35)] hover:shadow-[0_12px_30px_rgba(0,44,95,0.45)] hover:-translate-y-px transition-all duration-[180ms]"
            >
              Cotizar ahora
            </Link>
          </nav>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="lg:hidden absolute top-[3.2rem] left-4 right-4 flex flex-col bg-white rounded-2xl border border-[rgba(0,44,95,0.25)] p-3 shadow-lg text-[0.82rem] uppercase tracking-[0.2em]">
              <Link
                href="#inicio"
                className="px-4 py-3 rounded-lg text-[#002C5F] hover:bg-[rgba(0,44,95,0.06)] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                href="#modelos"
                className="px-4 py-3 rounded-lg text-[#002C5F] hover:bg-[rgba(0,44,95,0.06)] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Modelos
              </Link>
              <Link
                href="#marcas"
                className="px-4 py-3 rounded-lg text-[#002C5F] hover:bg-[rgba(0,44,95,0.06)] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Servicios
              </Link>
              <Link
                href="#contacto"
                className="px-4 py-3 rounded-lg text-[#002C5F] hover:bg-[rgba(0,44,95,0.06)] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </Link>
              <Link
                href="/login"
                className="px-4 py-3 rounded-lg border border-[#002C5F] text-[#002C5F] hover:bg-[#002C5F] hover:text-white transition-colors text-center mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Ingresar
              </Link>
              <Link
                href="#modelos"
                className="px-4 py-3 rounded-lg bg-gradient-to-br from-[#002C5F] to-[#0957a5] text-white font-semibold text-center mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Cotizar ahora
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
