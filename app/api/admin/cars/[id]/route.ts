import { NextResponse } from "next/server";
import { deleteCar, updateCar } from "@/lib/supabase/queries/admin-cars";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Autenticación deshabilitada temporalmente durante desarrollo
  // Se habilitará al final

  try {
    const { id } = await params;
    const carData = await request.json();

    const { data, error } = await updateCar(id, carData);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al actualizar el auto" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Autenticación deshabilitada temporalmente durante desarrollo
  // Se habilitará al final

  const { id } = await params;

  const { error } = await deleteCar(id);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
