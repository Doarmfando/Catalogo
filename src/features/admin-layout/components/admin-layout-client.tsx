"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminLayoutProvider } from "./admin-layout-context";

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

export function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Detectar dispositivo móvil al montar el componente
  useEffect(() => {
    const isMobileDevice = () => {
      if (typeof window === 'undefined') return false;
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      return /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    };

    // Verificar si ya se mostró el aviso en esta sesión
    const hasSeenWarning = sessionStorage.getItem('mobile-warning-shown');

    if (isMobileDevice() && !hasSeenWarning) {
      setShowMobileWarning(true);
      sessionStorage.setItem('mobile-warning-shown', 'true');

      // Auto-cerrar después de 5 segundos
      setTimeout(() => {
        setShowMobileWarning(false);
      }, 5000);
    }
  }, []);

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

        {/* Aviso de dispositivo móvil */}
        {showMobileWarning && (
          <div
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300"
            style={{
              animation: 'slideDown 0.3s ease-out forwards'
            }}
          >
            <div className="bg-amber-50 border border-amber-200 rounded-xl shadow-lg px-5 py-4 max-w-sm mx-4">
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-amber-900">
                    Recomendación
                  </h3>
                  <p className="text-sm text-amber-800 mt-1">
                    Se recomienda el uso de computadora para una mejor experiencia.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMobileWarning(false)}
                  className="shrink-0 text-amber-600 hover:text-amber-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </AdminLayoutProvider>
  );
}
