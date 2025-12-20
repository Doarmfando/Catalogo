"use client";

import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

// Mock data
const mockBrands = [
  {
    id: "1",
    name: "Hyundai",
    logo: "/images/brands/logo_hyundai.png",
    totalCars: 24,
  },
  {
    id: "2",
    name: "JMC",
    logo: "/images/brands/logo_jmc.png",
    totalCars: 4,
  },
];

export function BrandsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {mockBrands.map((brand) => (
        <div
          key={brand.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          {/* Logo */}
          <div className="h-24 flex items-center justify-center mb-4 bg-gray-50 rounded-lg">
            <div className="relative h-16 w-full">
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Info */}
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{brand.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {brand.totalCars} {brand.totalCars === 1 ? "auto" : "autos"}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Link
              href={`/admin/marcas/${brand.id}/editar`}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Pencil className="h-4 w-4" />
              Editar
            </Link>
            <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
