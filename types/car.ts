export type FuelType = "ELÉCTRICO" | "GASOLINA" | "DIESEL";
export type CarCategory = "Todos" | "ECOLÓGICOS" | "HATCHBACK" | "SEDÁN" | "SUV" | "UTILITARIOS" | "COMERCIALES";

export interface Car {
  id: string;
  name: string;
  year: number;
  category: CarCategory;
  fuelType: FuelType;
  priceUSD: number;
  pricePEN: number;
  image: string;
  imageFrontal?: string;
}

export interface FilterState {
  category: CarCategory;
  fuelTypes: FuelType[];
  priceRanges: string[];
  years: number[];
}
