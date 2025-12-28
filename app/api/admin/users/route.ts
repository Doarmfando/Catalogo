import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

// GET - Obtener todos los usuarios
export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      return NextResponse.json(
        { error: "Error al obtener usuarios" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in GET /api/admin/users:", error);
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo usuario
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, full_name, role, is_active } = body;

    if (!email || !password || !full_name) {
      return NextResponse.json(
        { error: "Email, contraseña y nombre completo son requeridos" },
        { status: 400 }
      );
    }

    // Usar cliente admin para operaciones de Auth Admin API
    const supabaseAdmin = createAdminClient();

    // 1. Crear usuario en auth.users usando la Admin API
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name,
      },
    });

    if (authError) {
      console.error("Error creating auth user:", authError);
      return NextResponse.json(
        { error: "Error al crear usuario en autenticación" },
        { status: 500 }
      );
    }

    // 2. El trigger debería crear el usuario en public.users
    // pero actualizamos los datos adicionales
    const { data: userData, error: updateError } = await supabaseAdmin
      .from("users")
      .update({
        full_name,
        role: role || "personal",
        is_active: is_active !== undefined ? is_active : true,
      })
      .eq("id", authData.user.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating user data:", updateError);
      // El usuario se creó en auth pero falló la actualización
      // Podrías intentar eliminar el usuario de auth aquí si quieres rollback
      return NextResponse.json(
        { error: "Usuario creado pero error al actualizar datos" },
        { status: 500 }
      );
    }

    return NextResponse.json(userData, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/admin/users:", error);
    return NextResponse.json(
      { error: "Error al crear usuario" },
      { status: 500 }
    );
  }
}
