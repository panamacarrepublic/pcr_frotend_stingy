import type { Metadata } from "next";

import { SignupView } from "@/modules/auth/components/signup/SignupView";

export const metadata: Metadata = {
  title: "Regístrate — Panama Car Republic",
  description:
    "Crea tu cuenta particular o empresarial en Panama Car Republic y empieza a publicar.",
};

export default function RegistroPage() {
  return <SignupView />;
}
