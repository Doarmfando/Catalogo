"use client";

import { useState, useMemo } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { BrandsSection } from "@/components/sections/brands-section";
import { ContactSection } from "@/components/sections/contact-section";
import { VehicleCardNew } from "@/components/catalog/vehicle-card-new";
import { TopTabs } from "@/components/catalog/top-tabs";
import { SidebarFilters } from "@/components/catalog/sidebar-filters";
import { CategoryHeader } from "@/components/catalog/category-header";
import { cars } from "@/data/cars";
import { CarCategory, FuelType } from "@/types/car";

export default function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<CarCategory>("Todos");
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<FuelType[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      // Filter by search query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesName = car.name.toLowerCase().includes(query);
        if (!matchesName) {
          return false;
        }
      }

      // Filter by category
      if (selectedCategory !== "Todos") {
        if (selectedCategory === "ECOLÓGICOS" && car.fuelType !== "ELÉCTRICO") {
          return false;
        } else if (selectedCategory !== "ECOLÓGICOS" && car.category !== selectedCategory) {
          return false;
        }
      }

      // Filter by fuel type
      if (selectedFuelTypes.length > 0 && !selectedFuelTypes.includes(car.fuelType)) {
        return false;
      }

      // Filter by price range
      if (selectedPriceRanges.length > 0) {
        const inRange = selectedPriceRanges.some((range) => {
          const [min, max] = range.split("-").map(Number);
          return car.priceUSD >= min && car.priceUSD <= max;
        });
        if (!inRange) return false;
      }

      // Filter by year
      if (selectedYears.length > 0 && !selectedYears.includes(car.year)) {
        return false;
      }

      return true;
    });
  }, [selectedCategory, selectedFuelTypes, selectedPriceRanges, selectedYears, searchQuery]);

  const handleClearFilters = () => {
    setSelectedFuelTypes([]);
    setSelectedPriceRanges([]);
    setSelectedYears([]);
    setSearchQuery("");
  };

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
