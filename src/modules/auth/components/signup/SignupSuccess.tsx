"use client";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";

import { tokens } from "@/theme/tokens";

import type { SignupVariantStyle } from "./variants";

/**
 * Confirmation shown after a successful submit.
 *
 * Figma has a fuller "¡CUENTA CREADA CON ÉXITO!" screen with the PCR mascot,
 * plus a whole verification flow behind it (phone, identity, and a plan picker
 * for businesses). None of that is built here — this is the end of the form,
 * not the end of the journey.
 */
export function SignupSuccess({ style }: { style: SignupVariantStyle }) {
  return (
    <Stack spacing={2} alignItems="center" sx={{ textAlign: "center", py: 6 }}>
      <CheckCircleOutlineIcon sx={{ fontSize: 64, color: style.text }} />
      <Typography variant="h4" sx={{ color: style.text, textTransform: "uppercase" }}>
        ¡Cuenta creada con éxito!
      </Typography>
      <Typography variant="body1" sx={{ color: style.mutedText, maxWidth: 420 }}>
        Revisa tu correo para confirmar tu cuenta. Después podrás iniciar sesión.
      </Typography>
      <Button
        component={Link}
        href="/login"
        sx={{
          mt: 1,
          px: 4,
          py: 1.25,
          borderRadius: `${tokens.radius.md}px`,
          bgcolor: style.submitBg,
          color: style.submitText,
          "&:hover": { bgcolor: style.submitHoverBg },
        }}
      >
        Inicia Sesión
      </Button>
    </Stack>
  );
}
