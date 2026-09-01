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

/**
 * Right-hand side of the gold dashboard header: search field, `+ Nuevo`,
 * `Filters`, overflow menu (Figma node 10689-11715).
 *
 * All four are presentational for now. Worth knowing before wiring them: the
 * API has no text search at all, and `GET /listings/me` accepts only `cursor`
 * and `limit` — no filter parameters — so Search and Filters need backend work
 * before they can do anything, not just a click handler.
 */
export function InventoryHeaderActions() {
  return (
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          bgcolor: tokens.colors.whiteAlpha[20],
          borderRadius: `${tokens.radius.sm}px`,
          px: 1.5,
          py: 1,
          minWidth: { xs: 0, md: 240 },
        }}
      >
        <SearchIcon sx={{ fontSize: 18, color: tokens.colors.white }} />
        <InputBase
          placeholder={m.search}
          disabled
          inputProps={{ "aria-label": m.search }}
          sx={{
            color: tokens.colors.white,
            fontSize: "0.875rem",
            width: "100%",
            "& input::placeholder": { color: tokens.colors.whiteAlpha[60], opacity: 1 },
          }}
        />
      </Stack>

      <Button
        startIcon={<AddIcon />}
        disabled
        sx={{
          bgcolor: tokens.colors.roti.light,
          color: tokens.colors.white,
          textTransform: "none",
          borderRadius: `${tokens.radius.sm}px`,
          px: 2,
          "&:hover": { bgcolor: tokens.colors.roti.dark },
          "&.Mui-disabled": { bgcolor: tokens.colors.roti.light, color: tokens.colors.white, opacity: 0.7 },
        }}
      >
        {m.new}
      </Button>

      <Button
        startIcon={<TuneIcon />}
        disabled
        sx={{
          bgcolor: tokens.colors.whiteAlpha[20],
          color: tokens.colors.white,
          textTransform: "none",
          borderRadius: `${tokens.radius.sm}px`,
          px: 2,
          "&:hover": { bgcolor: tokens.colors.whiteAlpha[30] },
          "&.Mui-disabled": { bgcolor: tokens.colors.whiteAlpha[20], color: tokens.colors.white, opacity: 0.7 },
        }}
      >
        {m.filters}
      </Button>

      <IconButton aria-label={m.more} disabled sx={{ color: tokens.colors.white, "&.Mui-disabled": { color: tokens.colors.whiteAlpha[60] } }}>
        <MoreHorizIcon />
      </IconButton>
    </Stack>
  );
}
