"use client";

import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2, Eye, Palette } from "lucide-react";

// Mock data
const mockCars = [
  {
    id: "1",
    name: "PALISADE Hybrid",
    brand: "Hyundai",
    year: 2026,
    category: "SUV",
    fuelType: "ELÉCTRICO",
    priceUSD: 54990,
    image: "/images/PALISADE_HYB-2026.png",
  },
  {
    id: "4",
    name: "Grand i10 Hatch",
    brand: "Hyundai",
    year: 2026,
    category: "HATCHBACK",
    fuelType: "GASOLINA",
    priceUSD: 10890,
    image: "/images/GRANDI10_HTC-2026.png",
  },
  {
    id: "9",
    name: "VENUE",
    brand: "Hyundai",
    year: 2026,
    category: "SUV",
    fuelType: "GASOLINA",
    priceUSD: 17490,
    image: "/images/VENUE-2026.png",
  },
];

export function CarsTable() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Imagen
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Marca
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Año
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockCars.map((car) => (
              <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="h-16 w-24 relative rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={car.image}
                      alt={car.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-900">{car.name}</div>
                  <div className="text-xs text-gray-500">{car.fuelType}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900">{car.brand}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900">{car.year}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {car.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-gray-900">
                    ${car.priceUSD.toLocaleString("en-US")}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/modelos/${car.id}`}
                      target="_blank"
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Ver en sitio público"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/admin/autos/${car.id}/versiones`}
                      className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Gestionar Versiones"
                    >
                      <Palette className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/admin/autos/${car.id}/editar`}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Mostrando <span className="font-semibold">1</span> a{" "}
          <span className="font-semibold">3</span> de{" "}
          <span className="font-semibold">3</span> resultados
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
            Anterior
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
