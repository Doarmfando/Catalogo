import { NextResponse } from "next/server";
import { createVersion, assignColorToVersion, addColorImage } from "@/lib/supabase/queries/admin-versions";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { car_id, name, price_usd, highlights, display_order, colors } = body;

    // Create the version
    const { data: version, error: versionError } = await createVersion({
      car_id,
      name,
      price_usd,
      highlights,
      display_order,
    });

    if (versionError || !version) {
      return NextResponse.json(
        { error: versionError || "Error al crear la versión" },
        { status: 500 }
      );
    }

    // Assign colors to the version and add images
    if (colors && colors.length > 0) {
      for (const color of colors) {
        // Assign color to version
        const { data: versionColor, error: assignError } = await assignColorToVersion(
          version.id,
          color.colorId
        );

        if (assignError || !versionColor) {
          console.error("Error assigning color:", assignError);
          continue;
        }

        // Add images for this color
        if (color.imageUrls && color.imageUrls.length > 0) {
          for (let i = 0; i < color.imageUrls.length; i++) {
            const { error: imageError } = await addColorImage(
              versionColor.id,
              color.imageUrls[i],
              i
            );

            if (imageError) {
              console.error("Error adding color image:", imageError);
            }
          }
        }
      }
    }

    return NextResponse.json(version, { status: 201 });
  } catch (error: any) {
    console.error("Error creating version:", error);
    return NextResponse.json(
      { error: error.message || "Error al crear la versión" },
      { status: 500 }
    );
  }
}
