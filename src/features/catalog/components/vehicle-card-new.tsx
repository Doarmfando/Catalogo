"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Fuel, Zap } from "lucide-react";
import type { Car } from "@/shared/types/car";

interface VehicleCardProps {
  car: Car;
}

export function VehicleCardNew({ car }: VehicleCardProps) {
  const [showFrontal, setShowFrontal] = useState(false);
  const currentImage = showFrontal && car.imageFrontal ? car.imageFrontal : car.image;
  const getFuelInfo = (fuelType: Car["fuelType"]) => {
    const normalized = fuelType.toUpperCase();
    if (normalized.startsWith("EL")) {
      return { label: "Electrico", Icon: Zap };
    }
    if (normalized.includes("DIESEL")) {
      return { label: "Diesel", Icon: Fuel };
    }
    return { label: "Gasolina", Icon: Fuel };
  };
  const { label: fuelLabel, Icon: FuelIcon } = getFuelInfo(car.fuelType);

  return (
    <article
      className="bg-white rounded-[1.1rem] border border-[rgba(0,44,95,0.14)] p-3.5 flex flex-col gap-2.5 shadow-[0_18px_40px_rgba(0,0,0,0.12)] transition-all duration-[180ms] hover:-translate-y-1 hover:border-[rgba(0,44,95,0.5)] hover:shadow-[0_18px_40px_rgba(0,44,95,0.28)] hover:bg-white relative overflow-hidden group"
      aria-label={`${car.name} · ${car.category} · ${car.fuelType}`}
      onMouseEnter={() => setShowFrontal(true)}
      onMouseLeave={() => setShowFrontal(false)}
    >
      {/* Hover glow effect */}
      <div className="absolute inset-x-[-10%] top-[-60%] h-[50%] bg-[radial-gradient(circle_at_top,rgba(0,44,95,0.12),transparent_65%)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>

      {/* Top badges */}
      <div className="flex items-center justify-between gap-2 text-[0.7rem] text-[#6b7280] relative z-10">
        {/* <span className="px-2.5 py-1 rounded-full border border-[rgba(0,44,95,0.4)] uppercase tracking-[0.16em] text-[0.62rem] text-[#002C5F] bg-[rgba(0,44,95,0.04)]">
          Hyundai
        </span> */}
<span
  className="ml-auto inline-flex items-center justify-center px-2.5 py-0.5 rounded-full 
             border border-[#E5E7EB] bg-[#F9FAFB] 
             text-[0.7rem] font-medium text-[#4B5563]"
>
  {car.year}
</span>


      </div>

      {/* Image */}
      <div className="rounded-xl bg-gradient-to-br from-[#f9fafb] to-[#e5e7eb] aspect-video flex items-center justify-center overflow-hidden relative">
        {/* <div className="absolute left-3 bottom-2.5 text-[0.6rem] px-2 py-1 rounded-full bg-[rgba(255,255,255,0.9)] border border-[rgba(148,163,184,0.5)] text-[#6b7280] z-10">
          Imagen referencial
        </div> */}
        {currentImage ? (
          <Image
            key={currentImage}
            src={currentImage}
            alt={car.name}
            width={468}
            height={260}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        ) : (
          <div className="w-[82%] h-[55%] rounded-full border-2 border-[rgba(0,0,0,0.06)] bg-gradient-to-br from-[#e5e7eb] via-[#d1d5db] to-[#9ca3af] relative">
            <div className="absolute inset-[30%_8%_12%_8%] rounded-full bg-gradient-to-br from-[#f9fafb] via-[#e5e7eb] to-[#cbd5e1]"></div>
            <div className="absolute inset-[10%_34%_36%_20%] rounded-full bg-[#9ca3af]"></div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5 relative z-10">
        <h3 className="text-base font-semibold text-[#002C5F]">{car.name}</h3>
        <p className="text-[0.78rem] text-[#6b7280]">{car.category}</p>

        <div className="flex flex-wrap gap-1.5 mt-1">
          <span className="px-2.5 py-1 rounded-full text-[0.68rem] border-[rgba(0,44,95,0.9)] bg-[rgba(0,44,95,0.08)] border text-[#002C5F] inline-flex items-center gap-1.5">
            <FuelIcon className="w-3.5 h-3.5" />
            {fuelLabel}
          </span>
          {/* <span className="px-2.5 py-1 rounded-full text-[0.68rem] bg-[#f3f4f6] border border-[rgba(148,163,184,0.5)] text-[#1c1b1b]">
            {car.category}
          </span> */}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-2 flex items-center justify-between text-[0.78rem] relative z-10">
        <div className="flex flex-col">
          <span className="text-[0.7rem] text-[#6b7280]">DESDE:</span>
          <div className="text-base font-semibold text-[#002C5F]">
            ${car.priceUSD.toLocaleString("en-US")}
          </div>
          <span className="text-[0.7rem] text-[#6b7280]">
            ó S/ {car.pricePEN.toLocaleString("en-US")}
          </span>
        </div>
          <button
            className="relative text-[0.75rem] inline-flex items-center gap-1.5
                      px-0 py-1 font-semibold text-[#002C5F]
                      border-b border-[#002C5F]/70
                      hover:border-b-[2px] hover:border-[#002C5F]
                      hover:text-[#001a3a] transition-all cursor-pointer"
          >
            <span>Cotizar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

      </div>
    </article>
  );
}
