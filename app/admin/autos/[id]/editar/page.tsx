import { AdminTopbarWrapper } from "@/features/admin-layout/components";
import { CarForm } from "@/features/admin-cars/components";
import { notFound } from "next/navigation";
import { getCarByIdAdmin } from "@/lib/supabase/queries/admin-cars";
import {
  getAllBrands,
  getAllCategories,
  getAllFuelTypes,
} from "@/lib/supabase/queries/form-options";

export default async function EditCarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [car, brands, categories, fuelTypes] = await Promise.all([
    getCarByIdAdmin(id),
    getAllBrands(),
    getAllCategories(),
    getAllFuelTypes(),
  ]);

  if (!car) {
    notFound();
  }

  return (
    <>
      <AdminTopbarWrapper title={`Editar: ${car.name}`} />

      <div className="p-6">
        <CarForm
          mode="edit"
          initialData={car}
          brands={brands}
          categories={categories}
          fuelTypes={fuelTypes}
        />
      </div>
    </>
  );
}
