"use client";

import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { Controller, type Control } from "react-hook-form";

import { SEARCH_VERTICAL_ORDER, getVertical } from "../../lib/content";
import type { SearchCriteria } from "../../schemas/search.schema";

/**
 * Figma draws the radio as an 18px rounded SQUARE with a white centre dot, not
 * MUI's circle — so the two states are supplied as explicit icons.
 */
const box = {
  width: 18,
  height: 18,
  borderRadius: 1,
  border: 1,
  display: "grid",
  placeItems: "center",
};

const UncheckedIcon = (
  <Box sx={{ ...box, borderColor: "divider", bgcolor: "action.hover" }} />
);

const CheckedIcon = (
  <Box sx={{ ...box, borderColor: "primary.main", bgcolor: "primary.main" }}>
    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "common.white" }} />
  </Box>
);

/** Picks which marketplace vertical the search applies to. */
export function VerticalRadioGroup({
  control,
  legend,
}: {
  control: Control<SearchCriteria>;
  legend: string;
}) {
  return (
    <Controller
      name="vertical"
      control={control}
      render={({ field }) => (
        <RadioGroup
          {...field}
          row
          aria-label={legend}
          sx={{ gap: { xs: 1, sm: 2.5 }, flexWrap: "wrap" }}
        >
          {SEARCH_VERTICAL_ORDER.map(getVertical).map((vertical) => (
            <FormControlLabel
              key={vertical.id}
              value={vertical.id}
              label={vertical.label}
              control={<Radio icon={UncheckedIcon} checkedIcon={CheckedIcon} />}
              sx={{
                m: 0,
                gap: 1.5,
                "& .MuiFormControlLabel-label": { typography: "body1", whiteSpace: "nowrap" },
              }}
            />
          ))}
        </RadioGroup>
      )}
    />
  );
}
