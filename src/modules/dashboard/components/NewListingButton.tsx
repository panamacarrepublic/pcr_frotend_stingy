"use client";

import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import { useState } from "react";

import { PublishListingDialog } from "@/modules/listings/components/PublishListingDialog";
import { tokens } from "@/theme/tokens";

export function NewListingButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
        sx={{
          bgcolor: tokens.colors.thunder,
          color: tokens.colors.white,
          borderRadius: "12px",
          px: "20px",
          py: "8px",
          fontWeight: 500,
          "&:hover": { bgcolor: tokens.colors.neutralDarker },
        }}
      >
        Nuevo Anuncio
      </Button>
      <PublishListingDialog open={open} onClose={() => setOpen(false)} variant="business" />
    </>
  );
}
