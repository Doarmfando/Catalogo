import { NextResponse } from "next/server";
import { checkVersionNameExists } from "@/lib/supabase/queries/admin-versions";
import { validateAuth } from "@/lib/auth/api-auth";

export async function POST(request: Request) {
  const authResult = await validateAuth();
  if ('error' in authResult) return authResult.error;

  try {
    const { carId, name, excludeId } = await request.json();

    if (!carId || typeof carId !== "string") {
      return NextResponse.json(
        { error: "El ID del auto es requerido" },
        { status: 400 }
      );
    }

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "El nombre es requerido" },
        { status: 400 }
      );
    }

    const { exists, error } = await checkVersionNameExists(carId, name, excludeId);

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
