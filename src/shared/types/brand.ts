/**
 * Tipo para las marcas de vehículos
 */
export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description?: string | null;
  website_url?: string | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}
