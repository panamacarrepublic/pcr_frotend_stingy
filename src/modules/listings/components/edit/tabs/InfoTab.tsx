"use client";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import { conditionLabels, provinceOptions, toSelectOptions } from "../../../constants";
import { listingMessages } from "../../../messages";
import { RhfSelect, RhfTextField } from "../../fields";

const f = listingMessages.fields;
const p = listingMessages.placeholders;

const conditionOptions = toSelectOptions(conditionLabels);

/** Mirrors `publishListingSchema.title.max(150)`. */
const TITLE_MAX = 150;

/** Two fields per row, matching the wizard's field grid. */
const gridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
  columnGap: 2,
  rowGap: 2.5,
} as const;

/** "Información": the cross-vertical fields that live on the listing itself. */
export function InfoTab() {
  return (
    <Stack spacing={2.5}>
      {/* The design caps the counter at 100, but the contract is 5..150 — the
          counter tracks the limit the API actually enforces. */}
      <RhfTextField
        name="title"
        label={f.title}
        placeholder={p.title}
        maxLength={TITLE_MAX}
        required
        counter
        endIcon={<EditOutlinedIcon fontSize="small" sx={{ color: "text.secondary" }} />}
      />
      <Box sx={gridSx}>
        <RhfTextField
          name="price"
          label={f.price}
          placeholder={p.price}
          inputMode="decimal"
          required
          prefix="$"
        />
        <RhfSelect name="condition" label={f.condition} options={conditionOptions} required />
        <RhfSelect name="province" label={f.province} options={provinceOptions} required />
        <RhfTextField name="district" label={f.district} placeholder={p.district} required />
      </Box>
      {/* No asterisk: the design marks Descripción as required, but the schema
          and the API both accept an empty one. */}
      <RhfTextField
        name="description"
        label={f.description}
        placeholder={p.description}
        multiline
        minRows={6}
      />
    </Stack>
  );
}
