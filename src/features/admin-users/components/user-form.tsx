"use client";

import { useState, useEffect } from "react";

interface UserData {
  id?: string;
  name: string;
  email: string;
  role: string;
  status: string;
  password?: string;
}

interface UserFormProps {
  initialData?: UserData;
  mode?: "create" | "edit";
}

export function UserForm({ initialData, mode = "create" }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Personal",
    status: "Activo",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        role: initialData.role,
        status: initialData.status,
        password: "",
        confirmPassword: "",
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "create" && formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const action = mode === "edit" ? "actualizado" : "creado";
    alert(`Usuario ${action} (maqueta)\nNombre: ${formData.name}\nEmail: ${formData.email}\nRol: ${formData.role}`);

    if (mode === "create") {
      setFormData({
        name: "",
        email: "",
        role: "Personal",
        status: "Activo",
        password: "",
        confirmPassword: "",
      });
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

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre Completo *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none"
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
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none"
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
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none"
          >
            <option value="Administrador">Administrador</option>
            <option value="Personal">Personal</option>
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
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none"
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
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
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none"
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
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002C5F] focus:border-transparent outline-none"
          />
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-[#002C5F] text-white rounded-lg hover:bg-[#0957a5] transition-colors font-medium"
          >
            {mode === "edit" ? "Guardar Cambios" : "Crear Usuario"}
          </button>
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
}
