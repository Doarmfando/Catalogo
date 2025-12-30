"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Trash2, Shield, User } from "lucide-react";
import { useRealtimeTable } from "@/hooks/use-realtime-table";

interface UserData {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface UsersTableProps {
  users: UserData[];
}

const getRoleBadgeColor = (role: string) => {
  switch (role.toLowerCase()) {
    case "administrador":
      return "bg-purple-100 text-purple-800";
    case "personal":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getRoleLabel = (role: string) => {
  return role.charAt(0).toUpperCase() + role.slice(1);
};

export function UsersTable({ users: initialUsers }: UsersTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Realtime subscription for users
  const { data: users } = useRealtimeTable({
    table: 'users',
    initialData: initialUsers,
  });

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`¿Estás seguro de eliminar al usuario "${userName}"?`)) {
      return;
    }

    setDeletingId(userId);

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Error al eliminar usuario");
        return;
      }

      // No need for router.refresh() - Realtime will update automatically
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error al eliminar usuario");
    } finally {
      setDeletingId(null);
    }
  };
  if (users.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <User className="h-12 w-12 mx-auto mb-3 text-gray-400" />
        <p className="text-gray-500">No hay usuarios registrados</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Fecha de Registro
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 text-center text-sm font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {user.full_name || "Sin nombre"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">{user.email}</span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(
                      user.role
                    )}`}
                  >
                    {user.role.toLowerCase() === "administrador" && <Shield className="h-3 w-3" />}
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      user.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.is_active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">
                    {new Date(user.created_at).toLocaleDateString("es-PE", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/usuarios/${user.id}/editar`}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(user.id, user.full_name || user.email)}
                      disabled={deletingId === user.id}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-gray-200">
        {users.map((user, index) => (
          <div key={user.id} className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                <User className="h-6 w-6 text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {user.full_name || "Sin nombre"}
                </h3>
                <p className="text-xs text-gray-600 truncate mb-2">{user.email}</p>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(
                      user.role
                    )}`}
                  >
                    {user.role.toLowerCase() === "administrador" && <Shield className="h-3 w-3" />}
                    {getRoleLabel(user.role)}
                  </span>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      user.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.is_active ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-3 text-xs text-gray-500">
              Registrado:{" "}
              {new Date(user.created_at).toLocaleDateString("es-PE", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <Link
                href={`/admin/usuarios/${user.id}/editar`}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <Pencil className="h-4 w-4" />
                <span>Editar</span>
              </Link>
              <button
                onClick={() => handleDelete(user.id, user.full_name || user.email)}
                disabled={deletingId === user.id}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="px-4 lg:px-6 py-4 border-t border-gray-200">
        <div className="text-xs sm:text-sm text-gray-500" suppressHydrationWarning>
          Mostrando <span className="font-semibold">{users.length > 0 ? 1 : 0}</span> a{" "}
          <span className="font-semibold">{users.length}</span> de{" "}
          <span className="font-semibold">{users.length}</span> resultados
        </div>
      </div>
    </div>
  );
}
