import { redirect } from "next/navigation";

// UI-only flow: the app currently opens on the login screen. Once the real
// marketing home / auth gating exists, replace this redirect with the actual
// landing page (previous scaffold home is in git history).
export default function HomePage() {
  redirect("/login");
}
