"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Car, Tag, Users, Layers, LogOut, LayoutDashboard, Fuel, Palette, Image } from "lucide-react";
import { useUser } from "@/contexts/user-context";

const menuItems = [
  {
    label: "Autos",
    href: "/admin/autos",
    icon: Car,
  },
  {
    label: "Banners",
    href: "/admin/banners",
    icon: Image,
  },
  {
    label: "Tipos de Combustible",
    href: "/admin/tipos-combustible",
    icon: Fuel,
  },
  {
    label: "Colores",
    href: "/admin/colores",
    icon: Palette,
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
    adminOnly: true, // Solo visible para administradores
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { isAdmin } = useUser();

  // Escuchar eventos de logout en otras pestañas
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Si otra pestaña cerró sesión, redirigir esta también
      if (e.key === 'logout-event') {
        router.push('/');
        router.refresh();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (res.ok) {
        // Notificar a otras pestañas que se cerró sesión
        localStorage.setItem('logout-event', Date.now().toString());
        // Limpiar el evento inmediatamente
        localStorage.removeItem('logout-event');

        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

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
          {menuItems
            .filter((item) => !item.adminOnly || isAdmin) // Filtrar items solo para admin
            .map((item) => {
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
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="h-5 w-5" />
          <span>{isLoggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}</span>
        </button>
      </div>
    </aside>
  );
}
