import { AdminTopbar } from "@/features/admin-layout/components";
import { CarForm } from "@/features/admin-cars/components";
import {
  getAllBrands,
  getAllCategories,
  getAllFuelTypes,
} from "@/lib/supabase/queries/form-options";

export default async function NewCarPage() {
  const [brands, categories, fuelTypes] = await Promise.all([
    getAllBrands(),
    getAllCategories(),
    getAllFuelTypes(),
  ]);

  return (
    <>
      <AdminTopbar title="Crear Nuevo Auto" />

      <div className="p-6">
        <CarForm
          mode="create"
          brands={brands}
          categories={categories}
          fuelTypes={fuelTypes}
        />
      </div>
    </>
  );
}
