export function BrandsSection() {
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

  return (
    <section className="py-10" id="marcas">
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
          <span className="px-3 py-1 rounded-full text-[0.7rem] border border-[rgba(0,44,95,0.2)] text-[#6b7280] bg-white">
            Experiencia completa
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {brands.map((brand, index) => (
            <article
              key={index}
              className="rounded-[1.1rem] border border-[rgba(0,44,95,0.18)] p-4 bg-white shadow-[0_18px_40px_rgba(0,0,0,0.12)] flex flex-col gap-1.5 text-[0.8rem] hover:shadow-[0_20px_45px_rgba(0,44,95,0.15)] transition-shadow"
            >
              <h3 className="text-base font-semibold text-[#002C5F]">{brand.name}</h3>
              <p className="text-[#6b7280]">{brand.description}</p>
              <span className="inline-block text-[0.7rem] px-2.5 py-1 rounded-full bg-[#f3f4f6] border border-[rgba(148,163,184,0.5)] text-[#1c1b1b] mt-1 self-start">
                {brand.badge}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
