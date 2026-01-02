import { NextResponse } from "next/server";
import { checkFuelTypeNameExists } from "@/lib/supabase/queries/admin-fuel-types";
import { validateAuth } from "@/lib/auth/api-auth";

export async function POST(request: Request) {
  const authResult = await validateAuth();
  if ('error' in authResult) return authResult.error;

  try {
    const { name, excludeId } = await request.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "El nombre es requerido" },
        { status: 400 }
      );
    }

    const { exists, error } = await checkFuelTypeNameExists(name, excludeId);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ exists }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al verificar el nombre" },
      { status: 500 }
    );
  }
}
