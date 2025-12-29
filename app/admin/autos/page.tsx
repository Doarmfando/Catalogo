// app/admin/autos/page.tsx
import { AdminTopbarWrapper } from "@/features/admin-layout/components";
import { CarsManagement } from "@/features/admin-cars/components";
import { getAllCarsAdmin } from "@/lib/supabase/queries/admin-cars";
import { adaptSupabaseCars } from "@/lib/supabase/adapters/cars";

export default async function AutosPage() {
  // Fetch cars from Supabase
  const supabaseCars = await getAllCarsAdmin();
  const cars = adaptSupabaseCars(supabaseCars);

  return (
    <>
      <AdminTopbarWrapper title="Gestión de Autos" />

      <div className="p-6">
        <CarsManagement initialCars={cars} />
      </div>
    </>
  );
}