"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import { conditionLabels, provinceOptions, toSelectOptions } from "../../../constants";
import { listingMessages } from "../../../messages";
import { RhfSelect, RhfTextField } from "../../fields";

const f = listingMessages.fields;
const p = listingMessages.placeholders;

const conditionOptions = toSelectOptions(conditionLabels);

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
      <RhfTextField name="title" label={f.title} placeholder={p.title} maxLength={150} />
      <Box sx={gridSx}>
        <RhfTextField name="price" label={f.price} placeholder={p.price} inputMode="decimal" />
        <RhfSelect name="condition" label={f.condition} options={conditionOptions} />
        <RhfSelect name="province" label={f.province} options={provinceOptions} />
        <RhfTextField name="district" label={f.district} placeholder={p.district} />
      </Box>
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
