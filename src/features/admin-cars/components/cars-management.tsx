// src/features/admin-cars/components/cars-management.tsx
"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { CarsTable } from "./cars-table";
import { CarsSearchFilter, type FilterState } from "./cars-search-filter";
import type { Car } from "@/shared/types/car";
import { useRealtimeTable } from "@/hooks/use-realtime-table";
import { adaptSupabaseCar } from "@/lib/supabase/adapters/cars";

interface CarsManagementProps {
  initialCars: Car[];
}

export function CarsManagement({ initialCars }: CarsManagementProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    brand: "",
    category: "",
  });

  // Realtime subscription for cars
  // IMPORTANTE: El select debe coincidir con el usado en getAllCarsAdmin
  const { data: cars } = useRealtimeTable({
    table: 'cars',
    initialData: initialCars,
    select: `
      *,
      brands (
        id,
        name,
        slug
      ),
      categories (
        id,
        name,
        slug
      ),
      fuel_types (
        id,
        name,
        slug
      )
    `,
    adapter: adaptSupabaseCar, // Transformar datos de Supabase al formato Car
  });

  // Extract unique brands and categories from cars
  const { brands, categories } = useMemo(() => {
    const brandsSet = new Set<string>();
    const categoriesSet = new Set<string>();

    cars.forEach((car) => {
      if (car.brand) brandsSet.add(car.brand);
      if (car.category) categoriesSet.add(car.category);
    });

    return {
      brands: Array.from(brandsSet).sort(),
      categories: Array.from(categoriesSet).sort(),
    };
  }, [cars]);

  // Filter cars based on current filters
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      // Search filter (searches in name, brand, and fuel type)
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch =
          car.name?.toLowerCase().includes(searchLower) ||
          car.brand?.toLowerCase().includes(searchLower) ||
          car.fuelType?.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;
      }

      // Brand filter
      if (filters.brand && car.brand !== filters.brand) {
        return false;
      }

      // Category filter
      if (filters.category && car.category !== filters.category) {
        return false;
      }

      return true;
    });
  }, [cars, filters]);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  return (
    <>
      {/* Header with filters and action button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <CarsSearchFilter 
          onFilterChange={handleFilterChange}
          brands={brands}
          categories={categories}
        />
        <Link
          href="/admin/autos/nuevo"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#002C5F] text-white rounded-lg hover:bg-[#0957a5] transition-colors font-medium whitespace-nowrap"
        >
          <Plus className="h-5 w-5" />
          Nuevo Auto
        </Link>
      </div>

      {/* Table with filtered cars */}
      <CarsTable cars={filteredCars} />
      
      {/* Show filter status */}
      {(filters.searchTerm || filters.brand || filters.category) && (
        <div className="mt-4 text-sm text-gray-600">
          Mostrando {filteredCars.length} de {cars.length} autos
          {filters.searchTerm && (
            <span className="ml-2">
              • Búsqueda: "{filters.searchTerm}"
            </span>
          )}
          {filters.brand && (
            <span className="ml-2">
              • Marca: {filters.brand}
            </span>
          )}
          {filters.category && (
            <span className="ml-2">
              • Categoría: {filters.category}
            </span>
          )}
        </div>
      )}
    </>
  );
}