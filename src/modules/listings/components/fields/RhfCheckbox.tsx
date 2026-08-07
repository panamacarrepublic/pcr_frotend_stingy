"use client";

import Checkbox from "@mui/material/Checkbox";
import { Controller, type FieldPath, type FieldValues, useFormContext } from "react-hook-form";

interface RhfCheckboxProps<T extends FieldValues> {
  name: FieldPath<T>;
  ariaLabel?: string;
}

/** RHF ↔ MUI adapter for a boolean checkbox. The visible label/card is composed by the caller. */
export function RhfCheckbox<T extends FieldValues>({ name, ariaLabel }: RhfCheckboxProps<T>) {
  const { control } = useFormContext<T>();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Checkbox
          checked={!!field.value}
          onChange={(e) => field.onChange(e.target.checked)}
          onBlur={field.onBlur}
          inputRef={field.ref}
          inputProps={{ "aria-label": ariaLabel }}
        />
      )}
    />
  );
}
