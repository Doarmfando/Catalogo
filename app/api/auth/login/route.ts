import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error de autenticación:", error);
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Verificar si el usuario está activo
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("is_active")
      .eq("id", data.user.id)
      .single();

    if (userError) {
      console.error("Error al verificar estado del usuario:", userError);
      return NextResponse.json(
        { error: "Error al verificar estado del usuario" },
        { status: 500 }
      );
    }

    if (!userData.is_active) {
      // Cerrar la sesión que se acaba de crear
      await supabase.auth.signOut();
      return NextResponse.json(
        { error: "Usuario desactivado" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      user: data.user
    });
  } catch (error: any) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { error: "Error al iniciar sesión" },
      { status: 500 }
    );
  }
}
