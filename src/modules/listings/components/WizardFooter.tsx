"use client";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { tokens } from "@/theme/tokens";

import { listingMessages } from "../messages";
import { usePublishWizard } from "./PublishWizardContext";

/** Left = Cancelar (first step) / Atrás; Right = Siguiente. */
export function WizardFooter() {
  const { isFirst, goBack, goNext, requestClose } = usePublishWizard();
  const m = listingMessages.nav;
  return (
    <Stack direction="row" spacing={1.5} sx={{ mt: { xs: 3, md: 4 } }}>
      <Button
        variant="contained"
        onClick={isFirst ? requestClose : goBack}
        sx={{
          bgcolor: tokens.colors.neutral,
          color: tokens.colors.white,
          px: 3,
          "&:hover": { bgcolor: tokens.colors.neutralDark },
        }}
      >
        {isFirst ? m.cancel : m.back}
      </Button>
      <Button
        variant="contained"
        onClick={goNext}
        sx={{
          bgcolor: tokens.colors.roti.main,
          color: tokens.colors.white,
          px: 3,
          "&:hover": { bgcolor: tokens.colors.roti.dark },
        }}
      >
        {m.next}
      </Button>
    </Stack>
  );
}
