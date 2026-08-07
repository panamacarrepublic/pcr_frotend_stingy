"use client";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { tokens } from "@/theme/tokens";

import { listingMessages } from "../../messages";

export function SuccessStep({ onClose }: { onClose: () => void }) {
  const s = listingMessages.success;
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={2}
      sx={{ minHeight: "60vh", textAlign: "center", px: 2 }}
    >
      <Box
        sx={{
          width: 96,
          height: 96,
          borderRadius: "50%",
          bgcolor: tokens.colors.verde.lightest,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CheckCircleOutlineIcon sx={{ fontSize: 56, color: tokens.colors.verde.main }} />
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        {s.title}
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 420 }}>
        {s.subtitle}
      </Typography>
      <Button
        variant="contained"
        onClick={onClose}
        sx={{
          mt: 1,
          bgcolor: tokens.colors.roti.main,
          color: tokens.colors.white,
          px: 3,
          "&:hover": { bgcolor: tokens.colors.roti.dark },
        }}
      >
        {s.cta}
      </Button>
    </Stack>
  );
}
