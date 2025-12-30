"use client";

import { useState } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminLayoutProvider } from "./admin-layout-context";

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

export function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <AdminLayoutProvider toggleSidebar={toggleSidebar}>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          {/* Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminLayoutProvider>
  );
}
