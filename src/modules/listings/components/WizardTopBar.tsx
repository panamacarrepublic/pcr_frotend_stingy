"use client";

import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { tokens } from "@/theme/tokens";

import { listingMessages } from "../messages";
import { usePublishWizard } from "./PublishWizardContext";

/** Top-right "Guardar Borrador" action, present on every editable step. */
export function WizardTopBar() {
  const { saveDraft } = usePublishWizard();
  return (
    <Stack direction="row" justifyContent="flex-end" sx={{ mb: { xs: 1, md: 2 } }}>
      <Button
        startIcon={<SaveOutlinedIcon />}
        onClick={saveDraft}
        sx={{
          bgcolor: tokens.colors.foreground,
          color: tokens.colors.neutralDarkest,
          borderRadius: `${tokens.radius.md}px`,
          px: 2,
          fontWeight: 600,
          "&:hover": { bgcolor: tokens.colors.thunderLightest },
        }}
      >
        {listingMessages.nav.saveDraft}
      </Button>
    </Stack>
  );
}
