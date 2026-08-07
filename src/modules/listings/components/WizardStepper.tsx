"use client";

import CheckIcon from "@mui/icons-material/Check";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import { tokens } from "@/theme/tokens";

import { totalSteps } from "../lib/stepRegistry";
import { usePublishWizard } from "./PublishWizardContext";

/** Numbered dot stepper (Figma): completed = gold + check, active = gold + number,
 *  upcoming = outlined + muted number. Completed dots are clickable to go back. */
export function WizardStepper() {
  const { stepIndex, gotoStep } = usePublishWizard();

  return (
    <Stack direction="row" alignItems="center" sx={{ mb: { xs: 3, md: 4 } }}>
      {Array.from({ length: totalSteps }).map((_, i) => {
        const done = i < stepIndex;
        const active = i === stepIndex;
        const filled = done || active;
        const clickable = i <= stepIndex;
        return (
          <Box
            key={i}
            sx={{ display: "flex", alignItems: "center", flex: i === totalSteps - 1 ? "0 0 auto" : 1 }}
          >
            <Box
              component={clickable ? "button" : "div"}
              type={clickable ? "button" : undefined}
              onClick={clickable ? () => gotoStep(i) : undefined}
              aria-label={`Paso ${i + 1}`}
              aria-current={active ? "step" : undefined}
              sx={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                p: 0,
                fontSize: 13,
                fontWeight: 600,
                cursor: clickable ? "pointer" : "default",
                bgcolor: filled ? tokens.colors.roti.main : tokens.colors.white,
                border: `1.5px solid ${filled ? tokens.colors.roti.main : tokens.colors.border}`,
                color: filled ? tokens.colors.white : tokens.colors.neutral,
              }}
            >
              {done ? <CheckIcon sx={{ fontSize: 16 }} /> : i + 1}
            </Box>
            {i < totalSteps - 1 ? (
              <Box
                sx={{
                  flex: 1,
                  mx: 0.5,
                  borderTop: "2px dashed",
                  borderColor: done ? tokens.colors.roti.light : tokens.colors.border,
                }}
              />
            ) : null}
          </Box>
        );
      })}
    </Stack>
  );
}
