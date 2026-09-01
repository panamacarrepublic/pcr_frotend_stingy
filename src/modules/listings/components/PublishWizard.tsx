"use client";

import { useState } from "react";

import { useCreateListing } from "@/hooks/useCreateListing";

import { getListingErrorMessage } from "../api/errors";
import type { ListingResponse } from "../api/types";
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
  const [published, setPublished] = useState<ListingResponse | null>(null);
  const [method, setMethod] = useState<UploadMethod | null>(null);
  const createListing = useCreateListing();

  const handleSubmit = async (payload: ListingCreatePayload) => {
    // mutateAsync rejects on failure; swallowing it here would advance the
    // wizard to the success screen on a listing that was never created.
    const listing = await createListing.mutateAsync(payload);
    setPublished(listing);
  };

  if (published) return <SuccessStep onClose={onClose} listing={published} />;

  if (variant === "business" && method === null) {
    return <MethodSelectStep onNext={(m) => setMethod(m)} onClose={onClose} />;
  }

  return (
    <PublishWizardProvider
      variant={variant}
      onSubmit={handleSubmit}
      onRequestClose={onClose}
      submitError={
        createListing.error ? getListingErrorMessage(createListing.error) : null
      }
    >
      <WizardBody />
    </PublishWizardProvider>
  );
}
