"use client";

import Box from "@mui/material/Box";

import {
  conditionLabels,
  fuelTypeLabels,
  provinceOptions,
  toSelectOptions,
  transmissionLabels,
  vehicleTypeLabels,
} from "../../constants";
import { listingMessages } from "../../messages";
import { RhfSelect, RhfTextField } from "../fields";
import { IllustrationPanel } from "../IllustrationPanel";
import { StepFrame } from "../StepFrame";

const f = listingMessages.fields;
const p = listingMessages.placeholders;

const gridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
  columnGap: 2,
  rowGap: 2.5,
} as const;

export function VehicleSpecsStep() {
  const s = listingMessages.steps.vehicle;
  return (
    <StepFrame
      eyebrow={s.eyebrow}
      title={s.title}
      subtitle={s.subtitle}
      right={<IllustrationPanel variant="vehicle" />}
      left={
        <Box sx={gridSx}>
          <RhfSelect name="data.vehicle_type" label={f.vehicleType} info options={toSelectOptions(vehicleTypeLabels)} />
          <RhfSelect name="data.fuel_type" label={f.fuelType} info options={toSelectOptions(fuelTypeLabels)} />
          <RhfSelect name="data.condition" label={f.condition} info options={toSelectOptions(conditionLabels)} />
          <RhfSelect
            name="data.transmission_type"
            label={f.transmission}
            info
            options={toSelectOptions(transmissionLabels)}
          />
          <RhfSelect name="data.province" label={f.province} info options={provinceOptions} />
          <RhfTextField name="data.district" label={f.district} placeholder={p.district} info />
        </Box>
      }
    />
  );
}
