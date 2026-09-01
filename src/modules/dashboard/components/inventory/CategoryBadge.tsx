"use client";

import Box from "@mui/material/Box";

import type { ListingStatus } from "@/modules/listings/api/types";
import { tokens } from "@/theme/tokens";

import { inventoryMessages } from "./messages";

/**
 * Category pill with a status dot, per the Figma handover note
 * ("Badges de categoría con dot de estado").
 *
 * The label is fixed: `ListingSummary` carries no `category` field, and the API
 * only ever returns the cars vertical today. The dot is real — it reflects the
 * listing's actual `status`.
 */
const DOT_COLOR: Record<ListingStatus, string> = {
  active: tokens.colors.verde.main,
  draft: tokens.colors.neutral,
  pending_payment: tokens.colors.roti.main,
  paused: tokens.colors.roti.dark,
  sold: tokens.colors.azul.main,
  expired: tokens.colors.neutral,
  rejected: tokens.colors.naranja.main,
};

export function CategoryBadge({ status }: { status: ListingStatus }) {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        px: 1,
        py: 0.25,
        borderRadius: `${tokens.radius.sm}px`,
        border: `1px solid ${tokens.colors.border}`,
        bgcolor: tokens.colors.white,
        color: "text.primary",
        fontSize: "0.75rem",
        lineHeight: 1.5,
        whiteSpace: "nowrap",
      }}
    >
      {inventoryMessages.categoryLabel}
      <Box
        component="span"
        // The status is already conveyed in the row; the dot is decorative here.
        aria-hidden
        sx={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          bgcolor: DOT_COLOR[status] ?? tokens.colors.neutral,
          flexShrink: 0,
        }}
      />
    </Box>
  );
}
