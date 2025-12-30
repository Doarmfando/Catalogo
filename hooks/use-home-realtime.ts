"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  getActiveCarsClient,
  getActiveBrandsClient,
  getActiveCategoriesClient,
  getActiveFuelTypesClient
} from "@/lib/supabase/queries/client-queries";
import { adaptSupabaseCars } from "@/lib/supabase/adapters/cars";
import type { Car } from "@/shared/types/car";
import type { Brand } from "@/shared/types";

interface UseHomeRealtimeProps {
  initialCars: Car[];
  initialBrands: Brand[];
  initialCategories: any[];
  initialFuelTypes: any[];
}

export function useHomeRealtime({
  initialCars,
  initialBrands,
  initialCategories,
  initialFuelTypes,
}: UseHomeRealtimeProps) {
  const [cars, setCars] = useState<Car[]>(initialCars);
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [categories, setCategories] = useState<any[]>(initialCategories);
  const [fuelTypes, setFuelTypes] = useState<any[]>(initialFuelTypes);

  useEffect(() => {
    const supabase = createClient();

    // Subscribe to cars table changes
    const carsChannel = supabase
      .channel("home-cars-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cars",
        },
        async () => {
          console.log("Cars table changed, refetching...");
          const supabaseCars = await getActiveCarsClient();
          const adaptedCars = adaptSupabaseCars(supabaseCars);
          setCars(adaptedCars);
        }
      )
      .subscribe();

    // Subscribe to brands table changes
    const brandsChannel = supabase
      .channel("home-brands-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "brands",
        },
        async () => {
          console.log("Brands table changed, refetching...");
          const newBrands = await getActiveBrandsClient();
          setBrands(newBrands);
          // Also refetch cars since they reference brands
          const supabaseCars = await getActiveCarsClient();
          const adaptedCars = adaptSupabaseCars(supabaseCars);
          setCars(adaptedCars);
        }
      )
      .subscribe();

    // Subscribe to categories table changes
    const categoriesChannel = supabase
      .channel("home-categories-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "categories",
        },
        async () => {
          console.log("Categories table changed, refetching...");
          const newCategories = await getActiveCategoriesClient();
          setCategories(newCategories);
          // Also refetch cars since they reference categories
          const supabaseCars = await getActiveCarsClient();
          const adaptedCars = adaptSupabaseCars(supabaseCars);
          setCars(adaptedCars);
        }
      )
      .subscribe();

    // Subscribe to fuel_types table changes
    const fuelTypesChannel = supabase
      .channel("home-fuel-types-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "fuel_types",
        },
        async () => {
          console.log("Fuel types table changed, refetching...");
          const newFuelTypes = await getActiveFuelTypesClient();
          setFuelTypes(newFuelTypes);
          // Also refetch cars since they reference fuel types
          const supabaseCars = await getActiveCarsClient();
          const adaptedCars = adaptSupabaseCars(supabaseCars);
          setCars(adaptedCars);
        }
      )
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeChannel(carsChannel);
      supabase.removeChannel(brandsChannel);
      supabase.removeChannel(categoriesChannel);
      supabase.removeChannel(fuelTypesChannel);
    };
  }, []);

  return {
    cars,
    brands,
    categories,
    fuelTypes,
  };
}
