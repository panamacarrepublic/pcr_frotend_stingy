import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Image from "next/image";
import Link from "next/link";

import { publicTokens as pt } from "@/theme/tokens";

import { VERTICALS, type Vertical } from "../lib/content";
import { homeMessages } from "../messages";

const m = homeMessages.categories;

function CategoryCard({ vertical }: { vertical: Vertical }) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        pt: 2.5,
        px: 2.5,
        minHeight: { xs: 300, md: 500 },
        maxHeight: 500,
        overflow: "hidden",
        borderRadius: 1,
        bgcolor: vertical.surface,
        boxShadow: pt.shadows.small,
      }}
    >
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
        {/* The vertical's name is artwork in Figma; the link below carries the label. */}
        <Box sx={{ position: "relative", width: { xs: 130, md: 196 }, flexShrink: 0 }}>
          <Image
            src={vertical.labelSrc}
            alt=""
            aria-hidden
            width={vertical.labelWidth}
            height={vertical.labelHeight}
            style={{ width: "100%", height: "auto" }}
          />
        </Box>
        <IconButton
          component={Link}
          href={vertical.href}
          aria-label={`${m.cta}: ${vertical.label}`}
          sx={{
            width: 44,
            height: 44,
            borderRadius: 1,
            flexShrink: 0,
            bgcolor: vertical.accent,
            color: vertical.onAccent,
            boxShadow: pt.shadows.button,
            "&:hover": { bgcolor: vertical.accent, filter: "brightness(0.95)" },
          }}
        >
          <ArrowOutwardIcon />
        </IconButton>
      </Stack>

      <Box sx={{ position: "relative", flex: 1, minHeight: 0, mx: -2.5 }}>
        <Image
          src={vertical.mascotSrc}
          alt={vertical.mascotAlt}
          fill
          sizes="(max-width: 900px) 100vw, 33vw"
          style={{ objectFit: "cover", objectPosition: "top center" }}
        />
      </Box>
    </Box>
  );
}

/** The three vertical entry points under the hero (Figma 10167:12375). */
export function CategoryCards() {
  return (
    <Stack
      component="nav"
      aria-label={m.heading}
      direction={{ xs: "column", md: "row" }}
      spacing={2.5}
      alignItems="stretch"
    >
      {VERTICALS.map((vertical) => (
        <CategoryCard key={vertical.id} vertical={vertical} />
      ))}
    </Stack>
  );
}
