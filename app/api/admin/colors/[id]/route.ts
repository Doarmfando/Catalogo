import { NextResponse } from "next/server";
import { updateColor, deleteColor } from "@/lib/supabase/queries/admin-colors";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const colorData = await request.json();

    const { data, error } = await updateColor(id, colorData);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error updating color:", error);
    return NextResponse.json(
      { error: error.message || "Error al actualizar el color" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await deleteColor(id);

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting color:", error);
    return NextResponse.json(
      { error: error.message || "Error al eliminar el color" },
      { status: 500 }
    );
  }
}
