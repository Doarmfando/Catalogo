"use client";

import { Search } from "lucide-react";

interface FiltersSectionProps {
  selectedBrand: string;
  selectedCategory: string;
  selectedFuel: string;
  searchQuery: string;
  onBrandChange: (brand: string) => void;
  onCategoryChange: (category: string) => void;
  onFuelChange: (fuel: string) => void;
  onSearchChange: (query: string) => void;
}

export function FiltersSection({
  selectedBrand,
  selectedCategory,
  selectedFuel,
  searchQuery,
  onBrandChange,
  onCategoryChange,
  onFuelChange,
  onSearchChange,
}: FiltersSectionProps) {
  return (
    <div className="bg-white rounded-[1.1rem] border border-[rgba(0,44,95,0.14)] p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shadow-[0_18px_40px_rgba(0,0,0,0.12)] mb-6">
      {/* Brand Filter */}
      <div className="flex flex-col gap-1 text-[0.78rem] text-[#6b7280]">
        <label htmlFor="filterBrand" className="uppercase tracking-[0.16em] text-[0.68rem] text-[#002C5F]">
          Marca
        </label>
        <select
          id="filterBrand"
          value={selectedBrand}
          onChange={(e) => onBrandChange(e.target.value)}
          className="rounded-full bg-white border border-[rgba(0,44,95,0.3)] text-[#1c1b1b] px-3 py-2 text-[0.78rem] outline-none focus:border-[#002C5F] focus:shadow-[0_0_0_1px_rgba(0,44,95,0.5)] transition-all"
        >
          <option value="all">Todas</option>
          <option value="Hyundai">Hyundai</option>
        </select>
      </div>

      {/* Category Filter */}
      <div className="flex flex-col gap-1 text-[0.78rem] text-[#6b7280]">
        <label htmlFor="filterCategory" className="uppercase tracking-[0.16em] text-[0.68rem] text-[#002C5F]">
          Categoría
        </label>
        <select
          id="filterCategory"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="rounded-full bg-white border border-[rgba(0,44,95,0.3)] text-[#1c1b1b] px-3 py-2 text-[0.78rem] outline-none focus:border-[#002C5F] focus:shadow-[0_0_0_1px_rgba(0,44,95,0.5)] transition-all"
        >
          <option value="Todos">Todas</option>
          <option value="SUV">SUV</option>
          <option value="SEDÁN">Sedán</option>
          <option value="HATCHBACK">Hatchback</option>
          <option value="UTILITARIOS">Utilitarios</option>
          <option value="COMERCIALES">Comerciales</option>
          <option value="ECOLÓGICOS">Ecológicos</option>
        </select>
      </div>

      {/* Fuel Filter */}
      <div className="flex flex-col gap-1 text-[0.78rem] text-[#6b7280]">
        <label htmlFor="filterFuel" className="uppercase tracking-[0.16em] text-[0.68rem] text-[#002C5F]">
          Combustible
        </label>
        <select
          id="filterFuel"
          value={selectedFuel}
          onChange={(e) => onFuelChange(e.target.value)}
          className="rounded-full bg-white border border-[rgba(0,44,95,0.3)] text-[#1c1b1b] px-3 py-2 text-[0.78rem] outline-none focus:border-[#002C5F] focus:shadow-[0_0_0_1px_rgba(0,44,95,0.5)] transition-all"
        >
          <option value="all">Todos</option>
          <option value="GASOLINA">Gasolina</option>
          <option value="DIESEL">Diésel</option>
          <option value="ELÉCTRICO">Híbrido/Eléctrico</option>
        </select>
      </div>

      {/* Search */}
      <div className="flex flex-col gap-1 text-[0.78rem] text-[#6b7280]">
        <label htmlFor="filterSearch" className="uppercase tracking-[0.16em] text-[0.68rem] text-[#002C5F]">
          Buscar modelo
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
          <input
            type="text"
            id="filterSearch"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Ej. Tucson, Creta…"
            className="w-full rounded-full bg-white border border-[rgba(0,44,95,0.3)] text-[#1c1b1b] pl-10 pr-3 py-2 text-[0.78rem] outline-none focus:border-[#002C5F] focus:shadow-[0_0_0_1px_rgba(0,44,95,0.5)] transition-all placeholder:text-[rgba(148,163,184,0.75)]"
          />
        </div>
      </div>
    </div>
  );
}
