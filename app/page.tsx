"use client";

import { Navbar } from "@/shared/components/layout/navbar";
import { Footer } from "@/shared/components/layout/footer";
import { HeroSection } from "@/features/home/components/hero-section";
import { BrandsSection } from "@/features/home/components/brands-section";
import { ContactSection } from "@/features/home/components/contact-section";
import { VehicleCardNew } from "@/features/catalog/components/vehicle-card-new";
import { TopTabs } from "@/features/catalog/components/top-tabs";
import { SidebarFilters } from "@/features/catalog/components/sidebar-filters";
import { CategoryHeader } from "@/features/catalog/components/category-header";
import { cars } from "@/features/catalog/data";
import { useCatalogFilters } from "@/features/catalog/hooks";
import { BrandFilterBar } from "@/features/catalog/components/brand-filter-bar";
import { BRAND_ORDER, getBrandMeta } from "@/features/catalog/brands";
import Image from "next/image";
import { Badge } from "@/shared/components/ui/badge";
import { useMemo } from "react";


export default function HomePage() {
const {
  filteredCars,
  brands, // ✅ AÑADE ESTO
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

const groupedByBrand = useMemo(() => {
  const map = new Map<string, typeof filteredCars>();
  for (const c of filteredCars) {
    const b = c.brand;
    if (!map.has(b)) map.set(b, []);
    map.get(b)!.push(c);
  }

  const order = [
    ...BRAND_ORDER.filter((b) => map.has(b)),
    ...Array.from(map.keys()).filter((b) => !BRAND_ORDER.includes(b)),
  ];

  return order.map((b) => ({ brand: b, cars: map.get(b)! }));
}, [filteredCars]);

  return (
    <div className="min-h-screen bg-[#f6f3f2]">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Catalog Section */}
        <section className="py-10 scroll-mt-24 lg:scroll-mt-10" id="modelos">
          <div className="container-custom">
            {/* Tabs */}
            <div className="mb-8">
              <TopTabs
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>

            {/* Category Header */}
            <CategoryHeader category={selectedCategory} />
            <div className="mb-6">
              <BrandFilterBar
                brands={brands}
                selectedBrands={selectedBrands}
                onChange={setSelectedBrands}
                brandCounts={brandCounts}
              />
            </div>

            {/* Content Grid with Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Filters */}
              <aside className="lg:col-span-1">
                <SidebarFilters
                  brands={brands}
                  selectedBrands={selectedBrands}
                  onBrandChange={setSelectedBrands}

                  selectedFuelTypes={selectedFuelTypes}
                  selectedPriceRanges={selectedPriceRanges}
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
                  <div className="text-center py-16 px-6 rounded-[1.1rem] bg-white border border-dashed border-[rgba(148,163,184,0.5)] text-[#6b7280] text-sm">
                    No se encontraron vehículos con los filtros seleccionados.
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-[#6b7280] mb-6">
                      Mostrando {filteredCars.length}{" "}
                      {filteredCars.length === 1 ? "vehículo" : "vehículos"}
                    </p>
<div className="space-y-10">
  {groupedByBrand.map(({ brand, cars }) => {
    const meta = getBrandMeta(brand);

    return (
      <section key={brand} className="space-y-4">
        {/* Header de Marca */}
        <div className="flex items-center gap-3">
          <div className="h-8 flex items-center">
            <Image
              src={meta.logo}
              alt={meta.label}
              width={120}
              height={32}
              className="h-7 w-auto object-contain"
            />
          </div>

          <h3 className="text-lg font-semibold text-[#002C5F]">
            {meta.label}
          </h3>

          <Badge
            variant="outline"
            className="bg-[#002C5F]/10 text-[#002C5F] border border-[#002C5F]/15"
          >
            {cars.length}
          </Badge>

          <div className="flex-1 h-px bg-[rgba(0,44,95,0.12)]" />
        </div>

        {/* Grid de vehículos de esa marca */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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

        {/* Brands & Services Section */}
        {/* <BrandsSection /> */}

        {/* Contact Section */}
        {/* <ContactSection /> */}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
