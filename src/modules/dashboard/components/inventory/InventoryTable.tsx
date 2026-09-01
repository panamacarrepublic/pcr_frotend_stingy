"use client";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import { listingPrice, type ListingSummary } from "@/modules/listings/api/types";
import { tokens } from "@/theme/tokens";

import { CategoryBadge } from "./CategoryBadge";
import { inventoryMessages } from "./messages";

const m = inventoryMessages;

const priceFormat = new Intl.NumberFormat("es-PA", {
  style: "currency",
  currency: "USD",
});

/** Figma shows MM/DD/YYYY. `created_at` is ISO 8601 with an offset. */
const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "2-digit",
  day: "2-digit",
  year: "numeric",
});

function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "—" : dateFormat.format(date);
}

function formatPrice(listing: ListingSummary): string {
  const value = listingPrice(listing);
  // price is a decimal-as-string over the wire; a malformed one shouldn't render "NaN".
  return Number.isFinite(value) ? priceFormat.format(value) : "—";
}

/**
 * The design's "ID de Producto" column shows a `PRD-2024-007629` style code.
 * No such field exists on the API — `ListingSummary` carries only a UUID — so
 * we surface a readable prefix of the real id rather than invent a code.
 */
function shortId(id: string): string {
  return id.replace(/-/g, "").slice(0, 8);
}

const cellSx = { borderBottom: `1px solid ${tokens.colors.foreground}`, py: 1.5 };

/** Column header with the design's sort arrow. */
function HeaderCell({ label, align }: { label: string; align?: "right" }) {
  return (
    <TableCell sx={{ ...cellSx, textAlign: align }}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.5}
        sx={{ justifyContent: align === "right" ? "flex-end" : "flex-start" }}
      >
        <Typography component="span" variant="body2" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
        {/* Decorative: the API exposes no sort parameter — the feed is always
            created_at DESC — so these arrows indicate the fixed order only. */}
        <ArrowDownwardIcon aria-hidden sx={{ fontSize: 14, color: tokens.colors.neutral }} />
      </Stack>
    </TableCell>
  );
}

interface Props {
  items: ListingSummary[];
  selectedIds: string[];
  onToggleRow: (id: string) => void;
  onToggleAll: () => void;
}

export function InventoryTable({ items, selectedIds, onToggleRow, onToggleAll }: Props) {
  const allSelected = items.length > 0 && selectedIds.length === items.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  return (
    <Table sx={{ minWidth: 760 }}>
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox" sx={cellSx}>
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected}
              onChange={onToggleAll}
              inputProps={{ "aria-label": m.selectAll }}
              size="small"
            />
          </TableCell>
          <HeaderCell label={m.columns.date} />
          <HeaderCell label={m.columns.productId} />
          <HeaderCell label={m.columns.name} />
          <HeaderCell label={m.columns.category} />
          <HeaderCell label={m.columns.price} align="right" />
          {/* Actions column: unlabelled in the design. */}
          <TableCell sx={cellSx} />
        </TableRow>
      </TableHead>

      <TableBody>
        {items.map((listing) => {
          const isSelected = selectedIds.includes(listing.id);
          return (
            <TableRow
              key={listing.id}
              selected={isSelected}
              sx={{
                cursor: "pointer",
                "&:hover": { bgcolor: tokens.colors.foreground },
                "&.Mui-selected, &.Mui-selected:hover": { bgcolor: tokens.colors.azul.lightest },
              }}
            >
              <TableCell padding="checkbox" sx={cellSx}>
                <Checkbox
                  checked={isSelected}
                  onChange={() => onToggleRow(listing.id)}
                  inputProps={{ "aria-label": `${m.selectRow}: ${listing.title}` }}
                  size="small"
                />
              </TableCell>

              <TableCell sx={cellSx}>
                <Typography variant="body2">{formatDate(listing.created_at)}</Typography>
              </TableCell>

              <TableCell sx={cellSx}>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
                >
                  {shortId(listing.id)}
                </Typography>
              </TableCell>

              <TableCell sx={{ ...cellSx, maxWidth: 220 }}>
                <Typography
                  variant="body2"
                  sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                  title={listing.title}
                >
                  {listing.title}
                </Typography>
              </TableCell>

              <TableCell sx={cellSx}>
                <CategoryBadge status={listing.status} />
              </TableCell>

              <TableCell sx={{ ...cellSx, textAlign: "right" }}>
                <Typography variant="body2">{formatPrice(listing)}</Typography>
              </TableCell>

              <TableCell sx={{ ...cellSx, width: 96 }}>
                <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                  {/* Both actions are intentionally inert for now — edit and
                      delete flows land with the listing detail work. */}
                  <IconButton size="small" aria-label={m.rowActions.settings} disabled>
                    <SettingsIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    aria-label={m.rowActions.delete}
                    disabled
                    sx={{
                      borderRadius: `${tokens.radius.sm}px`,
                      bgcolor: tokens.colors.naranja.main,
                      color: tokens.colors.white,
                      "&:hover": { bgcolor: tokens.colors.naranja.darkest },
                      "&.Mui-disabled": {
                        bgcolor: tokens.colors.naranja.main,
                        color: tokens.colors.white,
                        opacity: 0.55,
                      },
                    }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
