"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface UserData {
  id?: string;
  full_name: string | null;
  email: string;
  role: string;
  is_active: boolean;
}

interface UserFormProps {
  initialData?: UserData;
  mode?: "create" | "edit";
}

export function UserForm({ initialData, mode = "create" }: UserFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    role: "personal",
    is_active: true,
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        full_name: initialData.full_name || "",
        email: initialData.email,
        role: initialData.role,
        is_active: initialData.is_active,
        password: "",
        confirmPassword: "",
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validar contraseñas
    if (mode === "create" && !formData.password) {
      setError("La contraseña es requerida");
      setLoading(false);
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      const url = mode === "create"
        ? "/api/admin/users"
        : `/api/admin/users/${initialData?.id}`;

      const method = mode === "create" ? "POST" : "PUT";

      const body: any = {
        full_name: formData.full_name,
        email: formData.email,
        role: formData.role,
        is_active: formData.is_active,
      };

      // Solo incluir contraseña si se proporcionó
      if (formData.password) {
        body.password = formData.password;
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al guardar usuario");
        setLoading(false);
        return;
      }

      router.push("/admin/usuarios");
      router.refresh();
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Error al guardar usuario");
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        {mode === "edit" ? "Editar Usuario" : "Nuevo Usuario"}
      </h3>

      {/* Error message */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre Completo *
          </label>
          <input
            type="text"
            required
            disabled={loading}
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none disabled:opacity-50"
            placeholder="Ej: Juan Pérez"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            required
            disabled={loading}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none disabled:opacity-50"
            placeholder="usuario@ejemplo.com"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rol *
          </label>
          <select
            required
            disabled={loading}
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none disabled:opacity-50"
          >
            <option value="administrador">Administrador</option>
            <option value="personal">Personal</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Administrador: Control total | Personal: Gestiona catálogo
          </p>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado *
          </label>
          <select
            required
            disabled={loading}
            value={formData.is_active ? "true" : "false"}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.value === "true" })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none disabled:opacity-50"
          >
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>

        {/* Password (only for create or if editing) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña {mode === "create" ? "*" : "(opcional)"}
          </label>
          <input
            type="password"
            required={mode === "create"}
            disabled={loading}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none disabled:opacity-50"
            placeholder={mode === "edit" ? "Dejar vacío para mantener actual" : ""}
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar Contraseña {mode === "create" ? "*" : "(opcional)"}
          </label>
          <input
            type="password"
            required={mode === "create"}
            disabled={loading}
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none disabled:opacity-50"
          />
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-[#002C5F] text-white rounded-lg hover:bg-[#0957a5] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {mode === "edit" ? "Guardando..." : "Creando..."}
              </span>
            ) : (
              mode === "edit" ? "Guardar Cambios" : "Crear Usuario"
            )}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
}
