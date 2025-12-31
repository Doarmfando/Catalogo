import { NextResponse } from "next/server";
import { checkColorCodeExists } from "@/lib/supabase/queries/admin-colors";

export async function POST(request: Request) {
  try {
    const { colorCode, excludeId } = await request.json();

    if (!colorCode || typeof colorCode !== "string") {
      return NextResponse.json(
        { error: "El código de color es requerido" },
        { status: 400 }
      );
    }

    const { exists, error } = await checkColorCodeExists(colorCode, excludeId);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ exists }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al verificar el código de color" },
      { status: 500 }
    );
  }
}
