import { CarFront, Sparkles, WalletCards, Settings2 } from "lucide-react";

export function BrandsSection() {
  const brands = [

    {
      name: "EXPERIENCIA INTEGRAL",
      description:
        "Encuentra el vehículo perfecto con asesoría personalizada y pruebas de manejo disponibles.",
      badge: "Atención personalizada",
      Icon: Sparkles,
    },
    {
      name: "FINANCIAMIENTO FLEXIBLE",
      description:
        "Opciones de financiamiento desde 0% inicial con planes ajustados a tu presupuesto.",
      badge: "Desde 0% inicial",
      Icon: WalletCards,
    },
    {
      name: "SERVICIOS ADICIONALES",
      description:
        "Seguros, retoma de vehículo usado, mantenimiento programado y garantía extendida.",
      badge: "Todo en una sola plataforma",
      Icon: Settings2,
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
          {/* <span className="px-3 py-1 rounded-full text-[0.7rem] border border-[rgba(0,44,95,0.2)] text-[#6b7280] bg-white">
            Experiencia completa
          </span> */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map((brand, index) => {
            const Icon = brand.Icon;
            return (
              <article
                key={index}
                className="
                  group
                  rounded-[1.1rem]
                  border border-[rgba(0,44,95,0.18)]
                  p-4
                  bg-white
                  shadow-[0_18px_40px_rgba(0,0,0,0.12)]
                  flex flex-col gap-2 text-[0.8rem]
                  transition-all duration-200
                  hover:-translate-y-1
                  hover:border-transparent
                  hover:shadow-[0_22px_50px_rgba(0,44,95,0.35)]
                  hover:bg-gradient-to-br hover:from-[#002C5F] hover:to-[#0957a5]
                "
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="
                      flex h-9 w-9 items-center justify-center
                      rounded-full
                      border border-[rgba(0,44,95,0.18)]
                      bg-[#eff3fb]
                      transition-colors
                      group-hover:bg-white/10
                      group-hover:border-white/70
                    "
                  >
                    <Icon
                      className="
                        h-4 w-4
                        text-[#002C5F]
                        transition-colors
                        group-hover:text-white
                      "
                    />
                  </div>
                  <h3
                    className="
                      text-base font-semibold text-[#002C5F]
                      transition-colors
                      group-hover:text-white
                    "
                  >
                    {brand.name}
                  </h3>
                </div>

                <p
                  className="
                    text-[#6b7280]
                    transition-colors
                    group-hover:text-[#E5E7EB]
                  "
                >
                  {brand.description}
                </p>

              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
