import { NextResponse } from "next/server";
import { createCategory } from "@/lib/supabase/queries/admin-categories";

export async function POST(request: Request) {
  try {
    const categoryData = await request.json();

    const { data, error } = await createCategory(categoryData);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: error.message || "Error al crear la categoría" },
      { status: 500 }
    );
  }
}
