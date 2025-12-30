import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function DELETE(request: Request) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "No se proporcionó URL de imagen" },
        { status: 400 }
      );
    }

    // Extraer el path del bucket de la URL pública
    // Formato: https://{project}.supabase.co/storage/v1/object/public/car-images/{path}
    const urlParts = imageUrl.split('/car-images/');
    if (urlParts.length !== 2) {
      return NextResponse.json(
        { error: "URL de imagen inválida" },
        { status: 400 }
      );
    }

    const filePath = urlParts[1];

    // Crear cliente admin con service role
    const supabase = createAdminClient();

    // Eliminar del bucket
    const { error } = await supabase.storage
      .from("car-images")
      .remove([filePath]);

    if (error) {
      console.error("Error deleting from Supabase:", error);
      return NextResponse.json(
        { error: "Error al eliminar la imagen del storage" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Imagen eliminada correctamente" });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: error.message || "Error al eliminar la imagen" },
      { status: 500 }
    );
  }
}
