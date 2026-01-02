import { NextResponse } from "next/server";
import { updateBrand, deleteBrand } from "@/lib/supabase/queries/admin-brands";
import { validateAuth, validateDelete } from "@/lib/auth/api-auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await validateAuth();
  if ('error' in authResult) return authResult.error;

  try {
    const { id } = await params;
    const brandData = await request.json();

    const { data, error } = await updateBrand(id, brandData);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al actualizar la marca" },
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

    const { error } = await deleteBrand(id);

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al eliminar la marca" },
      { status: 500 }
    );
  }
}
