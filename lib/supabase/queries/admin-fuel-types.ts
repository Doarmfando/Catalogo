/**
 * Queries de administración para tipos de combustible
 * Usa service role para bypassar RLS
 */

import { createAdminClient } from "@/lib/supabase/admin";

export async function getAllFuelTypesAdmin() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("fuel_types")
    .select(`
      *,
      cars (count)
    `)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching fuel types:", error);
    return [];
  }

  return data || [];
}

export async function getFuelTypeByIdAdmin(fuelTypeId: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("fuel_types")
    .select("*")
    .eq("id", fuelTypeId)
    .single();

  if (error) {
    console.error("Error fetching fuel type:", error);
    return null;
  }

  return data;
}

export async function createFuelType(fuelTypeData: {
  name: string;
  slug: string;
}) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("fuel_types")
    .insert([fuelTypeData])
    .select()
    .single();

  if (error) {
    console.error("Error creating fuel type:", error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function updateFuelType(
  fuelTypeId: string,
  fuelTypeData: {
    name?: string;
    slug?: string;
  }
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("fuel_types")
    .update(fuelTypeData)
    .eq("id", fuelTypeId)
    .select()
    .single();

  if (error) {
    console.error("Error updating fuel type:", error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function deleteFuelType(fuelTypeId: string) {
  const supabase = createAdminClient();

  // First check if there are any cars associated with this fuel type
  const { count, error: countError } = await supabase
    .from("cars")
    .select("*", { count: "exact", head: true })
    .eq("fuel_type_id", fuelTypeId);

  if (countError) {
    console.error("Error checking fuel type usage:", countError);
    return { error: "Error al verificar el uso del tipo de combustible" };
  }

  if (count && count > 0) {
    return {
      error: `No se puede eliminar el tipo de combustible porque tiene ${count} auto${count > 1 ? "s" : ""} asociado${count > 1 ? "s" : ""}`,
    };
  }

  // If no cars are associated, proceed with deletion
  const { error } = await supabase
    .from("fuel_types")
    .delete()
    .eq("id", fuelTypeId);

  if (error) {
    console.error("Error deleting fuel type:", error);
    return { error: error.message };
  }

  return { error: null };
}

/**
 * Verifica si existe un tipo de combustible con el mismo nombre
 */
export async function checkFuelTypeNameExists(name: string, excludeId?: string) {
  const supabase = createAdminClient();

  let query = supabase
    .from("fuel_types")
    .select("id, name")
    .ilike("name", name);

  // Si estamos editando, excluir el ID actual
  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error checking fuel type name:", error);
    return { exists: false, error: error.message };
  }

  return { exists: data && data.length > 0, error: null };
}
