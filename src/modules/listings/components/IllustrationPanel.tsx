import { MascotPanel } from "./MascotPanel";

import type { WizardIllustration } from "../lib/stepRegistry";

// Edwin's per-step mascot art, validated against Figma
// "02 - Formulario de Subir Anuncio / Empresa". form0 belongs to the business
// method-selection step (rendered by MethodSelectStep), not a numbered step.
const images: Record<WizardIllustration, string> = {
  welcome: "/images/dashboardForm/form1.png", // Category — shrug dog
  vehicle: "/images/dashboardForm/form2.png", // Basics/Specs — mechanic dog
  writing: "/images/dashboardForm/form3.png", // (not rendered today)
  camera: "/images/dashboardForm/form3.png", // (not rendered today)
  preview: "/images/dashboardForm/form4.png", // Preview — thumbs-up dog
};

export function IllustrationPanel({ variant }: { variant: WizardIllustration }) {
  return <MascotPanel src={images[variant]} />;
}
