"use client";

import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Stack from "@mui/material/Stack";

import { tokens } from "@/theme/tokens";

import { inventoryMessages } from "./messages";

const m = inventoryMessages;

/** Figma uses 12px radius for the mobile controls, 4px for the desktop row. */
const controlRadius = {
  xs: `${tokens.radius.lg}px`,
  md: `${tokens.radius.sm}px`,
};

/** Both filled buttons share everything but their fill. */
const buttonSx = {
  color: tokens.colors.white,
  textTransform: "none",
  borderRadius: controlRadius,
  px: 2.5,
  py: 1,
  "&.Mui-disabled": { color: tokens.colors.white, opacity: 0.7 },
} as const;

/**
 * Right-hand side of the gold dashboard header: search field, `+ Nuevo`,
 * `Filters`, overflow menu (Figma nodes 10689-11715 desktop, 11010:15117 mobile).
 *
 * Below `md` the four controls stack to full width and `Filters` shares a row
 * with the overflow button, which is what the mobile design specifies — a
 * horizontal row of four would either overflow a 375px viewport or shrink the
 * search field to uselessness.
 *
 * All four are presentational for now. Worth knowing before wiring them: the
 * API has no text search at all, and `GET /listings/me` accepts only `cursor`
 * and `limit` — no filter parameters — so Search and Filters need backend work
 * before they can do anything, not just a click handler.
 */
export function InventoryHeaderActions() {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      alignItems={{ xs: "stretch", md: "center" }}
      spacing={{ xs: 2.5, md: 1.5 }}
      sx={{ width: { xs: "100%", md: "auto" } }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{
          bgcolor: tokens.colors.whiteAlpha[10],
          border: `1px solid ${tokens.colors.whiteAlpha[20]}`,
          borderRadius: controlRadius,
          px: 1.5,
          py: 1,
          minWidth: { xs: 0, md: 240 },
        }}
      >
        <SearchIcon sx={{ color: tokens.colors.white }} />
        <InputBase
          placeholder={m.search}
          disabled
          inputProps={{ "aria-label": m.search }}
          sx={{
            color: tokens.colors.white,
            width: "100%",
            "& input::placeholder": { color: tokens.colors.whiteAlpha[60], opacity: 1 },
          }}
        />
      </Stack>

      <Button
        startIcon={<AddIcon />}
        disabled
        sx={{
          ...buttonSx,
          bgcolor: tokens.colors.roti.main,
          "&:hover": { bgcolor: tokens.colors.roti.dark },
          "&.Mui-disabled": { ...buttonSx["&.Mui-disabled"], bgcolor: tokens.colors.roti.main },
        }}
      >
        {m.new}
      </Button>

      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ width: { xs: "100%", md: "auto" } }}
      >
        <Button
          startIcon={<TuneIcon />}
          disabled
          sx={{
            ...buttonSx,
            flex: { xs: 1, md: "0 0 auto" },
            bgcolor: tokens.colors.whiteAlpha[10],
            "&:hover": { bgcolor: tokens.colors.whiteAlpha[20] },
            "&.Mui-disabled": {
              ...buttonSx["&.Mui-disabled"],
              bgcolor: tokens.colors.whiteAlpha[10],
            },
          }}
        >
          {m.filters}
        </Button>

        <IconButton
          aria-label={m.more}
          disabled
          sx={{
            borderRadius: controlRadius,
            color: tokens.colors.white,
            "&.Mui-disabled": { color: tokens.colors.whiteAlpha[60] },
          }}
        >
          <MoreHorizIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
}
