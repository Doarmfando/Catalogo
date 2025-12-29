"use client";

import { User, Bell } from "lucide-react";

interface AdminTopbarProps {
  title: string;
  userName?: string;
  userEmail?: string;
}

export function AdminTopbar({ 
  title, 
  userName = "Administrador", 
  userEmail = "admin@hyundai.com" 
}: AdminTopbarProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        {/* Title */}
        <div>
          <h2 className="text-2xl font-bold text-[#002C5F]">{title}</h2>
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          {/* Notifications
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button> */}

          {/* User */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-50">
            <div className="h-8 w-8 rounded-full bg-[#002C5F] flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">{userEmail}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}