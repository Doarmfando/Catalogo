import { useState, useMemo } from "react";
import { Car, CarCategory, FuelType } from "@/shared/types/car";

export interface CatalogFilters {
  selectedCategory: CarCategory;
  selectedFuelTypes: FuelType[];
  selectedPriceRanges: string[];
  selectedYears: number[];
  searchQuery: string;
}

export function useCatalogFilters(cars: Car[]) {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CarCategory>("Todos");
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<FuelType[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const brands = useMemo(() => {
    return Array.from(new Set(cars.map((c) => c.brand).filter(Boolean))).sort();
  }, [cars]);

  const filteredCarsNoBrand = useMemo(() => {
    return cars.filter((car) => {
      // Search
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesName = car.name.toLowerCase().includes(query);
        if (!matchesName) return false;
      }

      // Category
      if (selectedCategory !== "Todos") {
        if (selectedCategory === "ECOLÓGICOS" && car.fuelType !== "ELÉCTRICO") return false;
        if (selectedCategory !== "ECOLÓGICOS" && car.category !== selectedCategory) return false;
      }

      // Fuel
      if (selectedFuelTypes.length > 0 && !selectedFuelTypes.includes(car.fuelType)) return false;

      // Price
      if (selectedPriceRanges.length > 0) {
        const inRange = selectedPriceRanges.some((range) => {
          const [min, max] = range.split("-").map(Number);
          return car.priceUSD >= min && car.priceUSD <= max;
        });
        if (!inRange) return false;
      }

      // Year
      if (selectedYears.length > 0 && !selectedYears.includes(car.year)) return false;

      return true;
    });
  }, [cars, selectedCategory, selectedFuelTypes, selectedPriceRanges, selectedYears, searchQuery]);

  const brandCounts = useMemo(() => {
    const out: Record<string, number> = {};
    for (const car of filteredCarsNoBrand) {
      out[car.brand] = (out[car.brand] ?? 0) + 1;
    }
    return out;
  }, [filteredCarsNoBrand]);

  const filteredCars = useMemo(() => {
    if (selectedBrands.length === 0) return filteredCarsNoBrand;
    return filteredCarsNoBrand.filter((car) => selectedBrands.includes(car.brand));
  }, [filteredCarsNoBrand, selectedBrands]);


  const handleClearFilters = () => {
    setSelectedBrands([]);
    setSelectedFuelTypes([]);
    setSelectedPriceRanges([]);
    setSelectedYears([]);
    setSearchQuery("");
  };

  return {
    filteredCars,
    brands, // 👈 lista lista para el UI
    brandCounts, // ✅ NUEVO

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
  };
}
