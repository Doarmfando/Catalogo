import { AdminTopbar } from "@/features/admin-layout/components";
import { CarForm } from "@/features/admin-cars/components";
import { notFound } from "next/navigation";

// Mock data para el ejemplo
const mockCar = {
  id: "1",
  name: "PALISADE Hybrid",
  brand: "Hyundai",
  year: 2026,
  category: "SUV",
  fuelType: "ELÉCTRICO",
  priceUSD: 54990,
  pricePEN: 186966,
  image: "/images/PALISADE_HYB-2026.png",
  imageFrontal: "/images/frontal/PALISADE_HYB-2026-LATERAL.png",
};

export default async function EditCarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // En producción, aquí buscarías el auto por ID
  if (id !== "1") {
    notFound();
  }

  return (
    <>
      <AdminTopbar title={`Editar: ${mockCar.name}`} />

      <div className="p-6">
        <CarForm mode="edit" initialData={mockCar} />
      </div>
    </>
  );
}
