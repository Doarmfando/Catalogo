import { HeroSection } from "@/features/home/components/hero-section";
import { BrandsSection } from "@/features/home/components/brands-section";
import { getActiveCars, getActiveBrands } from "@/lib/supabase/queries";
import { adaptSupabaseCars } from "@/lib/supabase/adapters/cars";
import { CatalogClient } from "./catalog-client";

export default async function HomePage() {
  // Fetch cars from Supabase
  const supabaseCars = await getActiveCars();
  const cars = adaptSupabaseCars(supabaseCars);

  // Fetch brands from Supabase
  const brands = await getActiveBrands();

  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Catalog Section */}
      <CatalogClient cars={cars} />

      {/* Brands Section */}
      <BrandsSection brands={brands} />

      {/* Contact Section */}
      {/* <ContactSection /> */}
    </>
  );
}
