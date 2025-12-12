// me gustó cómo quedó así que lo dejé como para los mapas en caso pidan o tener como plantilla a futuro xd
"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

const brands = [
  {
    name: "Hyundai",
    description: "Gama completa de sedanes, SUV, utilitarios, camiones y buses.",
    badge: "Modelos eco · híbridos & eléctricos",
  },
  {
    name: "Experiencia integral",
    description:
      "Encuentra el vehículo perfecto con asesoría personalizada y pruebas de manejo disponibles.",
    badge: "Atención personalizada",
  },
  {
    name: "Financiamiento flexible",
    description:
      "Opciones de financiamiento desde 0% inicial con planes ajustados a tu presupuesto.",
    badge: "Desde 0% inicial",
  },
  {
    name: "Servicios adicionales",
    description:
      "Seguros, retoma de vehículo usado, mantenimiento programado y garantía extendida.",
    badge: "Todo en una sola plataforma",
  },
];

export function BrandsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeBrand = brands[activeIndex];

  return (
    <section className="py-12 lg:py-16 bg-[#f9fafb]" id="marcas">
      <div className="container-custom space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
          <div>
            <p className="text-[0.7rem] tracking-[0.18em] uppercase text-[#6b7280] mb-1">
              Servicios para tu experiencia Hyundai
            </p>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#002C5F] mb-2">
              Servicios & experiencia
            </h2>
            <p className="text-sm text-[#6b7280] max-w-md">
              Nuestro catálogo integra servicios postventa: mantenimientos, garantías extendidas y
              planes de financiamiento personalizados.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-[0.7rem] border border-[rgba(0,44,95,0.2)] text-[#6b7280] bg-white">
            Experiencia completa
          </span>
        </div>

        {/* Layout tipo Chevrolet: panel destacado + tarjetas de selección */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] items-stretch">
          {/* Panel destacado que cambia con el hover/click */}
          <div className="relative overflow-hidden rounded-[1.4rem] bg-gradient-to-br from-[#002C5F] via-[#003b87] to-[#00AAD2] text-white p-6 lg:p-7 shadow-[0_22px_50px_rgba(0,44,95,0.45)]">
            {/* Glow decorativo */}
            <div className="pointer-events-none absolute -left-20 top-[-12%] h-60 w-60 rotate-12 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.22),transparent_60%)]" />
            <div className="pointer-events-none absolute right-[-15%] bottom-[-20%] h-64 w-64 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.28),transparent_65%)]" />

            <div className="relative z-10 flex flex-col gap-5">
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1.5">
                  <p className="text-[0.7rem] uppercase tracking-[0.20em] text-white/70">
                    Enfoque actual
                  </p>
                  <h3 className="text-2xl lg:text-3xl font-semibold leading-snug">
                    {activeBrand.name}
                  </h3>
                </div>
                <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/25 px-3 py-1 text-[0.7rem] uppercase tracking-[0.18em]">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
                  Activo
                </div>
              </div>

              <p className="text-sm lg:text-[0.9rem] text-white/90 max-w-xl">
                {activeBrand.description}
              </p>

              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/30 text-[0.75rem] font-medium w-fit backdrop-blur-sm">
                {activeBrand.badge}
              </span>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[0.78rem] text-white/85">
                <p className="max-w-md">
                  Pasa el cursor o toca las tarjetas de la derecha para cambiar el servicio
                  destacado y descubrir todo lo que incluye tu experiencia Hyundai.
                </p>

                <div className="flex items-center gap-2 rounded-full bg-white/10 border border-white/25 px-3 py-1.5 text-[0.72rem]">
                  <span className="uppercase tracking-[0.18em]">Servicios</span>
                  <span className="h-[1px] w-6 bg-white/40" />
                  <span>
                    {activeIndex + 1} de {brands.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjetas de selección (hover/click cambian el panel) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {brands.map((brand, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={brand.name}
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  className={[
                    "group rounded-[1.1rem] border p-4 text-left bg-white/80 backdrop-blur-sm flex flex-col gap-1.5 text-[0.8rem] transition-all duration-200",
                    "hover:-translate-y-[3px] hover:shadow-[0_18px_40px_rgba(0,44,95,0.18)]",
                    isActive
                      ? "border-[rgba(0,44,95,0.9)] shadow-[0_18px_42px_rgba(0,44,95,0.32)] bg-white"
                      : "border-[rgba(0,44,95,0.18)] hover:border-[rgba(0,44,95,0.5)]",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className={`text-[0.9rem] font-semibold ${
                        isActive ? "text-[#002C5F]" : "text-[#111827]"
                      }`}
                    >
                      {brand.name}
                    </h3>
                    <span
                      className={[
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.16em]",
                        isActive
                          ? "bg-[rgba(0,44,95,0.06)] text-[#002C5F] border border-[rgba(0,44,95,0.4)]"
                          : "bg-[#f3f4f6] text-[#6b7280] border border-[rgba(148,163,184,0.4)]",
                      ].join(" ")}
                    >
                      {isActive ? "Seleccionado" : "Ver detalle"}
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>

                  <p className="text-[#6b7280] line-clamp-3">{brand.description}</p>

                  <span
                    className={`inline-block text-[0.7rem] px-2.5 py-1 rounded-full mt-1 self-start border ${
                      isActive
                        ? "bg-[rgba(0,44,95,0.06)] border-[rgba(0,44,95,0.5)] text-[#002C5F]"
                        : "bg-[#f9fafb] border-[rgba(148,163,184,0.5)] text-[#1c1b1b]"
                    }`}
                  >
                    {brand.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
