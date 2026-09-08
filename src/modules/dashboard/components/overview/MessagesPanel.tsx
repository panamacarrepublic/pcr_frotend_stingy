"use client";
import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { tokens } from "@/theme/tokens";
import { MessageCard } from "@/modules/dashboard/components/overview/MessageCard";
import { ReviewCard } from "@/modules/dashboard/components/overview/ReviewCard";
import type { MessageItem, ReviewItem } from "@/modules/dashboard/types";

type TabKey = "todos" | "mensajes" | "comentarios";

export function MessagesPanel({
  messages,
  reviews,
}: {
  messages: MessageItem[];
  reviews: ReviewItem[];
}) {
  const [tab, setTab] = useState<TabKey>("todos");
  const [q, setQ] = useState("");

  const showMessages = tab !== "comentarios";
  const showReviews = tab !== "mensajes";
  const needle = q.trim().toLowerCase();

  const msgs = useMemo(
    () =>
      showMessages
        ? messages.filter(
            (m) =>
              !needle ||
              `${m.author} ${m.subject} ${m.snippet}`.toLowerCase().includes(needle),
          )
        : [],
    [showMessages, messages, needle],
  );

  const revs = useMemo(
    () =>
      showReviews
        ? reviews.filter((r) => !needle || r.productTitle.toLowerCase().includes(needle))
        : [],
    [showReviews, reviews, needle],
  );

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: 2,
        p: 1.75,
        boxShadow: tokens.shadows.raised,
        display: "flex",
        flexDirection: "column",
        gap: 1.25,
      }}
    >
      {/* Title */}
      <Typography
        variant="h6"
        sx={{ color: tokens.colors.neutralDarker, fontWeight: 400, lineHeight: 1.5 }}
      >
        Mensajes
      </Typography>

      {/* Tabs */}
      {/* Scrollable, not fixed: the three labels are wider than a 390px phone,
          and MUI's default variant clips the overflow instead of revealing it. */}
      <Tabs
        value={tab}
        onChange={(_, v: TabKey) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          minHeight: "unset",
          "& .MuiTab-root": {
            minHeight: 40,
            px: { xs: 1.25, md: 2 },
            py: 1.25,
            fontSize: "1rem",
            textTransform: "none",
            color: tokens.colors.thunder,
            borderRadius: 2,
          },
          "& .Mui-selected": {
            bgcolor: tokens.colors.roti.light,
            color: "text.primary",
            fontWeight: 700,
            border: `1px solid ${tokens.colors.cardBorder}`,
          },
          "& .MuiTabs-indicator": { display: "none" },
        }}
      >
        <Tab value="todos" label="Ver Todos" disableRipple />
        <Tab value="mensajes" label="Mensajes" disableRipple />
        <Tab value="comentarios" label="Comentarios" disableRipple />
      </Tabs>

      {/* Search */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 20, color: `rgba(6,6,7,0.6)` }} />
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            bgcolor: `rgba(6,6,7,0.05)`,
            "& fieldset": { borderColor: tokens.colors.cardBorder },
          },
          "& input::placeholder": { color: `rgba(6,6,7,0.6)`, opacity: 1 },
        }}
      />

      {/* Decorative select */}
      <Select
        value="todos"
        size="small"
        IconComponent={KeyboardArrowUpIcon}
        sx={{
          bgcolor: `rgba(255,255,255,0.05)`,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: tokens.colors.cardBorder,
          },
          fontSize: "1rem",
          color: tokens.colors.neutralDarkest,
        }}
      >
        <MenuItem value="todos">Todos los mensajes</MenuItem>
      </Select>

      {/* Card list */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {msgs.map((m) => (
          <MessageCard key={m.id} message={m} />
        ))}
        {revs.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
      </Box>
    </Box>
  );
}
