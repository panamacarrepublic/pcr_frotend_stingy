"use client";

import Box from "@mui/material/Box";
import type { ReactNode } from "react";

import { StepHeading } from "./StepHeading";
import { WizardFooter } from "./WizardFooter";
import { WizardStepper } from "./WizardStepper";
import { WizardTopBar } from "./WizardTopBar";

interface StepFrameProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Optional element above the heading (e.g. the plans banner on step 1). */
  banner?: ReactNode;
  /** Left column content, below the heading (fields, options, cards). */
  left: ReactNode;
  /** Right column content (mascot illustration or the step's inputs). */
  right: ReactNode;
  /** Hide the Cancelar/Atrás/Siguiente footer (Preview renders its own actions). */
  hideFooter?: boolean;
}

/**
 * Shared two-column step scaffold: top bar + stepper + heading + left content +
 * footer in the left column, and `right` in the right column. Steps only supply
 * their slots; the stepper/footer/nav come from the wizard context.
 */
export function StepFrame({ eyebrow, title, subtitle, banner, left, right, hideFooter }: StepFrameProps) {
  return (
    <Box>
      <WizardTopBar />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: { xs: 4, md: 6 },
          alignItems: "start",
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <WizardStepper />
          {banner ? <Box sx={{ mb: 3 }}>{banner}</Box> : null}
          <StepHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
          <Box sx={{ mt: 3 }}>{left}</Box>
          {hideFooter ? null : <WizardFooter />}
        </Box>
        <Box sx={{ minWidth: 0 }}>{right}</Box>
      </Box>
    </Box>
  );
}
