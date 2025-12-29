import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/auth/session
 * Verifica si existe una sesión activa del usuario
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ user: null });
    }

    // Retornar información básica del usuario
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
      }
    });
  } catch (error) {
    console.error("Error checking session:", error);
    return NextResponse.json({ user: null, error: "Session check failed" }, { status: 500 });
  }
}
