import { notFound } from "next/navigation";
import { getCarById } from "@/lib/supabase/queries";
import { adaptSupabaseCar } from "@/lib/supabase/adapters/cars";
import { ModelDetailClient } from "./model-detail-client";

export default async function ModelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch car from Supabase by ID
  const supabaseCar = await getCarById(id);
  if (!supabaseCar) return notFound();

  const car = adaptSupabaseCar(supabaseCar);

  return <ModelDetailClient initialCar={car} carId={id} />;
}
