"use client";

import Link from "next/link";
import { VersionsAndGallery } from "@/features/catalog/components";
import { useCarDetailRealtime } from "@/hooks/use-car-detail-realtime";
import type { Car } from "@/shared/types/car";

import {
  ArrowLeft,
  Fuel,
  Zap,
  BadgeCheck,
  PhoneCall,
} from "lucide-react";

function money(n: number) {
  return n.toLocaleString("en-US");
}

function fuelMeta(fuelType: string) {
  const t = (fuelType ?? "").toUpperCase();
  if (t.startsWith("EL") || t.includes("EV")) return { label: "Eléctrico", Icon: Zap };
  if (t.includes("HIBR") || t.includes("HYBR")) return { label: "Híbrido", Icon: Zap };
  if (t.includes("DIESEL")) return { label: "Diésel", Icon: Fuel };
  return { label: "Gasolina", Icon: Fuel };
}

function WheelTire({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      {/* CUERPO del neumático (donut relleno, NO timón) */}
      <path
        fill="white"
        opacity="0.14"
        fillRule="evenodd"
        d="
          M50,3
          A47,47 0 1 1 49.999,3
          Z
          M50,28
          A22,22 0 1 0 50,28
          Z
        "
      />

      {/* Detalle sutil de pared lateral */}
      <circle
        cx="50"
        cy="50"
        r="36"
        fill="none"
        stroke="white"
        strokeWidth="2"
        opacity="0.08"
        strokeDasharray="2 10"
      />

      {/* Tacos (banda de rodadura) — esto hace que SE VEA neumático al girar */}
      {Array.from({ length: 26 }).map((_, i) => (
        <path
          key={i}
          d="M44 1 L56 1 L53 11 L47 11 Z"
          fill="white"
          opacity="0.18"
          transform={`rotate(${i * (360 / 26)} 50 50)`}
        />
      ))}

      {/* Micro-cortes adicionales (más "caucho") */}
      {Array.from({ length: 13 }).map((_, i) => (
        <rect
          key={i}
          x="49"
          y="10"
          width="2"
          height="8"
          rx="1"
          fill="white"
          opacity="0.10"
          transform={`rotate(${i * (360 / 13)} 50 50)`}
        />
      ))}
    </svg>
  );
}

interface ModelDetailClientProps {
  initialCar: Car;
  carId: string;
}

export function ModelDetailClient({ initialCar, carId }: ModelDetailClientProps) {
  // Use Realtime hook to get live updates
  const car = useCarDetailRealtime(initialCar, carId);

  const versions = car.versions ?? [];
  const { label: fuelLabel, Icon: FuelIcon } = fuelMeta(car.fuelType);

  return (
    <>
    {/* HERO */}
<section id="inicio" className="relative overflow-hidden bg-[#0b1d35] text-white">
  {/* fondos */}
  <div className="absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_top,rgba(9,87,165,0.55),transparent_58%)]" />
  <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_right,rgba(255,255,255,0.14),transparent_52%)]" />
  <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(rgba(255,255,255,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.35)_1px,transparent_1px)] bg-[size:56px_56px]" />
  {/* textura sutil (novedosa, nada "difuminado") */}

  <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
  {/* pocas, pequeñas y sutiles */}
  <div className="hidden lg:block absolute left-6 top-20 opacity-[0.08] mix-blend-soft-light">
    <div className="wheel-float">
      <WheelTire className="wheel-spin h-10 w-10 [animation-duration:26s]" />
    </div>
  </div>

  <div className="hidden lg:block absolute left-28 bottom-24 opacity-[0.06] mix-blend-soft-light">
    <div className="wheel-float [animation-duration:8.5s]">
      <WheelTire className="wheel-spin h-12 w-12 [animation-duration:32s]" />
    </div>
  </div>

  <div className="hidden lg:block absolute right-10 top-24 opacity-[0.07] mix-blend-soft-light">
    <div className="wheel-float [animation-duration:9s]">
      <WheelTire className="wheel-spin h-12 w-12 [animation-duration:30s]" />
    </div>
  </div>

  <div className="hidden xl:block absolute right-28 bottom-20 opacity-[0.05] mix-blend-soft-light">
    <div className="wheel-float [animation-duration:10s]">
      <WheelTire className="wheel-spin h-14 w-14 [animation-duration:38s]" />
    </div>
  </div>
</div>

  <div className="container-custom relative pt-12 lg:pt-24 pb-28 lg:pb-36">

    <div className="h-6 lg:h-8" aria-hidden="true" />
    {/* Top bar (mismo estilo chips/glass) */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <Link
        href="/#modelos"
        className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-2 text-sm text-white/85 hover:text-white hover:bg-white/12 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al catálogo
      </Link>

      <div className="hidden md:flex items-center gap-2 text-xs text-white/80">
        <Link
          href="/"
          className="px-3 py-1 rounded-full bg-white/10 border border-white/15 hover:bg-white/12 transition"
        >
          Inicio
        </Link>
        <span className="opacity-50">/</span>
        <Link
          href="/#modelos"
          className="px-3 py-1 rounded-full bg-white/10 border border-white/15 hover:bg-white/12 transition"
        >
          Modelos
        </Link>
        <span className="opacity-50">/</span>
        <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white">
          {car.name}
        </span>
      </div>
    </div>


    {/* Contenido */}
    <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-14 items-start">
      {/* LEFT */}
      <div className="lg:pr-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs tracking-wide">
            {car.category} · {car.year}
          </span>
          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs inline-flex items-center gap-2">
            <FuelIcon className="h-4 w-4" />
            {fuelLabel}
          </span>
          {versions.length > 0 && (
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs">
              {versions.length} versiones
            </span>
          )}
        </div>

        <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight mt-5">
          {car.name}
        </h1>

        {/* Price box (más aire interno) */}
        <div className="mt-7 rounded-2xl ">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div>
              <p className="text-xs text-white/70">PRECIO DESDE</p>
              <div className="text-3xl font-extrabold tracking-tight mt-1">
                ${money(car.priceUSD)}
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-white/75">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
              <BadgeCheck className="h-4 w-4" />
              Garantía y respaldo
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
              <BadgeCheck className="h-4 w-4" />
              Opciones de financiamiento
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
              <BadgeCheck className="h-4 w-4" />
              Asesoría personalizada
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT (IMAGE) */}
      <div className="relative z-10">
        <div className="relative">
        {/* <div className="relative shadow-[0_28px_80px_rgba(0,0,0,0.35)]"> */}
          <div className="aspect-video">
            <img
              src={car.image}
              alt={car.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* divider moderno (reemplaza el fade) */}
  <div className="pointer-events-none absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
    <svg
      className="block w-full h-[84px] lg:h-[120px]"
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        fill="#f6f3f2"
        d="M0,70 C240,120 480,128 720,98 C960,68 1200,16 1440,36 L1440,120 L0,120 Z"
      />
    </svg>
  </div>
</section>



      <div className="h-10 lg:h-14 bg-[#f6f3f2]" aria-hidden="true" />

      {/* VERSIONES */}
<section id="modelos" className="container-custom pt-16 pb-12 lg:pt-20 lg:pb-16 scroll-mt-24">


        <div className="mt-8">
          <VersionsAndGallery
            modelName={car.name}
            versions={versions}
            basePriceUSD={car.priceUSD}
          />
        </div>
        {/* CTA FINAL */}
        <div
          id="contacto"
          className="mt-12 rounded-[1.3rem] bg-white border border-[rgba(0,44,95,0.14)] p-6 lg:p-8 shadow-[0_18px_40px_rgba(0,0,0,0.08)] scroll-mt-24"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <h3 className="text-xl font-extrabold text-[#002C5F]">
                ¿Quieres cotizar este modelo?
              </h3>
              <p className="text-sm text-[#6b7280] mt-1">
                Te ayudamos a elegir la versión correcta y te enviamos la mejor oferta disponible.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href="tel:+51944532822"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(0,44,95,0.25)] text-[#002C5F] px-5 py-2.5 text-sm font-semibold hover:bg-[rgba(0,44,95,0.06)] transition"
              >
                <PhoneCall className="h-4 w-4" />
                Llamar
              </a>

              <Link
                href="/#contacto"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-[#002C5F] to-[#0957a5] text-white px-5 py-2.5 text-sm font-semibold shadow-[0_14px_36px_rgba(0,44,95,0.22)] hover:opacity-95 transition"
              >
                Ir a Contacto
              </Link>
            </div>
          </div>
        </div>


      </section>
    </>
  );
}
