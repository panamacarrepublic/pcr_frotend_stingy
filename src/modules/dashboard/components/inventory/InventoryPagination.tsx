"use client";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { tokens } from "@/theme/tokens";

import { inventoryMessages } from "./messages";

const m = inventoryMessages.pagination;

interface Props {
  pageIndex: number;
  pageCount: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isLoadingMore: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onGoToPage: (index: number) => void;
}

/**
 * Table footer: `< Antes` on the left, page numbers centred, `Siguiente >` on
 * the right (Figma node 10689-11715).
 *
 * The numbers cover the pages fetched so far rather than the whole result set —
 * the API is cursor-paginated and reports no total, so a page that has never
 * been walked to has no cursor to jump with. See `useInventoryPages`.
 */
export function InventoryPagination({
  pageIndex,
  pageCount,
  canGoPrevious,
  canGoNext,
  isLoadingMore,
  onPrevious,
  onNext,
  onGoToPage,
}: Props) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ px: 2, py: 1.5, gap: 2 }}
    >
      <Button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        startIcon={<ChevronLeftIcon />}
        sx={{
          minWidth: 104,
          color: "text.primary",
          bgcolor: tokens.colors.foreground,
          borderRadius: `${tokens.radius.sm}px`,
          textTransform: "none",
          "&:hover": { bgcolor: tokens.colors.thunderLightest },
          "&.Mui-disabled": { color: tokens.colors.neutral, bgcolor: tokens.colors.foreground },
        }}
      >
        {m.previous}
      </Button>

      <Stack direction="row" alignItems="center" spacing={0.5} component="nav" aria-label={m.page}>
        {Array.from({ length: pageCount }, (_, index) => {
          const isCurrent = index === pageIndex;
          return (
            <Box
              key={index}
              component="button"
              type="button"
              onClick={() => onGoToPage(index)}
              aria-current={isCurrent ? "page" : undefined}
              aria-label={`${m.page} ${index + 1}`}
              sx={{
                minWidth: 32,
                height: 32,
                px: 1,
                cursor: "pointer",
                font: "inherit",
                fontSize: "0.875rem",
                fontWeight: isCurrent ? 600 : 400,
                color: "text.primary",
                borderRadius: `${tokens.radius.sm}px`,
                border: isCurrent ? `1px solid ${tokens.colors.border}` : "1px solid transparent",
                bgcolor: isCurrent ? tokens.colors.white : "transparent",
                "&:hover": { bgcolor: tokens.colors.foreground },
              }}
            >
              {index + 1}
            </Box>
          );
        })}
      </Stack>

      <Button
        onClick={onNext}
        disabled={!canGoNext || isLoadingMore}
        endIcon={<ChevronRightIcon />}
        sx={{
          minWidth: 104,
          color: "text.primary",
          bgcolor: tokens.colors.foreground,
          borderRadius: `${tokens.radius.sm}px`,
          textTransform: "none",
          "&:hover": { bgcolor: tokens.colors.thunderLightest },
          "&.Mui-disabled": { color: tokens.colors.neutral, bgcolor: tokens.colors.foreground },
        }}
      >
        {m.next}
      </Button>
    </Stack>
  );
}
