import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET - Obtener todos los banners
export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("hero_banners")
      .select(`
        *,
        cars (
          id,
          name,
          slug
        )
      `)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching banners:", error);
      return NextResponse.json(
        { error: "Error al obtener banners" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in GET /api/admin/banners:", error);
    return NextResponse.json(
      { error: "Error al obtener banners" },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo banner
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      car_id,
      title,
      subtitle,
      description,
      image_url,
      image_mobile_url,
      background_color,
      text_color,
      cta_primary_text,
      cta_primary_link,
      cta_secondary_text,
      cta_secondary_link,
      is_active,
      start_date,
      end_date,
    } = body;

    if (!title) {
      return NextResponse.json(
        { error: "El título es requerido" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Obtener el máximo display_order actual
    const { data: maxOrderData } = await supabase
      .from("hero_banners")
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1)
      .single();

    const nextDisplayOrder = maxOrderData ? maxOrderData.display_order + 1 : 0;

    const { data, error } = await supabase
      .from("hero_banners")
      .insert([
        {
          car_id: car_id || null,
          title,
          subtitle: subtitle || null,
          description: description || null,
          image_url: image_url || null,
          image_mobile_url: image_mobile_url || null,
          background_color: background_color || "#020617",
          text_color: text_color || "white",
          cta_primary_text: cta_primary_text || "Ver Catálogo Completo",
          cta_primary_link: cta_primary_link || "#modelos",
          cta_secondary_text: cta_secondary_text || "Quiero cotizar",
          cta_secondary_link: cta_secondary_link || "#contacto",
          display_order: nextDisplayOrder,
          is_active: is_active !== undefined ? is_active : true,
          start_date: start_date || null,
          end_date: end_date || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating banner:", error);
      return NextResponse.json(
        { error: "Error al crear banner" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/admin/banners:", error);
    return NextResponse.json(
      { error: "Error al crear banner" },
      { status: 500 }
    );
  }
}
