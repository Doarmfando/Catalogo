"use client";

import { Search, Filter } from "lucide-react";
import { useState } from "react";

export function CarsSearchFilter() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <div className="flex flex-1 gap-3 max-w-3xl">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre o modelo..."
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
        <option value="Hyundai">Hyundai</option>
        <option value="JMC">JMC</option>
      </select>

      {/* Category Filter */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none bg-white min-w-[150px]"
      >
        <option value="">Todas las categorías</option>
        <option value="ECOLÓGICOS">Ecológicos</option>
        <option value="HATCHBACK">Hatchback</option>
        <option value="SEDÁN">Sedán</option>
        <option value="SUV">SUV</option>
        <option value="UTILITARIOS">Utilitarios</option>
        <option value="COMERCIALES">Comerciales</option>
      </select>
    </div>
  );
}
