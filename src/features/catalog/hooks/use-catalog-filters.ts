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
  }, [cars, selectedCategory, selectedFuelTypes, selectedPriceRanges, selectedYears, searchQuery]);

  const handleClearFilters = () => {
    setSelectedFuelTypes([]);
    setSelectedPriceRanges([]);
    setSelectedYears([]);
    setSearchQuery("");
  };

  return {
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
  };
}
