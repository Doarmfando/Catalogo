"use client";

import { createContext, useContext } from "react";

interface AdminLayoutContextType {
  toggleSidebar: () => void;
}

const AdminLayoutContext = createContext<AdminLayoutContextType | undefined>(undefined);

export function AdminLayoutProvider({
  children,
  toggleSidebar,
}: {
  children: React.ReactNode;
  toggleSidebar: () => void;
}) {
  return (
    <AdminLayoutContext.Provider value={{ toggleSidebar }}>
      {children}
    </AdminLayoutContext.Provider>
  );
}

export function useAdminLayout() {
  const context = useContext(AdminLayoutContext);
  if (!context) {
    throw new Error("useAdminLayout must be used within AdminLayoutProvider");
  }
  return context;
}
