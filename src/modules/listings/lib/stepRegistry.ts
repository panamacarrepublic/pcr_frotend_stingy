import type { Path } from "react-hook-form";

import type { PublishListingForm } from "../schemas/listing.schema";

/** Illustration slot key (right panel of the wizard) — one PCR mascot per step. */
export type WizardIllustration = "welcome" | "vehicle" | "writing" | "camera" | "preview";

export type WizardStepId = "category" | "basics" | "specs" | "description" | "photos" | "preview";

export interface WizardStepMeta {
  id: WizardStepId;
  illustration: WizardIllustration;
  /** RHF paths validated (via `trigger`) before this step may advance. */
  fields: Path<PublishListingForm>[];
}

/**
 * Data-driven wizard config. The order here is the flow order; the stepper and
 * the step-advance validation both read from it, so adding/reordering steps is a
 * one-line change. Component wiring lives in PublishWizard (id → component map).
 */
export const wizardSteps: WizardStepMeta[] = [
  { id: "category", illustration: "welcome", fields: ["data.category"] },
  {
    id: "basics",
    illustration: "vehicle",
    fields: [
      "data.price",
      "data.vin_number",
      "data.make_id",
      "data.model_id",
      "data.mileage",
      "data.year",
    ],
  },
  {
    id: "specs",
    illustration: "vehicle",
    fields: [
      "data.vehicle_type",
      "data.fuel_type",
      "data.condition",
      "data.transmission_type",
      "data.province",
      "data.district",
    ],
  },
  { id: "description", illustration: "writing", fields: ["title", "description", "professional_photos"] },
  { id: "photos", illustration: "camera", fields: ["photos"] },
  { id: "preview", illustration: "preview", fields: [] },
];

export const totalSteps = wizardSteps.length;
