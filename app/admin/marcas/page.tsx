import { AdminTopbar } from "@/features/admin-layout/components";
import { BrandsGrid, BrandForm } from "@/features/admin-brands/components";
import { getAllBrandsAdmin } from "@/lib/supabase/queries/admin-brands";

export default async function MarcasPage() {
  const brands = await getAllBrandsAdmin();

  return (
    <>
      <AdminTopbar title="Gestión de Marcas" />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form in sidebar */}
          <div className="lg:col-span-1">
            <BrandForm />
          </div>

          {/* Grid */}
          <div className="lg:col-span-2">
            <BrandsGrid brands={brands} />
          </div>
        </div>
      </div>
    </>
  );
}
