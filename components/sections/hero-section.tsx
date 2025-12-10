"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { cars } from "@/data/cars";

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Seleccionar solo 5 autos para el slider
  const featuredCars = cars.slice(0, 5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredCars.length);
    }, 4000); // Cambia cada 4 segundos

    return () => clearInterval(interval);
  }, [featuredCars.length]);

  const currentCar = featuredCars[currentIndex];

  return (
    <section className="py-14 lg:py-20" id="inicio">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
          {/* Left Content */}
          <div>
            <p className="text-[0.8rem] tracking-[0.25em] uppercase text-[#002C5F] mb-3 flex items-center gap-3">
              <span className="w-10 h-px bg-gradient-to-r from-[#002C5F] to-transparent rounded-full"></span>
              Catálogo 2025-2026
            </p>

            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4 text-[#002C5F]">
              Encuentra el{" "}
              <span className="bg-gradient-to-br from-[#002C5F] to-[#1c1b1b] bg-clip-text text-transparent">
                vehículo ideal
              </span>{" "}
              para tu próxima ruta.
            </h1>

            <p className="text-base text-[#6b7280] max-w-lg mb-6">
              Explora nuestro catálogo completo de vehículos Hyundai: SUV, Sedán, Hatchback,
              Utilitarios y Comerciales. Encuentra el modelo perfecto para ti con opciones de
              financiamiento flexibles.
            </p>

            <div className="flex flex-wrap gap-3 mb-7">
              <div className="px-3 py-1 rounded-full border border-[rgba(0,44,95,0.2)] bg-white text-[0.72rem] text-[#6b7280]">
                <strong className="text-[#002C5F]">+40</strong> modelos disponibles
              </div>
              <div className="px-3 py-1 rounded-full border border-[rgba(0,44,95,0.2)] bg-white text-[0.72rem] text-[#6b7280]">
                <strong className="text-[#002C5F]">Gasolina · Diésel · Híbridos</strong>
              </div>
              {/* <div className="px-3 py-1 rounded-full border border-[rgba(0,44,95,0.2)] bg-white text-[0.72rem] text-[#6b7280]">
                <strong className="text-[#002C5F]">Financiamiento</strong> desde 0%
              </div> */}
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <Link
                href="#modelos"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-br from-[#002C5F] to-[#0957a5] text-white font-medium shadow-[0_18px_35px_rgba(0,44,95,0.35)] hover:shadow-[0_20px_40px_rgba(0,44,95,0.45)] hover:-translate-y-px transition-all duration-200"
              >
                Ver catálogo completo
                <ArrowDown className="w-4 h-4" />
              </Link>
              <Link
                href="#contacto"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[rgba(0,44,95,0.4)] text-[#002C5F] hover:bg-[rgba(0,44,95,0.06)] transition-all duration-200"
              >
                Hablar con un asesor
              </Link>
            </div>

            <p className="text-[0.7rem] text-[#6b7280] mt-5">
              Catálogo oficial de <span className="text-[#002C5F] font-medium">Hyundai Perú</span> ·
              Concesionarios autorizados
            </p>
          </div>

          {/* Right Visual - Featured Car Card Slider */}
          <aside className="rounded-[1.3rem] bg-gradient-to-br from-[#002C5F] via-[#0b1120] to-[#020617] p-px shadow-[0_18px_40px_rgba(0,0,0,0.12)] relative">
            <div className="rounded-[1.3rem] bg-gradient-to-br from-[#1f2937] to-[#020617] p-5 relative overflow-hidden">
              <div className="rounded-xl bg-gradient-to-br from-[#020617] to-[#1e293b] border border-[rgba(148,163,184,0.35)] p-4 relative overflow-hidden transition-all duration-500">
                {/* Glow effect */}
                <div className="absolute inset-x-[-40%] top-0 h-[120%] bg-[radial-gradient(circle_at_10%_0,rgba(56,189,248,0.3),transparent_55%)] opacity-70 pointer-events-none"></div>

                {/* Card Header */}
                <div className="flex items-center justify-between mb-2 relative z-10">
                  <div>
                    <h3 className="text-sm font-semibold text-[#e5e7eb]">{currentCar.category} · {currentCar.name}</h3>
                    <p className="text-[0.65rem] text-[#cbd5e1] mt-1">
                      Catálogo destacado
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full border border-[rgba(148,163,184,0.5)] ml-2 bg-[rgba(15,23,42,0.95)]">
                        {currentCar.year}
                      </span>
                    </p>
                  </div>
                  <span className="text-[0.68rem] px-2 py-1 rounded-full bg-[rgba(0,44,95,0.08)] text-[#e5e7eb] border border-[rgba(148,163,184,0.5)]">
                    {currentCar.fuelType}
                  </span>
                </div>

                {/* Car Image */}
                <div className="mt-3 grid grid-cols-[1.3fr_1fr] gap-3 items-center relative z-10">
                  <div className="aspect-video rounded-lg bg-gradient-to-br from-[rgba(248,250,252,0.9)] to-[#020617] flex items-center justify-center p-3 overflow-hidden relative">
                    <div className="absolute inset-x-[10%] bottom-[7%] h-[26%] bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.65),transparent_65%)] opacity-90"></div>
                    {currentCar.image ? (
                      <Image
                        key={currentCar.id}
                        src={currentCar.image}
                        alt={currentCar.name}
                        width={300}
                        height={200}
                        className="w-full h-full object-contain relative z-10 transition-opacity duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[0.7rem] text-[#cbd5e1]">
                        Sin imagen
                      </div>
                    )}
                  </div>

                  <div className="text-[0.7rem] text-[#cbd5e1] space-y-1.5">
                    <div className="flex justify-between">
                      <span>Año:</span>
                      <strong className="text-[#e5e7eb]">{currentCar.year}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Categoría:</span>
                      <strong className="text-[#e5e7eb]">{currentCar.category}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Combustible:</span>
                      <strong className="text-[#e5e7eb]">{currentCar.fuelType}</strong>
                    </div>
                    <div className="pt-2">
                      <div className="text-[0.9rem] font-semibold text-[#f9fafb]">Desde</div>
                      <div className="text-base font-semibold text-white">
                        ${currentCar.priceUSD.toLocaleString("en-US")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom ribbon with indicators */}
              <div className="mt-3 flex items-center justify-center gap-3 text-[0.68rem] text-[#cbd5e1]">
                <span className="text-[0.65rem]">Catálogo destacado</span>
                <div className="flex gap-2 items-center">
                  {featuredCars.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`h-8 rounded-md transition-all font-medium ${
                        index === currentIndex
                          ? "bg-[#22c55e] text-white px-3 shadow-lg"
                          : "bg-[rgba(148,163,184,0.2)] text-[#cbd5e1] px-2.5 hover:bg-[rgba(148,163,184,0.3)]"
                      }`}
                      aria-label={`Ver vehículo ${index + 1}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
