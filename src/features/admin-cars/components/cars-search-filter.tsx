// src/features/admin-cars/components/cars-search-filter.tsx
"use client";

import { Search } from "lucide-react";
import { useState, useEffect } from "react";

export interface FilterState {
  searchTerm: string;
  brand: string;
  category: string;
}

interface CarsSearchFilterProps {
  onFilterChange: (filters: FilterState) => void;
  brands?: string[]; // Dynamic brands from actual data
  categories?: string[]; // Dynamic categories from actual data
}

export function CarsSearchFilter({ 
  onFilterChange, 
  brands = [], 
  categories = [] 
}: CarsSearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Notify parent component when filters change
  useEffect(() => {
    onFilterChange({
      searchTerm,
      brand: selectedBrand,
      category: selectedCategory,
    });
  }, [searchTerm, selectedBrand, selectedCategory, onFilterChange]);

  return (
    <div className="flex flex-1 gap-3 max-w-3xl">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre, modelo o marca..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none"
        />
      </div>

      {/* Brand Filter */}
      <select
        value={selectedBrand}
        onChange={(e) => setSelectedBrand(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none bg-white min-w-[150px]"
      >
        <option value="">Todas las marcas</option>
        {brands.map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>

      {/* Category Filter */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none bg-white min-w-[150px]"
      >
        <option value="">Todas las categorías</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}