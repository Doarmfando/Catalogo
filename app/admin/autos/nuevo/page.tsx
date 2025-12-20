import { AdminTopbar } from "@/features/admin-layout/components";
import { CarForm } from "@/features/admin-cars/components";

export default function NewCarPage() {
  return (
    <>
      <AdminTopbar title="Crear Nuevo Auto" />

      <div className="p-6">
        <CarForm mode="create" />
      </div>
    </>
  );
}
