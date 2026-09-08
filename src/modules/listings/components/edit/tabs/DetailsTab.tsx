"use client";

import Box from "@mui/material/Box";
import { useEffect, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { useMakes } from "@/hooks/useMakes";
import { useModels } from "@/hooks/useModels";

import {
  fuelTypeLabels,
  toSelectOptions,
  transmissionLabels,
  vehicleTypeLabels,
} from "../../../constants";
import { listingMessages } from "../../../messages";
import { OTHER_MODEL } from "../../../schemas/vehicle.schema";
import { RhfSelect, RhfTextField } from "../../fields";

const f = listingMessages.fields;
const p = listingMessages.placeholders;

const vehicleTypeOptions = toSelectOptions(vehicleTypeLabels);
const fuelTypeOptions = toSelectOptions(fuelTypeLabels);
const transmissionOptions = toSelectOptions(transmissionLabels);

const gridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
  columnGap: 2,
  rowGap: 2.5,
} as const;

/** "Detalles del Producto": everything specific to the cars vertical. */
export function DetailsTab() {
  const { setValue } = useFormContext();
  const makeId = useWatch({ name: "data.make_id" }) as string | undefined;
  const modelId = useWatch({ name: "data.model_id" }) as string | undefined;

  const makes = useMakes();
  const models = useModels(makeId);

  // Clear the dependent model when the make changes. The ref guard skips the
  // first render so the listing's saved model survives the form opening.
  const prevMake = useRef(makeId);
  useEffect(() => {
    if (prevMake.current !== undefined && prevMake.current !== makeId) {
      setValue("data.model_id", "");
      setValue("data.model_text", "");
    }
    prevMake.current = makeId;
  }, [makeId, setValue]);

  const makeOptions = (makes.data ?? []).map((m) => ({ value: m.id, label: m.name }));
  const modelOptions = [
    ...(models.data ?? []).map((m) => ({ value: m.id, label: m.name })),
    { value: OTHER_MODEL, label: f.otherModel },
  ];

  return (
    <Box sx={gridSx}>
      <RhfSelect name="data.make_id" label={f.brand} options={makeOptions} placeholder={p.brand} />
      <RhfSelect
        name="data.model_id"
        label={f.model}
        options={modelOptions}
        placeholder={p.model}
      />
      {modelId === OTHER_MODEL && (
        <RhfTextField name="data.model_text" label={f.model} placeholder={p.modelText} />
      )}
      <RhfTextField name="data.year" label={f.year} placeholder={p.year} inputMode="numeric" maxLength={4} />
      <RhfTextField
        name="data.mileage"
        label={f.mileage}
        placeholder={p.mileage}
        inputMode="numeric"
      />
      <RhfTextField
        name="data.vin_number"
        label={f.vin}
        placeholder={p.vin}
        info="Número de identificación vehicular (hasta 17 caracteres)."
        maxLength={17}
      />
      <RhfSelect name="data.vehicle_type" label={f.vehicleType} options={vehicleTypeOptions} />
      <RhfSelect name="data.fuel_type" label={f.fuelType} options={fuelTypeOptions} />
      <RhfSelect
        name="data.transmission_type"
        label={f.transmission}
        options={transmissionOptions}
      />
    </Box>
  );
}
