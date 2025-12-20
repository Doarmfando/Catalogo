import { AdminTopbar } from "@/features/admin-layout/components";
import { BrandsGrid, BrandForm } from "@/features/admin-brands/components";

export default function MarcasPage() {
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
            <BrandsGrid />
          </div>
        </div>
      </div>
    </>
  );
}
