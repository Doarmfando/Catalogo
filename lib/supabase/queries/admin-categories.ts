import { createClient } from "@/lib/supabase/server";

export async function getAllCategoriesAdmin() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select(`
      *,
      cars (count)
    `)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data || [];
}

export async function getCategoryByIdAdmin(categoryId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", categoryId)
    .single();

  if (error) {
    console.error("Error fetching category:", error);
    return null;
  }

  return data;
}

export async function createCategory(categoryData: {
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .insert([categoryData])
    .select()
    .single();

  if (error) {
    console.error("Error creating category:", error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function updateCategory(
  categoryId: string,
  categoryData: {
    name?: string;
    slug?: string;
    description?: string | null;
    image_url?: string | null;
  }
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .update(categoryData)
    .eq("id", categoryId)
    .select()
    .single();

  if (error) {
    console.error("Error updating category:", error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function deleteCategory(categoryId: string) {
  const supabase = await createClient();

  // First check if there are any cars associated with this category
  const { count, error: countError } = await supabase
    .from("cars")
    .select("*", { count: "exact", head: true })
    .eq("category_id", categoryId);

  if (countError) {
    console.error("Error checking category usage:", countError);
    return { error: "Error al verificar el uso de la categoría" };
  }

  if (count && count > 0) {
    return {
      error: `No se puede eliminar la categoría porque tiene ${count} auto${count > 1 ? "s" : ""} asociado${count > 1 ? "s" : ""}`,
    };
  }

  // If no cars are associated, proceed with deletion
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId);

  if (error) {
    console.error("Error deleting category:", error);
    return { error: error.message };
  }

  return { error: null };
}

/**
 * Verifica si existe una categoría con el mismo nombre
 */
export async function checkCategoryNameExists(name: string, excludeId?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("categories")
    .select("id, name")
    .ilike("name", name);

  // Si estamos editando, excluir el ID actual
  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error checking category name:", error);
    return { exists: false, error: error.message };
  }

  return { exists: data && data.length > 0, error: null };
}
