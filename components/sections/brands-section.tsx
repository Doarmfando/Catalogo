"use client";

import Image from "next/image";
import { Sparkles, WalletCards, Settings2 } from "lucide-react";

export function BrandsSection() {
  const brands = [
    {
      name: "EXPERIENCIA INTEGRAL",
      description:
        "Encuentra el vehículo perfecto con asesoría personalizada y pruebas de manejo disponibles.",
      badge: "Atención personalizada",
      Icon: Sparkles,
      image: "/images/servicios/experiencia.jpg",
    },
    {
      name: "FINANCIAMIENTO FLEXIBLE",
      description:
        "Opciones de financiamiento desde 0% inicial con planes ajustados a tu presupuesto.",
      badge: "Desde 0% inicial",
      Icon: WalletCards,
      image: "/images/servicios/financiamiento.jpg",
    },
    {
      name: "SERVICIOS ADICIONALES",
      description:
        "Seguros, retoma de vehículo usado, mantenimiento programado y garantía extendida.",
      badge: "Todo en una sola plataforma",
      Icon: Settings2,
      image: "/images/servicios/servicios.png",
    },
  ];

  return (
    <section className="py-10 scroll-mt-24 lg:scroll-mt-15" id="marcas">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-6">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#002C5F] mb-2">
              Servicios & experiencia
            </h2>
            <p className="text-sm text-[#6b7280] max-w-md">
              Nuestro catálogo integra servicios postventa: mantenimientos, garantías extendidas y
              planes de financiamiento personalizados.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map((brand) => {
            const Icon = brand.Icon;

            return (
              <article
                key={brand.name}
                className="
                  overflow-hidden
                  rounded-[1.1rem]
                  border border-[rgba(0,44,95,0.18)]
                  bg-white
                  shadow-[0_18px_40px_rgba(0,0,0,0.10)]
                "
              >
                {/* Imagen */}
                <div className="relative aspect-[12/10] bg-gradient-to-br from-[#f9fafb] to-[#e5e7eb]">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    className="object-cover"
                    sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                  />
                </div>

                {/* Contenido */}
                <div className="p-4 flex flex-col gap-2 text-[0.82rem]">
                  <div className="flex items-start gap-3">


                    <div className="flex-1">
                      <h3 className="text-[0.95rem] font-semibold text-[#002C5F] leading-snug">
                        {brand.name}
                      </h3>
                      <p className="text-[#6b7280] leading-relaxed mt-1">
                        {brand.description}
                      </p>
                    </div>
                  </div>


                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
