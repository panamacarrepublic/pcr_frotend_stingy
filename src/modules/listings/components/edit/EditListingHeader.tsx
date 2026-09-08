"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";

import { CategoryBadge } from "@/modules/dashboard/components/inventory/CategoryBadge";
import { tokens } from "@/theme/tokens";

import type { ListingResponse } from "../../api/types";
import { formatRelativeDate } from "../../lib/dates";
import { listingMessages } from "../../messages";

const m = listingMessages.edit;

/** Lowest `sort_order` wins, the same rule the feed uses for its cover. */
function coverPhoto(listing: ListingResponse): string | null {
  const [cover] = [...listing.photos].sort((a, b) => a.sort_order - b.sort_order);
  return cover?.url ?? null;
}

/**
 * Identity strip at the top of the edit modal: cover, category badge, title and
 * how long ago it was published.
 *
 * It exists so the seller can tell at a glance *which* listing they opened —
 * the modal is reached from a table of near-identical rows.
 */
export function EditListingHeader({ listing }: { listing: ListingResponse }) {
  const cover = coverPhoto(listing);

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5} alignItems="center">
      <Box
        sx={{
          position: "relative",
          width: { xs: "100%", sm: 170 },
          height: 170,
          flexShrink: 0,
          borderRadius: `${tokens.radius.md}px`,
          overflow: "hidden",
          bgcolor: tokens.colors.foreground,
        }}
      >
        {cover ? (
          <Image
            src={cover}
            alt={listing.title}
            fill
            sizes="170px"
            style={{ objectFit: "contain" }}
            unoptimized
          />
        ) : null}
      </Box>

      <Stack spacing={0.75} sx={{ minWidth: 0, alignSelf: { sm: "center" } }}>
        <Box>
          <CategoryBadge status={listing.status} />
        </Box>
        <Typography variant="h6">{listing.title}</Typography>
        <Typography variant="caption" sx={{ color: tokens.colors.neutral }}>
          {`${m.published} ${formatRelativeDate(listing.created_at)}`}
        </Typography>
      </Stack>
    </Stack>
  );
}
