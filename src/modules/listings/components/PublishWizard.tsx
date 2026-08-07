"use client";

import { useState } from "react";

import { useCreateListing } from "@/hooks/useCreateListing";

import type { ListingCreatePayload } from "../lib/toListingCreatePayload";
import {
  PublishWizardProvider,
  usePublishWizard,
  type UploadMethod,
  type WizardVariant,
} from "./PublishWizardContext";
import { MethodSelectStep } from "./steps/MethodSelectStep";
import { CategoryStep } from "./steps/CategoryStep";
import { DescriptionStep } from "./steps/DescriptionStep";
import { PhotosStep } from "./steps/PhotosStep";
import { PreviewStep } from "./steps/PreviewStep";
import { SuccessStep } from "./steps/SuccessStep";
import { VehicleBasicsStep } from "./steps/VehicleBasicsStep";
import { VehicleSpecsStep } from "./steps/VehicleSpecsStep";

/** Maps the active step id to its component (data-driven order lives in stepRegistry). */
function WizardBody() {
  const { step } = usePublishWizard();
  switch (step.id) {
    case "category":
      return <CategoryStep />;
    case "basics":
      return <VehicleBasicsStep />;
    case "specs":
      return <VehicleSpecsStep />;
    case "description":
      return <DescriptionStep />;
    case "photos":
      return <PhotosStep />;
    case "preview":
      return <PreviewStep />;
    default:
      return null;
  }
}

interface PublishWizardProps {
  onClose: () => void;
  variant?: WizardVariant;
}

export function PublishWizard({ onClose, variant = "particular" }: PublishWizardProps) {
  const [done, setDone] = useState(false);
  const [method, setMethod] = useState<UploadMethod | null>(null);
  const createListing = useCreateListing();

  const handleSubmit = async (payload: ListingCreatePayload) => {
    await createListing.mutateAsync(payload);
    setDone(true);
  };

  if (done) return <SuccessStep onClose={onClose} />;

  if (variant === "business" && method === null) {
    return <MethodSelectStep onNext={(m) => setMethod(m)} onClose={onClose} />;
  }

  return (
    <PublishWizardProvider variant={variant} onSubmit={handleSubmit} onRequestClose={onClose}>
      <WizardBody />
    </PublishWizardProvider>
  );
}
