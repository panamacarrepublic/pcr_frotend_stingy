"use client";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import { publicTokens as pt } from "@/theme/tokens";

import { CALENDAR_DAYS, type CalendarDay, type CalendarEvent } from "../lib/sectionsContent";
import { homeMessages } from "../messages";
import { SectionShell } from "./SectionShell";

const m = homeMessages.events;

function EventRow({ event, showAction }: { event: CalendarEvent; showAction: boolean }) {
  return (
    <>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1, sm: 3 }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        sx={{ py: 2 }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 72 }}>
          {event.time}
        </Typography>
        <Typography variant="h6" component="h4" color="brand.darker">
          {event.title}
        </Typography>
        <Chip
          size="small"
          icon={<PlaceOutlinedIcon sx={{ fontSize: 14, color: "inherit !important" }} />}
          label={event.location}
          sx={{
            borderRadius: 1,
            border: 1,
            borderColor: "divider",
            bgcolor: pt.colors.roti.lighter,
            color: "brand.darkest",
            typography: "caption",
            fontWeight: 600,
          }}
        />
        <Box sx={{ flexGrow: 1 }} />
        {showAction ? (
          <Button
            variant="soft"
            size="small"
            sx={{ flexShrink: 0 }}
            onClick={() => {
              // eslint-disable-next-line no-console -- placeholder until events exist
              console.log("[home] ver detalles del evento:", event.id);
            }}
          >
            {m.action}
          </Button>
        ) : null}
      </Stack>
      <Divider />
    </>
  );
}

function DayGroup({ day, showActions }: { day: CalendarDay; showActions: boolean }) {
  const [open, setOpen] = useState(true);
  const panelId = `eventos-${day.id}`;

  return (
    <Box component="section" aria-labelledby={`${panelId}-titulo`}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2 }}>
        <Typography id={`${panelId}-titulo`} variant="h5" component="h3" color="brand.darker">
          {day.label}
        </Typography>
        <IconButton
          aria-label={m.toggleDay}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((previous) => !previous)}
          sx={{
            color: "text.primary",
            transform: open ? "none" : "rotate(180deg)",
            transition: "transform 150ms",
          }}
        >
          <KeyboardArrowUpIcon />
        </IconButton>
      </Stack>

      <Collapse in={open} id={panelId}>
        <Box>
          {day.events.map((event) => (
            <EventRow key={event.id} event={event} showAction={showActions} />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}

/** "Calendario" of events (Figma 10928:9327). */
export function EventsCalendar() {
  return (
    <SectionShell bgcolor={pt.colors.roti.lightest}>
      <Stack spacing={8}>
        <Stack spacing={2} alignItems="center" textAlign="center" sx={{ maxWidth: pt.layout.maxWidthLarge, mx: "auto" }}>
          <Typography variant="body2" fontWeight={600} color="text.secondary">
            {m.tagline}
          </Typography>
          <Typography variant="h2" component="h2" color="brand.darker">
            {m.heading}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {m.lead}
          </Typography>
        </Stack>

        <Box>
          {CALENDAR_DAYS.map((day, index) => (
            // Figma leaves the first day's rows without a "Ver detalles" button.
            <DayGroup key={day.id} day={day} showActions={index > 0} />
          ))}
        </Box>
      </Stack>
    </SectionShell>
  );
}
