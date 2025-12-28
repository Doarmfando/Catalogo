import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminTopbar } from "@/features/admin-layout/components";
import { BannerForm } from "@/features/admin-banners/components";
import { createClient } from "@/lib/supabase/server";

export default async function NuevoBannerPage() {
  // Obtener autos para el selector
  const supabase = await createClient();
  const { data: cars } = await supabase
    .from("cars")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name", { ascending: true });

  return (
    <>
      <AdminTopbar title="Nuevo Banner" />

      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin/banners"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Banners
          </Link>
        </div>

        {/* Form */}
        <BannerForm cars={cars || []} />
      </div>
    </>
  );
}
