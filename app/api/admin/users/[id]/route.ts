import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

// PUT - Actualizar usuario
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { email, password, full_name, role, is_active } = body;

    const supabaseAdmin = createAdminClient();

    // 1. Actualizar en auth.users si es necesario
    const authUpdate: any = {};
    if (email) authUpdate.email = email;
    if (password) authUpdate.password = password;
    if (full_name) authUpdate.user_metadata = { full_name };

    if (Object.keys(authUpdate).length > 0) {
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
        id,
        authUpdate
      );

      if (authError) {
        console.error("Error updating auth user:", authError);
        return NextResponse.json(
          { error: "Error al actualizar autenticación" },
          { status: 500 }
        );
      }
    }

    // 2. Actualizar en public.users
    const updateData: any = {};
    if (full_name) updateData.full_name = full_name;
    if (role) updateData.role = role;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data, error } = await supabaseAdmin
      .from("users")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating user:", error);
      return NextResponse.json(
        { error: "Error al actualizar usuario" },
        { status: 500 }
      );
    }

    // 3. Si el usuario fue marcado como inactivo, cerrar todas sus sesiones
    if (is_active === false) {
      try {
        // Revocar todos los refresh tokens del usuario para cerrar todas sus sesiones
        // Requiere ejecutar la función SQL en supabase-functions.sql primero
        const { error: revokeError } = await supabaseAdmin.rpc('revoke_user_tokens', {
          target_user_id: id
        });

        if (revokeError) {
          console.error("Error revoking user tokens:", revokeError);
          console.log("NOTA: Asegúrate de haber ejecutado el SQL actualizado en supabase-functions.sql");
        }
      } catch (error) {
        console.error("Error closing user sessions:", error);
      }
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in PUT /api/admin/users/[id]:", error);
    return NextResponse.json(
      { error: "Error al actualizar usuario" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar usuario
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabaseAdmin = createAdminClient();

    // Eliminar de auth.users (esto también eliminará de public.users por CASCADE)
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (error) {
      console.error("Error deleting user:", error);
      return NextResponse.json(
        { error: "Error al eliminar usuario" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in DELETE /api/admin/users/[id]:", error);
    return NextResponse.json(
      { error: "Error al eliminar usuario" },
      { status: 500 }
    );
  }
}
