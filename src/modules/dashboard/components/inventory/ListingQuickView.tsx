"use client";

import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Link from "next/link";

import { useListing } from "@/hooks/useListing";
import {
  READ_ONLY_STATUSES,
  type ListingStatus,
  type ListingSummary,
} from "@/modules/listings/api/types";
import { tokens } from "@/theme/tokens";

import { CategoryBadge } from "./CategoryBadge";
import { formatDate, formatPrice, shortId } from "./format";
import { inventoryMessages } from "./messages";

const m = inventoryMessages.quickView;

/** Why a listing cannot be edited, keyed by the statuses that reject a PATCH. */
const READ_ONLY_REASON: Partial<Record<ListingStatus, string>> = {
  sold: m.readOnly.sold,
  expired: m.readOnly.expired,
  rejected: m.readOnly.rejected,
};

interface Props {
  listing: ListingSummary;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
}

/**
 * "Detalles del Anuncio" — Figma node 10689:14128, opened by the gear button or
 * a row click. Slides in from the right over a backdrop, per the handover notes.
 *
 * Identity (title, price, id, date, cover) comes from the row that was clicked,
 * so the panel paints immediately; only the description needs the detail query,
 * because `ListingSummary` doesn't carry one.
 *
 * The design's "Performance (7 días)" block — views, messages, days to expiry —
 * is deliberately absent: the API has no field behind any of those three, and
 * inventing numbers on a seller's dashboard is worse than omitting the section.
 */
export function ListingQuickView({ listing, open, onClose, onEdit }: Props) {
  // Only fetched while the panel is open; the row already has everything else.
  const detail = useListing(open ? listing.id : undefined);
  const readOnlyReason = READ_ONLY_REASON[listing.status];
  const isReadOnly = READ_ONLY_STATUSES.includes(listing.status);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: "100%", sm: 545 }, maxWidth: "100%", p: { xs: 3, sm: 6 } },
      }}
    >
      <Stack spacing={2.5}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
          <Typography variant="h3" sx={{ textTransform: "uppercase" }}>
            {m.title}
          </Typography>
          <IconButton aria-label={m.close} onClick={onClose} sx={{ mt: -1, mr: -1 }}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5} alignItems="center">
          <Box
            sx={{
              position: "relative",
              width: { xs: "100%", sm: 243 },
              height: 203,
              flexShrink: 0,
              borderRadius: `${tokens.radius.md}px`,
              overflow: "hidden",
              bgcolor: tokens.colors.foreground,
            }}
          >
            {listing.cover_photo ? (
              <Image
                src={listing.cover_photo}
                alt={listing.title}
                fill
                sizes="243px"
                style={{ objectFit: "cover" }}
                unoptimized
              />
            ) : null}
          </Box>

          <Stack spacing={0.5} sx={{ minWidth: 0, alignSelf: { sm: "center" } }}>
            <Box>
              <CategoryBadge status={listing.status} />
            </Box>
            <Typography variant="h6">{listing.title}</Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: tokens.colors.neutralDark }}>
              {`${m.idPrefix} ${shortId(listing.id)}`}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {formatPrice(listing.price)}
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: tokens.colors.neutral }}>
              {`${m.published} ${formatDate(listing.created_at)}`}
            </Typography>
          </Stack>
        </Stack>

        <Divider />

        <Box>
          <Typography variant="h6" gutterBottom>
            {m.description}
          </Typography>
          <Typography variant="body1" sx={{ color: detail.data?.description ? undefined : "text.secondary" }}>
            {detail.isLoading
              ? m.loading
              : (detail.data?.description ?? m.noDescription)}
          </Typography>
        </Box>

        <Divider />

        {readOnlyReason ? (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {readOnlyReason}
          </Typography>
        ) : null}

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
          <Button
            component={Link}
            href={`/listings/${listing.id}`}
            target="_blank"
            rel="noopener noreferrer"
            fullWidth
            sx={{
              bgcolor: tokens.colors.azul.lightest,
              color: tokens.colors.neutralDarkest,
              "&:hover": { bgcolor: tokens.colors.azul.lighter },
            }}
          >
            {m.viewPublic}
          </Button>
          <Button
            onClick={onEdit}
            disabled={isReadOnly}
            fullWidth
            sx={{
              bgcolor: tokens.colors.amarilloVibrante.light,
              color: tokens.colors.neutralDarker,
              "&:hover": { bgcolor: tokens.colors.roti.light },
            }}
          >
            {m.editFull}
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}
