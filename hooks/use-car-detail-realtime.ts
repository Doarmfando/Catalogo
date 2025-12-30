"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Car } from "@/shared/types/car";

/**
 * Hook para actualizar en tiempo real los detalles de un auto específico
 */
export function useCarDetailRealtime(initialCar: Car, carId: string) {
  const [car, setCar] = useState<Car>(initialCar);

  useEffect(() => {
    const supabase = createClient();

    // Subscribe to changes in the specific car
    const carChannel = supabase
      .channel(`car-detail-${carId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cars",
          filter: `id=eq.${carId}`,
        },
        async () => {
          console.log(`Car ${carId} changed, refetching...`);
          // Refetch the full car data
          const { getCarByIdClient } = await import("@/lib/supabase/queries/client-queries");
          const { adaptSupabaseCar } = await import("@/lib/supabase/adapters/cars");

          const supabaseCar = await getCarByIdClient(carId);
          if (supabaseCar) {
            const updatedCar = adaptSupabaseCar(supabaseCar);
            setCar(updatedCar);
          }
        }
      )
      .subscribe();

    // Subscribe to versions table changes
    const versionsChannel = supabase
      .channel(`car-versions-${carId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "versions",
          filter: `car_id=eq.${carId}`,
        },
        async () => {
          console.log(`Versions for car ${carId} changed, refetching...`);
          const { getCarByIdClient } = await import("@/lib/supabase/queries/client-queries");
          const { adaptSupabaseCar } = await import("@/lib/supabase/adapters/cars");

          const supabaseCar = await getCarByIdClient(carId);
          if (supabaseCar) {
            const updatedCar = adaptSupabaseCar(supabaseCar);
            setCar(updatedCar);
          }
        }
      )
      .subscribe();

    // Subscribe to version_colors table changes (affects color assignments)
    const versionColorsChannel = supabase
      .channel(`car-version-colors-${carId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "version_colors",
        },
        async () => {
          console.log(`Version colors changed, refetching car ${carId}...`);
          const { getCarByIdClient } = await import("@/lib/supabase/queries/client-queries");
          const { adaptSupabaseCar } = await import("@/lib/supabase/adapters/cars");

          const supabaseCar = await getCarByIdClient(carId);
          if (supabaseCar) {
            const updatedCar = adaptSupabaseCar(supabaseCar);
            setCar(updatedCar);
          }
        }
      )
      .subscribe();

    // Subscribe to color_images table changes (affects gallery images)
    const colorImagesChannel = supabase
      .channel(`car-color-images-${carId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "color_images",
        },
        async () => {
          console.log(`Color images changed, refetching car ${carId}...`);
          const { getCarByIdClient } = await import("@/lib/supabase/queries/client-queries");
          const { adaptSupabaseCar } = await import("@/lib/supabase/adapters/cars");

          const supabaseCar = await getCarByIdClient(carId);
          if (supabaseCar) {
            const updatedCar = adaptSupabaseCar(supabaseCar);
            setCar(updatedCar);
          }
        }
      )
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeChannel(carChannel);
      supabase.removeChannel(versionsChannel);
      supabase.removeChannel(versionColorsChannel);
      supabase.removeChannel(colorImagesChannel);
    };
  }, [carId]);

  return car;
}
