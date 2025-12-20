"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, Tag, Users, Layers, LogOut, LayoutDashboard } from "lucide-react";

const menuItems = [
  {
    label: "Autos",
    href: "/admin/autos",
    icon: Car,
  },
  {
    label: "Marcas",
    href: "/admin/marcas",
    icon: Tag,
  },
  {
    label: "Categorías",
    href: "/admin/categorias",
    icon: Layers,
  },
  {
    label: "Usuarios",
    href: "/admin/usuarios",
    icon: Users,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#002C5F] text-white flex flex-col h-screen sticky top-0">
      {/* Logo/Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="h-8 w-8" />
          <div>
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <p className="text-xs text-white/70">Gestión de Catálogo</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname?.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={[
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-white/10 text-white font-semibold"
                      : "text-white/70 hover:bg-white/5 hover:text-white",
                  ].join(" ")}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <Link
          href="/login"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Cerrar Sesión</span>
        </Link>
      </div>
    </aside>
  );
}
