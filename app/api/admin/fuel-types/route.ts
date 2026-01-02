import { NextResponse } from "next/server";
import { createFuelType } from "@/lib/supabase/queries/admin-fuel-types";
import { validateAuth } from "@/lib/auth/api-auth";

export async function POST(request: Request) {
  const authResult = await validateAuth();
  if ('error' in authResult) return authResult.error;

  try {
    const fuelTypeData = await request.json();

    const { data, error } = await createFuelType(fuelTypeData);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error("Error creating fuel type:", error);
    return NextResponse.json(
      { error: error.message || "Error al crear el tipo de combustible" },
      { status: 500 }
    );
  }
}
