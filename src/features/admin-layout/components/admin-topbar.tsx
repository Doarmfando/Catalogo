"use client";

import { User, Bell, Menu } from "lucide-react";

interface AdminTopbarProps {
  title: string;
  userName?: string;
  userEmail?: string;
  onMenuClick?: () => void;
}

export function AdminTopbar({
  title,
  userName = "Usuario",
  userEmail = "",
  onMenuClick
}: AdminTopbarProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 lg:py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between gap-3">
        {/* Botón de menú en móvil */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5 text-gray-700" />
          </button>
        )}

        {/* Title */}
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#002C5F] truncate">{title}</h2>
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Notifications
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button> */}

          {/* User */}
          <div className="flex items-center gap-2 lg:gap-3 px-2 lg:px-4 py-1.5 lg:py-2 rounded-lg bg-gray-50">
            <div className="h-7 w-7 lg:h-8 lg:w-8 rounded-full bg-[#002C5F] flex items-center justify-center">
              <User className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">{userEmail}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}