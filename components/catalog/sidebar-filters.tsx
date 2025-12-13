"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FuelType } from "@/types/car";
import { Search } from "lucide-react";

interface SidebarFiltersProps {
  selectedFuelTypes: FuelType[];
  selectedPriceRanges: string[];
  selectedYears: number[];
  searchQuery: string;
  onFuelTypeChange: (fuelTypes: FuelType[]) => void;
  onPriceRangeChange: (ranges: string[]) => void;
  onYearChange: (years: number[]) => void;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
}

const fuelTypes: FuelType[] = ["ELÉCTRICO", "GASOLINA", "DIESEL"];

const priceRanges = [
  { label: "$10,000 a $15,000", value: "10000-15000" },
  { label: "$15,000 a $20,000", value: "15000-20000" },
  { label: "$20,000 a $25,000", value: "20000-25000" },
  { label: "$25,000 a $30,000", value: "25000-30000" },
  { label: "$30,000 a más", value: "30000-999999" },
];

const years = [2024, 2025, 2026];

export function SidebarFilters({
  selectedFuelTypes,
  selectedPriceRanges,
  selectedYears,
  searchQuery,
  onFuelTypeChange,
  onPriceRangeChange,
  onYearChange,
  onSearchChange,
  onClearFilters,
}: SidebarFiltersProps) {
  const handleFuelTypeToggle = (fuelType: FuelType) => {
    const updated = selectedFuelTypes.includes(fuelType)
      ? selectedFuelTypes.filter((f) => f !== fuelType)
      : [...selectedFuelTypes, fuelType];
    onFuelTypeChange(updated);
  };

  const handlePriceRangeToggle = (range: string) => {
    const updated = selectedPriceRanges.includes(range)
      ? selectedPriceRanges.filter((r) => r !== range)
      : [...selectedPriceRanges, range];
    onPriceRangeChange(updated);
  };

  const handleYearToggle = (year: number) => {
    const updated = selectedYears.includes(year)
      ? selectedYears.filter((y) => y !== year)
      : [...selectedYears, year];
    onYearChange(updated);
  };

  return (
    <div className="w-full bg-white rounded-lg border p-6 sticky top-24">
      {/* Search Input */}
      <div className="mb-6">
        <label htmlFor="searchFilter" className="text-lg font-semibold text-[#002C5F] mb-2 block">
          Buscar modelo
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#002C5F]/60" />
          <input
            type="text"
            id="searchFilter"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Ej. Tucson, Creta..."
            className="w-full rounded-lg bg-white border-2 border-[#002C5F]/30 text-[#1c1b1b] pl-10 pr-3 py-2.5 text-sm outline-none focus:border-[#002C5F] focus:ring-2 focus:ring-[#002C5F]/20 transition-all placeholder:text-[#6b7280]/60"
          />
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-6 text-[#002C5F]">Filtros</h2>
      <Accordion type="multiple" defaultValue={["fuel", "price", "year"]} className="w-full">
        <AccordionItem value="fuel" className="border-b border-gray-200">
          <AccordionTrigger className="text-base font-semibold hover:no-underline text-[#002C5F] py-4">
            Tipo de combustible
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {fuelTypes.map((fuelType) => (
                <div key={fuelType} className="flex items-center space-x-2">
                  <Checkbox
                    id={`fuel-${fuelType}`}
                    checked={selectedFuelTypes.includes(fuelType)}
                    onCheckedChange={() => handleFuelTypeToggle(fuelType)}
                  />
                  <Label
                    htmlFor={`fuel-${fuelType}`}
                    className="text-sm font-medium cursor-pointer text-[#1c1b1b]"
                  >
                    {fuelType}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price" className="border-b border-gray-200">
          <AccordionTrigger className="text-base font-semibold hover:no-underline text-[#002C5F] py-4">
            Rango de precios
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {priceRanges.map((range) => (
                <div key={range.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`price-${range.value}`}
                    checked={selectedPriceRanges.includes(range.value)}
                    onCheckedChange={() => handlePriceRangeToggle(range.value)}
                  />
                  <Label
                    htmlFor={`price-${range.value}`}
                    className="text-sm font-medium cursor-pointer text-[#1c1b1b]"
                  >
                    {range.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="year" className="border-b-0">
          <AccordionTrigger className="text-base font-semibold hover:no-underline text-[#002C5F] py-4">
            Año
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {years.map((year) => (
                <div key={year} className="flex items-center space-x-2">
                  <Checkbox
                    id={`year-${year}`}
                    checked={selectedYears.includes(year)}
                    onCheckedChange={() => handleYearToggle(year)}
                  />
                  <Label
                    htmlFor={`year-${year}`}
                    className="text-sm font-medium cursor-pointer text-[#1c1b1b]"
                  >
                    {year}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <button
        className="w-full mt-6 text-sm text-gray-600 hover:text-[#002C5F] underline transition-colors"
        onClick={onClearFilters}
      >
        Limpiar filtros
      </button>
    </div>
  );
}