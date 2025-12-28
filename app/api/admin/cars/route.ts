import { NextResponse } from "next/server";
import { createCar } from "@/lib/supabase/queries/admin-cars";

export async function POST(request: Request) {
  // Autenticación deshabilitada temporalmente durante desarrollo
  // Se habilitará al final

  try {
    const carData = await request.json();

    const { data, error } = await createCar(carData);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al crear el auto" },
      { status: 500 }
    );
  }
}
