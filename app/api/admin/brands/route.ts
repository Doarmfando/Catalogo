import { NextResponse } from "next/server";
import { createBrand } from "@/lib/supabase/queries/admin-brands";
import { validateAuth } from "@/lib/auth/api-auth";

export async function POST(request: Request) {
  const authResult = await validateAuth();
  if ('error' in authResult) return authResult.error;

  try {
    const brandData = await request.json();

    const { data, error } = await createBrand(brandData);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al crear la marca" },
      { status: 500 }
    );
  }
}
