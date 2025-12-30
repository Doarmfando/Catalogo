"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Car, Tag, Users, Layers, LogOut, LayoutDashboard, Fuel, Palette, Image, X } from "lucide-react";
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
    adminOnly: true,
  },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen = true, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { isAdmin } = useUser();

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
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

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (res.ok) {
        localStorage.setItem('logout-event', Date.now().toString());
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
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={[
        "fixed lg:sticky top-0 left-0 w-64 bg-[#002C5F] text-white flex flex-col h-screen z-50 transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      ].join(" ")}>
        {/* Logo/Header */}
        <div className="p-4 lg:p-6 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="h-6 lg:h-8 w-6 lg:w-8" />
              <div>
                <h1 className="text-lg lg:text-xl font-bold">Admin Panel</h1>
                <p className="text-xs text-white/70">Gestión de Catálogo</p>
              </div>
            </div>

            {/* Botón cerrar en móvil */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Menu Items - Con scroll independiente */}
        <nav className="flex-1 p-3 lg:p-4 overflow-y-auto min-h-0">
          <ul className="space-y-1 lg:space-y-2">
            {menuItems
              .filter((item) => !item.adminOnly || isAdmin)
              .map((item) => {
                const Icon = item.icon;
                const isActive = pathname?.startsWith(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={handleLinkClick}
                      className={[
                        "flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg transition-colors text-sm lg:text-base",
                        isActive
                          ? "bg-white/10 text-white font-semibold"
                          : "text-white/70 hover:bg-white/5 hover:text-white",
                      ].join(" ")}
                    >
                      <Icon className="h-4 lg:h-5 w-4 lg:w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </nav>

        {/* Logout - Siempre visible */}
        <div className="p-3 lg:p-4 border-t border-white/10 flex-shrink-0">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
          >
            <LogOut className="h-4 lg:h-5 w-4 lg:w-5" />
            <span>{isLoggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}