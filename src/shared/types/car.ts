export type CarBrand = "Hyundai" | "JMC" | "RAM"; // etc
export type FuelType = "ELÉCTRICO" | "GASOLINA" | "DIESEL";
export type CarCategory = "Todos" | "ECOLÓGICOS" | "HATCHBACK" | "SEDÁN" | "SUV" | "UTILITARIOS" | "COMERCIALES" | "PICK-UP";
export type CarColor = {
  id: string;
  name: string;
  hex?: string;
  images: string[];
};

export type CarVersion = {
  id: string;
  name: string;
  shortDescription?: string;
  priceUSD?: number;
  pricePEN?: number;
  highlights?: string[];
  colors?: CarColor[]; // ✅ ahora sí
};

export interface Car {
  id: string;
  brand: CarBrand; // ✅ NUEVO (Marca)

  name: string;
  year: number;
  category: CarCategory;
  fuelType: FuelType;
  priceUSD: number;
  pricePEN: number;
  image: string;
  imageFrontal?: string;
  
  versions?: CarVersion[]; // 👈 aquí
}

export interface FilterState {
  category: CarCategory;
  fuelTypes: FuelType[];
  priceRanges: string[];
  years: number[];
  brands: string[]; // ✅ NUEVO (marcas seleccionadas)

}
