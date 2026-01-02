import { NextResponse } from "next/server";
import { deleteCar, updateCar } from "@/lib/supabase/queries/admin-cars";
import { validateAuth, validateDelete } from "@/lib/auth/api-auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Validar autenticación (cualquier usuario autenticado puede editar)
  const authResult = await validateAuth();
  if ('error' in authResult) {
    return authResult.error;
  }

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
  // Validar permisos de eliminación (solo administradores)
  const authResult = await validateDelete();
  if ('error' in authResult) {
    return authResult.error;
  }

  const { id } = await params;

  const { error } = await deleteCar(id);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
