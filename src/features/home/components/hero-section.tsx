import { getActiveHeroBanners } from "@/lib/supabase/queries";
import { adaptSupabaseHeroBanners } from "@/lib/supabase/adapters/banners";
import { HeroSectionClient } from "./hero-section-client";

export async function HeroSection() {
  // Fetch banners from Supabase
  const supabaseBanners = await getActiveHeroBanners();
  const banners = adaptSupabaseHeroBanners(supabaseBanners);

  return <HeroSectionClient banners={banners} />;
}
