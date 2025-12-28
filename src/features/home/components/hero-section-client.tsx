"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { HeroBanner } from "@/lib/supabase/adapters/banners";

const SLIDE_DURATION = 4500; // ms
const TICK = 50; // ms

interface HeroSectionClientProps {
  banners: HeroBanner[];
}

export function HeroSectionClient({ banners }: HeroSectionClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0); // 0–1

  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  // Autoplay con progreso lineal
  useEffect(() => {
    if (isPaused || banners.length === 0) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + TICK / SLIDE_DURATION;

        if (next >= 1) {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
          return 0;
        }

        return next;
      });
    }, TICK);

    return () => clearInterval(interval);
  }, [isPaused, banners.length]);

  useEffect(() => {
    setProgress(0);
  }, [currentIndex]);

  const handleBulletClick = (index: number) => {
    if (index === currentIndex) {
      setIsPaused((prev) => !prev);
    } else {
      setCurrentIndex(index);
      setIsPaused(false);
    }
  };

  // Determinar la imagen a mostrar: del banner o del auto
  const displayImage = currentBanner.imageUrl || currentBanner.car?.imageUrl;
  const displayImageAlt = currentBanner.car?.name || currentBanner.title;

  return (
    <section
      id="inicio"
      className="relative overflow-hidden py-14 lg:py-20 transition-colors duration-500"
      style={{ backgroundColor: currentBanner.backgroundColor }}
    >
      {/* Glows de fondo con paleta Hyundai */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,44,95,0.7),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(0,170,210,0.6),transparent_55%)] opacity-80" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[480px]">
          {/* LADO IZQUIERDO · TEXTO PROMO */}
          <div className="max-w-xl">
            {currentBanner.subtitle && (
              <p
                className="text-[0.75rem] tracking-[0.28em] uppercase mb-4 flex items-center gap-3"
                style={{ color: currentBanner.textColor === 'white' ? 'rgb(226 232 240)' : 'rgb(15 23 42)' }}
              >
                <span className="w-10 h-px bg-gradient-to-r from-[#00AAD2] to-transparent rounded-full" />
                {currentBanner.subtitle}
              </p>
            )}

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-3"
              style={{ color: currentBanner.textColor === 'white' ? '#E5F3FF' : '#020617' }}
            >
              {currentBanner.title}
            </h1>

            {currentBanner.description && (
              <p
                className="text-sm sm:text-base mb-6"
                style={{ color: currentBanner.textColor === 'white' ? 'rgb(226 232 240)' : 'rgb(51 65 85)' }}
              >
                {currentBanner.description}
              </p>
            )}

            <div className="flex flex-wrap gap-3 mb-4">
              {/* Primary: azul Hyundai */}
              {currentBanner.ctaPrimaryText && (
                <Link
                  href={currentBanner.ctaPrimaryLink}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#002C5F] hover:bg-[#0957a5] text-sm sm:text-base font-semibold text-white shadow-[0_18px_40px_rgba(0,44,95,0.6)] hover:-translate-y-[1px] transition-all"
                >
                  {currentBanner.ctaPrimaryText}
                </Link>
              )}

              {/* Secundario: borde cian */}
              {currentBanner.ctaSecondaryText && (
                <Link
                  href={currentBanner.ctaSecondaryLink}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-[rgba(0,170,210,0.8)] text-sm sm:text-base font-medium hover:bg-[rgba(0,170,210,0.18)] hover:-translate-y-[1px] transition-all"
                  style={{ color: currentBanner.textColor === 'white' ? '#E5F3FF' : '#002C5F' }}
                >
                  {currentBanner.ctaSecondaryText}
                </Link>
              )}
            </div>
          </div>

          {/* LADO DERECHO · IMAGEN PROMOCIONAL */}
          <div className="relative">
            <div className="absolute inset-x-0 bottom-0 h-40 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.9),transparent_70%)] opacity-80" />

            <div className="relative max-w-xl mx-auto">
              <div className="rounded-[1.6rem]">
                <div className="relative aspect-[16/9] flex items-center justify-center">
                  {displayImage ? (
                    <img
                      key={currentBanner.id}
                      src={displayImage}
                      alt={displayImageAlt}
                      className="w-full h-full object-contain drop-shadow-[0_26px_40px_rgba(15,23,42,0.85)]"
                    />
                  ) : (
                    <div
                      className="flex items-center justify-center w-full h-full text-sm"
                      style={{ color: currentBanner.textColor === 'white' ? 'rgb(203 213 225)' : 'rgb(100 116 139)' }}
                    >
                      Imagen no disponible
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de modelos + bullets debajo, centrados */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <p
            className="text-[0.7rem] sm:text-xs uppercase tracking-[0.25em] text-center"
            style={{ color: currentBanner.textColor === 'white' ? 'rgb(226 232 240)' : 'rgb(71 85 105)' }}
          >
            {banners.map((banner, i) => {
              const name = banner.car?.name || banner.title;
              return i === banners.length - 1
                ? name
                : `${name}  |  `;
            })}
          </p>

          {/* Bullets con animación simple (scale) y colores del proyecto */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,44,95,0.5)] bg-[rgba(15,23,42,0.96)] px-4 py-2 shadow-[0_14px_35px_rgba(15,23,42,0.9)]">
            <div className="flex items-center gap-2">
              {banners.map((banner, index) => {
                const isActive = index === currentIndex;
                const scale = isActive ? 0.2 + 1 * progress : 0.2;

                return (
                  <button
                    key={banner.id}
                    onClick={() => handleBulletClick(index)}
                    className="relative h-6 w-6 flex items-center justify-center"
                    aria-label={`Ver vehículo ${index + 1}`}
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[rgba(148,163,184,0.6)]">
                      <span
                        className={`h-4 w-4 rounded-full transition-transform duration-75 ${
                          isActive
                            ? isPaused
                              ? "bg-amber-300"
                              : "bg-[#00AAD2]"
                            : "bg-slate-200/90"
                        }`}
                        style={{
                          transform: `scale(${scale})`,
                        }}
                      />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
