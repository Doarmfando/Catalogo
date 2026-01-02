import { NextResponse } from "next/server";
import { updateFuelType, deleteFuelType } from "@/lib/supabase/queries/admin-fuel-types";
import { validateAuth, validateDelete } from "@/lib/auth/api-auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await validateAuth();
  if ('error' in authResult) return authResult.error;

  try {
    const { id } = await params;
    const fuelTypeData = await request.json();

    const { data, error } = await updateFuelType(id, fuelTypeData);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error updating fuel type:", error);
    return NextResponse.json(
      { error: error.message || "Error al actualizar el tipo de combustible" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await validateDelete();
  if ('error' in authResult) return authResult.error;

  try {
    const { id } = await params;

    const { error } = await deleteFuelType(id);

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting fuel type:", error);
    return NextResponse.json(
      { error: error.message || "Error al eliminar el tipo de combustible" },
      { status: 500 }
    );
  }
}
