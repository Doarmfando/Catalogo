import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// PUT - Actualizar banner
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
      display_order,
      is_active,
      start_date,
      end_date,
    } = body;

    const supabase = await createClient();

    const updateData: any = {};
    if (car_id !== undefined) updateData.car_id = car_id || null;
    if (title !== undefined) updateData.title = title;
    if (subtitle !== undefined) updateData.subtitle = subtitle || null;
    if (description !== undefined) updateData.description = description || null;
    if (image_url !== undefined) updateData.image_url = image_url || null;
    if (image_mobile_url !== undefined)
      updateData.image_mobile_url = image_mobile_url || null;
    if (background_color !== undefined)
      updateData.background_color = background_color;
    if (text_color !== undefined) updateData.text_color = text_color;
    if (cta_primary_text !== undefined)
      updateData.cta_primary_text = cta_primary_text || null;
    if (cta_primary_link !== undefined)
      updateData.cta_primary_link = cta_primary_link || null;
    if (cta_secondary_text !== undefined)
      updateData.cta_secondary_text = cta_secondary_text || null;
    if (cta_secondary_link !== undefined)
      updateData.cta_secondary_link = cta_secondary_link || null;
    if (display_order !== undefined) updateData.display_order = display_order;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (start_date !== undefined) updateData.start_date = start_date || null;
    if (end_date !== undefined) updateData.end_date = end_date || null;

    const { data, error } = await supabase
      .from("hero_banners")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating banner:", error);
      return NextResponse.json(
        { error: "Error al actualizar banner" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in PUT /api/admin/banners/[id]:", error);
    return NextResponse.json(
      { error: "Error al actualizar banner" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar banner
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { error } = await supabase.from("hero_banners").delete().eq("id", id);

    if (error) {
      console.error("Error deleting banner:", error);
      return NextResponse.json(
        { error: "Error al eliminar banner" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in DELETE /api/admin/banners/[id]:", error);
    return NextResponse.json(
      { error: "Error al eliminar banner" },
      { status: 500 }
    );
  }
}
