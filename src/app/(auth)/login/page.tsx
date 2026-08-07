import type { Metadata } from "next";

import LoginView from "@/modules/auth/components/LoginView";

export const metadata: Metadata = {
  title: "Iniciar sesión — Panama Car Republic",
  description: "Inicia sesión en Panama Car Republic para acceder a tu cuenta.",
};

export default function LoginPage() {
  return <LoginView />;
}
