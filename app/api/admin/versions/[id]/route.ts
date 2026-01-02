import { NextResponse } from "next/server";
import {
  deleteVersion,
  updateVersion,
  assignColorToVersion,
  addColorImage,
  deleteColorImage,
  updateColorImagesOrder,
  removeColorFromVersion,
  getVersionById,
} from "@/lib/supabase/queries/admin-versions";
import { validateAuth, validateDelete } from "@/lib/auth/api-auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await validateAuth();
  if ('error' in authResult) return authResult.error;

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

        // Update images for this color (optimized: only update what changed)
        if (color.imageUrls && color.imageUrls.length > 0) {
          const existingImages = existingAssignment?.color_images || [];
          const existingUrls = existingImages.map((img: any) => img.image_url);
          const newUrls = color.imageUrls;

          // Find images to delete (existed before but not anymore)
          const urlsToDelete = existingUrls.filter((url: string) => !newUrls.includes(url));
          for (const urlToDelete of urlsToDelete) {
            const imgToDelete = existingImages.find((img: any) => img.image_url === urlToDelete);
            if (imgToDelete) {
              const { error: deleteError } = await deleteColorImage(imgToDelete.id);
              if (deleteError) {
                console.error("Error deleting color image:", deleteError);
              }
            }
          }

          // Find images to add (new ones that didn't exist)
          const urlsToAdd = newUrls.filter((url: string) => !existingUrls.includes(url));
          for (const urlToAdd of urlsToAdd) {
            const displayOrder = newUrls.indexOf(urlToAdd);
            const { error: imageError } = await addColorImage(
              versionColorId,
              urlToAdd,
              displayOrder
            );

            if (imageError) {
              console.error("Error adding color image:", imageError);
            }
          }

          // Update display_order for existing images that were reordered
          const urlsToUpdate = newUrls.filter((url: string) => existingUrls.includes(url));
          if (urlsToUpdate.length > 0) {
            const imageUpdates = urlsToUpdate.map((url: string) => ({
              imageUrl: url,
              displayOrder: newUrls.indexOf(url)
            }));

            const { error: updateError } = await updateColorImagesOrder(imageUpdates);
            if (updateError) {
              console.error("Error updating color images order:", updateError);
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
  const authResult = await validateDelete();
  if ('error' in authResult) return authResult.error;

  const { id } = await params;

  const { error } = await deleteVersion(id);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
