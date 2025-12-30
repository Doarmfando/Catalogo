"use client";

import { Menu } from "lucide-react";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6 lg:py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        {/* Botón de menú en móvil */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </button>

        {/* Título de página en móvil */}
        <h1 className="lg:hidden text-lg font-semibold text-gray-900">
          Admin Panel
        </h1>

        {/* Espacio para futuros elementos (notificaciones, perfil, etc.) */}
        <div className="flex items-center gap-3">
          {/* Aquí se pueden agregar notificaciones, perfil del usuario, etc. */}
        </div>
      </div>
    </header>
  );
}
