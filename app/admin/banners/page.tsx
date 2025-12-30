import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminTopbarClient } from "@/features/admin-layout/components";
import { BannersTable } from "@/features/admin-banners/components";
import { getAllBannersAdmin } from "@/lib/supabase/queries/admin-banners";

export default async function BannersPage() {
  const banners = await getAllBannersAdmin();

  return (
    <>
      <AdminTopbarClient title="Banners del Hero" />

      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Banners del Hero
            </h1>
            <p className="text-gray-600 mt-1">
              Gestiona los banners del carousel principal del sitio
            </p>
          </div>
          <Link
            href="/admin/banners/nuevo"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#002C5F] text-white rounded-lg hover:bg-[#0957a5] transition-colors font-medium whitespace-nowrap"
          >
            <Plus className="h-5 w-5" />
            Nuevo Banner
          </Link>
        </div>

        {/* Table */}
        <BannersTable banners={banners} />
      </div>
    </>
  );
}
