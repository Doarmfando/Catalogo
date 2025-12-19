export const BRAND_ORDER: string[] = ["Hyundai", "JMC", "Nissan", "Toyota"];

export const BRAND_META: Record<string, { label: string; logo: string }> = {
  Hyundai: { label: "Hyundai", logo: "/images/brands/logo_hyundai.png" },
  JMC: { label: "JMC", logo: "/images/brands/logo_jmc.png" },
};

export function getBrandMeta(brand: string) {
  return (
    BRAND_META[brand] ?? {
      label: brand,
      logo: "/images/brands/default.png",
    }
  );
}
