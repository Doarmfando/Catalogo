/**
 * Queries de administración para usuarios
 * Usa service role para bypassar RLS
 */

import { createAdminClient } from "@/lib/supabase/admin";

export async function getAllUsers() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }

  return data || [];
}

export async function getUserById(userId: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  return data;
}
