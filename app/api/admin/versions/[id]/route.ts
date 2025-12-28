import { NextResponse } from "next/server";
import {
  deleteVersion,
  updateVersion,
  assignColorToVersion,
  addColorImage,
  removeColorFromVersion,
  getVersionById,
} from "@/lib/supabase/queries/admin-versions";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, price_usd, highlights, display_order, colors } = body;

    // Update the version
    const { data: version, error: versionError } = await updateVersion(id, {
      name,
      price_usd,
      highlights,
      display_order,
    });

    if (versionError || !version) {
      return NextResponse.json(
        { error: versionError || "Error al actualizar la versión" },
        { status: 500 }
      );
    }

    // Get current version to compare colors
    const currentVersion = await getVersionById(id);

    // Remove old color assignments that are not in the new list
    if (currentVersion?.version_colors) {
      const newColorIds = colors.map((c: any) => c.colorId);
      const oldVersionColors = currentVersion.version_colors;

      for (const vc of oldVersionColors) {
        if (!newColorIds.includes(vc.color_id)) {
          await removeColorFromVersion(vc.id);
        }
      }
    }

    // Assign new colors and update images
    if (colors && colors.length > 0) {
      for (const color of colors) {
        // Check if color is already assigned
        const existingAssignment = currentVersion?.version_colors?.find(
          (vc: any) => vc.color_id === color.colorId
        );

        let versionColorId: string;

        if (existingAssignment) {
          versionColorId = existingAssignment.id;
        } else {
          // Assign new color to version
          const { data: versionColor, error: assignError } = await assignColorToVersion(
            version.id,
            color.colorId
          );

          if (assignError || !versionColor) {
            console.error("Error assigning color:", assignError);
            continue;
          }

          versionColorId = versionColor.id;
        }

        // Add new images for this color
        if (color.imageUrls && color.imageUrls.length > 0) {
          // Get current image count for this version_color
          const currentImageCount = existingAssignment?.color_images?.length || 0;

          for (let i = 0; i < color.imageUrls.length; i++) {
            // Only add images that are new (beyond current count)
            if (i >= currentImageCount) {
              const { error: imageError } = await addColorImage(
                versionColorId,
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
    }

    return NextResponse.json(version);
  } catch (error: any) {
    console.error("Error updating version:", error);
    return NextResponse.json(
      { error: error.message || "Error al actualizar la versión" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Autenticación deshabilitada temporalmente durante desarrollo
  // Se habilitará al final

  const { id } = await params;

  const { error } = await deleteVersion(id);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
