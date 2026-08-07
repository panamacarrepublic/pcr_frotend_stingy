"use client";

import Box from "@mui/material/Box";
import Image from "next/image";

import { tokens } from "@/theme/tokens";

/** Rounded, framed mascot illustration used across the publish wizard.
 *  Hidden below md, matching the wizard's two-column steps. The panel is a
 *  square that fills its column (Figma: 616×616), capped so it never grows
 *  past the design size. */
export function MascotPanel({ src }: { src: string }) {
  return (
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: 616,
          aspectRatio: "1 / 1",
          borderRadius: `${tokens.radius.lg}px`,
          bgcolor: tokens.colors.roti.lighter,
          overflow: "hidden",
          p: 4,
        }}
      >
        <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
          <Image src={src} alt="" fill sizes="616px" style={{ objectFit: "contain" }} unoptimized />
        </Box>
      </Box>
    </Box>
  );
}
