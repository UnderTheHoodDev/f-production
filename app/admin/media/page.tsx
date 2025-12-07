import { redirect } from "next/navigation";

export default function MediaPage() {
  // Redirect to images page by default
  redirect("/admin/media/images");
}

