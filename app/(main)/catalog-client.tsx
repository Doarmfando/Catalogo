"use client";

import { VehicleCardNew } from "@/features/catalog/components/vehicle-card-new";
import { TopTabs } from "@/features/catalog/components/top-tabs";
import { SidebarFilters } from "@/features/catalog/components/sidebar-filters";
import { CategoryHeader } from "@/features/catalog/components/category-header";
import { useCatalogFilters } from "@/features/catalog/hooks";
import { BrandFilterBar } from "@/features/catalog/components/brand-filter-bar";
import { useHomeRealtime } from "@/hooks/use-home-realtime";
import Image from "next/image";
import { Badge } from "@/shared/components/ui/badge";
import { useMemo } from "react";
import type { Car } from "@/shared/types/car";
import type { Brand } from "@/shared/types/brand";

interface CatalogClientProps {
  cars: Car[];
  brands: Brand[];
  categories: any[];
  fuelTypes: any[];
}

export function CatalogClient({
  cars: initialCars,
  brands: initialBrands,
  categories: initialCategories,
  fuelTypes: initialFuelTypes
}: CatalogClientProps) {
  // Use Realtime hook to get live data
  const { cars, brands, categories, fuelTypes } = useHomeRealtime({
    initialCars,
    initialBrands,
    initialCategories,
    initialFuelTypes,
  });
  const {
    filteredCars,
    brands: brandNames,
    brandCounts,
    filters: {
      selectedBrands,
      selectedCategory,
      selectedFuelTypes,
      selectedPriceRanges,
      selectedYears,
      searchQuery,
    },
    setters: {
      setSelectedBrands,
      setSelectedCategory,
      setSelectedFuelTypes,
      setSelectedPriceRanges,
      setSelectedYears,
      setSearchQuery,
    },
    handleClearFilters,
  } = useCatalogFilters(cars);

  // Crear mapa de marcas por nombre para búsqueda rápida
  const brandMap = useMemo(() => {
    const map = new Map<string, Brand>();
    for (const brand of brands) {
      map.set(brand.name, brand);
    }
    return map;
  }, [brands]);

  // Extract available years from cars
  const availableYears = useMemo(() => {
    const yearsSet = new Set(cars.map((c) => c.year));
    return Array.from(yearsSet).sort((a, b) => b - a); // Descending order
  }, [cars]);

  const groupedByBrand = useMemo(() => {
    const map = new Map<string, typeof filteredCars>();
    for (const c of filteredCars) {
      const b = c.brand;
      if (!map.has(b)) map.set(b, []);
      map.get(b)!.push(c);
    }

    // Las marcas ya vienen ordenadas por created_at desde la BD
    const brandOrder = brands.map(b => b.name);

    const order = [
      ...brandOrder.filter((b) => map.has(b)),
      ...Array.from(map.keys()).filter((b) => !brandOrder.includes(b)),
    ];

    return order.map((b) => ({ brand: b, cars: map.get(b)! }));
  }, [filteredCars, brands]);

  return (
    <section className="py-8 lg:py-10 scroll-mt-24 lg:scroll-mt-10" id="modelos">
      <div className="container-custom">
        {/* Tabs */}
        <div className="mb-6 lg:mb-8">
          <TopTabs
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Category Header */}
        <CategoryHeader category={selectedCategory} categories={categories} />
        <div className="mb-4 lg:mb-6">
          <BrandFilterBar
            brands={brands}
            brandNames={brandNames}
            selectedBrands={selectedBrands}
            onChange={setSelectedBrands}
            brandCounts={brandCounts}
          />
        </div>

        {/* Content Grid with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <SidebarFilters
              brands={brandNames}
              selectedBrands={selectedBrands}
              onBrandChange={setSelectedBrands}
              fuelTypes={fuelTypes}
              selectedFuelTypes={selectedFuelTypes}
              selectedPriceRanges={selectedPriceRanges}
              years={availableYears}
              selectedYears={selectedYears}
              searchQuery={searchQuery}
              onFuelTypeChange={setSelectedFuelTypes}
              onPriceRangeChange={setSelectedPriceRanges}
              onYearChange={setSelectedYears}
              onSearchChange={setSearchQuery}
              onClearFilters={handleClearFilters}
            />
          </aside>

          {/* Vehicle Grid */}
          <div className="lg:col-span-3">
            {filteredCars.length === 0 ? (
              <div className="text-center py-12 lg:py-16 px-4 lg:px-6 rounded-[1.1rem] bg-white border border-dashed border-[rgba(148,163,184,0.5)] text-[#6b7280] text-sm">
                No se encontraron vehículos con los filtros seleccionados.
              </div>
            ) : (
              <>
                <p className="text-sm text-[#6b7280] mb-4 lg:mb-6">
                  Mostrando {filteredCars.length}{" "}
                  {filteredCars.length === 1 ? "vehículo" : "vehículos"}
                </p>
                <div className="space-y-8 lg:space-y-10">
                  {groupedByBrand.map(({ brand, cars }) => {
                    const brandData = brandMap.get(brand);
                    const logoUrl = brandData?.logo_url || "/images/brands/default.png";

                    return (
                      <section key={brand} className="space-y-3 lg:space-y-4">
                        {/* Header de Marca */}
                        <div className="flex items-center gap-2 lg:gap-3">
                          <div className="h-6 lg:h-8 flex items-center">
                            <Image
                              src={logoUrl}
                              alt={brand}
                              width={120}
                              height={32}
                              className="h-5 lg:h-7 w-auto object-contain"
                            />
                          </div>

                          <h3 className="text-base lg:text-lg font-semibold text-[#002C5F]">
                            {brand}
                          </h3>

                          <Badge
                            variant="outline"
                            className="bg-[#002C5F]/10 text-[#002C5F] border border-[#002C5F]/15 text-xs"
                          >
                            {cars.length}
                          </Badge>

                          <div className="flex-1 h-px bg-[rgba(0,44,95,0.12)]" />
                        </div>

                        {/* Grid de vehículos de esa marca */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
                          {cars.map((car) => (
                            <VehicleCardNew key={car.id} car={car} />
                          ))}
                        </div>
                      </section>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
