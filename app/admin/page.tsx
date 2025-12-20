import { redirect } from "next/navigation";

export default function AdminRootPage() {
  // Redirect a /admin/autos
  redirect("/admin/autos");
}
