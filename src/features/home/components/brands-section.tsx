"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { useRealtimeTable } from "@/hooks/use-realtime-table";

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface BrandsSectionProps {
  brands: Brand[];
}

export function BrandsSection({ brands: initialBrands }: BrandsSectionProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Realtime subscription
  const { data: allBrands } = useRealtimeTable({
    table: 'brands',
    initialData: initialBrands,
    select: '*',
  });

  // Filter only active brands
  const brands = useMemo(() => {
    return allBrands
      .filter(brand => brand.is_active)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }, [allBrands]);

  const handleImageError = (brandId: string) => {
    setImageErrors((prev) => ({ ...prev, [brandId]: true }));
  };

  if (!brands || brands.length === 0) {
    return null;
  }

  return (
    <section className="py-10 scroll-mt-24 lg:scroll-mt-15" id="marcas">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-6">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#002C5F] mb-2">
              Nuestras Marcas
            </h2>
            <p className="text-sm text-[#6b7280] max-w-md">
              Descubre las marcas de vehículos disponibles en nuestro catálogo con los mejores modelos del mercado.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {brands.map((brand) => {
            const hasError = imageErrors[brand.id];
            const logoUrl = brand.logo_url || "";

            return (
              <article
                key={brand.id}
                className="
                  overflow-hidden
                  rounded-[1.1rem]
                  border border-[rgba(0,44,95,0.18)]
                  bg-white
                  shadow-[0_18px_40px_rgba(0,0,0,0.10)]
                  hover:shadow-[0_20px_45px_rgba(0,44,95,0.15)]
                  hover:-translate-y-1
                  transition-all
                  duration-300
                "
              >
                {/* Logo */}
                <div className="relative aspect-square bg-gradient-to-br from-[#f9fafb] to-[#e5e7eb] flex items-center justify-center p-6">
                  {logoUrl && !hasError ? (
                    <Image
                      src={logoUrl}
                      alt={brand.name}
                      fill
                      className="object-contain p-4"
                      sizes="(min-width:1280px) 16vw, (min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
                      onError={() => handleImageError(brand.id)}
                    />
                  ) : (
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[#002C5F]">
                        {brand.name.charAt(0)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Nombre */}
                <div className="p-3 text-center border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-[#002C5F] leading-snug">
                    {brand.name}
                  </h3>
                  {brand.description && (
                    <p className="text-xs text-[#6b7280] mt-1 leading-relaxed">
                      {brand.description}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
