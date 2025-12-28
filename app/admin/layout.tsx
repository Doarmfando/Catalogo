import { AdminSidebar } from "@/features/admin-layout/components";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Autenticación deshabilitada temporalmente durante desarrollo
  // Se habilitará al final

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
