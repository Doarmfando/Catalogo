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

export default function HomePage() {
  const {
    filteredCars,
    filters: {
      selectedCategory,
      selectedFuelTypes,
      selectedPriceRanges,
      selectedYears,
      searchQuery,
    },
    setters: {
      setSelectedCategory,
      setSelectedFuelTypes,
      setSelectedPriceRanges,
      setSelectedYears,
      setSearchQuery,
    },
    handleClearFilters,
  } = useCatalogFilters(cars);

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

            {/* Content Grid with Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Filters */}
              <aside className="lg:col-span-1">
                <SidebarFilters
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
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {filteredCars.map((car) => (
                        <VehicleCardNew key={car.id} car={car} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Brands & Services Section */}
        <BrandsSection />

        {/* Contact Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
