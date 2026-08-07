"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";

import { tokens } from "@/theme/tokens";

import { listingMessages } from "../messages";
import { PublishWizard } from "./PublishWizard";
import type { WizardVariant } from "./PublishWizardContext";

interface PublishListingDialogProps {
  open: boolean;
  onClose: () => void;
  variant?: WizardVariant;
}

/** Full-screen host for the publish wizard, opened from NewListingButton. */
export function PublishListingDialog({ open, onClose, variant }: PublishListingDialogProps) {
  return (
    <Dialog fullScreen open={open} onClose={onClose} aria-label={listingMessages.dialog.title}>
      <Box sx={{ bgcolor: tokens.colors.canvas, minHeight: "100vh" }}>
        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
          <PublishWizard onClose={onClose} variant={variant} />
        </Container>
      </Box>
    </Dialog>
  );
}
