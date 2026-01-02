import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validateAuth } from "@/lib/auth/api-auth";

export async function PUT(request: Request) {
  const authResult = await validateAuth();
  if ('error' in authResult) return authResult.error;

  try {
    const { banners } = await request.json();

    if (!Array.isArray(banners)) {
      return NextResponse.json(
        { error: "Se esperaba un array de banners" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Actualizar el display_order de cada banner
    const updatePromises = banners.map((banner: { id: string; display_order: number }) =>
      supabase
        .from("hero_banners")
        .update({ display_order: banner.display_order })
        .eq("id", banner.id)
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error reordering banners:", error);
    return NextResponse.json(
      { error: error.message || "Error al reordenar banners" },
      { status: 500 }
    );
  }
}
