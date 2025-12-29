"use client";

import Image from "next/image";
import { BRAND_ORDER, getBrandMeta } from "@/features/catalog/brands";

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
}

type Props = {
  brands: string[];
  selectedBrands: string[];
  onChange: (next: string[]) => void;
  brandCounts?: Record<string, number>;
};

export function BrandFilterBar({
  brands,
  selectedBrands,
  onChange,
  brandCounts = {},
}: Props) {
  const ordered = [
    ...BRAND_ORDER.filter((b) => brands.includes(b)),
    ...brands.filter((b) => !BRAND_ORDER.includes(b)),
  ];

  const hasSelection = selectedBrands.length > 0;

  return (
    <div className="w-full">
      {/* Header minimal (sin panel) */}
      <div className="flex items-end justify-between gap-3 mb-3">


        {hasSelection && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-xs font-semibold text-[#002C5F] hover:underline"
          >
            Ver todas
          </button>
        )}
      </div>

      {/* Logos grandes, sin background */}
      <div className="flex flex-wrap gap-3">
        {ordered.map((brand) => {
          const meta = getBrandMeta(brand);
          const active = selectedBrands.includes(brand);
          const count = brandCounts[brand] ?? 0;

          return (
            <button
              key={brand}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(toggle(selectedBrands, brand))}
              className={[
                "group relative rounded-2xl px-5 py-4 min-w-[140px] sm:min-w-[170px]",
                "border border-[rgba(0,44,95,0.14)] bg-transparent",
                "transition hover:bg-white/60 hover:shadow-[0_10px_25px_rgba(0,0,0,0.06)]",
                active
                  ? "border-[#002C5F] ring-2 ring-[#002C5F]/15 bg-white"
                  : "",
              ].join(" ")}
            >
              {/* contador flotante */}
              <span
                className={[
                  "absolute top-2 right-2 text-[11px] font-bold",
                  "px-2 py-0.5 rounded-full border",
                  active
                    ? "bg-[#002C5F] text-white border-[#002C5F]"
                    : "bg-white text-[#002C5F] border-[#002C5F]/20",
                ].join(" ")}
              >
                {count}
              </span>

              {/* Logo grande */}
              <div className="flex items-center justify-center h-12">
                <Image
                  src={meta.logo}
                  alt={meta.label}
                  width={170}
                  height={52}
                  className={[
                    "h-20 w-auto object-contain transition",
                    active
                      ? "opacity-100 grayscale-0"
                      : "opacity-70 grayscale group-hover:opacity-100 group-hover:grayscale-0",
                  ].join(" ")}
                />
              </div>

              {/* underline activo */}
              {active && (
                <div className="absolute left-5 right-5 -bottom-[1px] h-[2px] bg-[#002C5F] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
