import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  // Autenticación deshabilitada temporalmente durante desarrollo
  // Se habilitará al final

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string;

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó ningún archivo" },
        { status: 400 }
      );
    }

    // Crear cliente admin con service role
    const supabase = createAdminClient();

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    // Limpiar el nombre del archivo: eliminar espacios, caracteres especiales y normalizar
    const cleanName = file.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
      .replace(/\s+/g, "-") // Reemplazar espacios con guiones
      .replace(/[^\w\-\.]/g, "") // Eliminar caracteres especiales excepto guiones, puntos y letras
      .toLowerCase();
    const fileName = `${folder || "cars"}/${timestamp}-${cleanName}`;

    // Convertir File a ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Subir al bucket
    const { data, error } = await supabase.storage
      .from("car-images")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Error uploading to Supabase:", error);
      return NextResponse.json(
        { error: "Error al subir la imagen" },
        { status: 500 }
      );
    }

    // Obtener URL pública
    const {
      data: { publicUrl },
    } = supabase.storage.from("car-images").getPublicUrl(data.path);

    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Error al procesar la imagen" },
      { status: 500 }
    );
  }
}
