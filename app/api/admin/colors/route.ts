import { NextResponse } from "next/server";
import { getAllColors, createColor } from "@/lib/supabase/queries/admin-colors";

export async function GET() {
  try {
    const colors = await getAllColors();
    return NextResponse.json(colors);
  } catch (error: any) {
    console.error("Error fetching colors:", error);
    return NextResponse.json(
      { error: error.message || "Error al obtener los colores" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const colorData = await request.json();

    const { data, error } = await createColor(colorData);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error("Error creating color:", error);
    return NextResponse.json(
      { error: error.message || "Error al crear el color" },
      { status: 500 }
    );
  }
}
