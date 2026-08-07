"use client";

import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { Controller, type FieldPath, type FieldValues, useFormContext } from "react-hook-form";

import type { SelectOption } from "../../constants";
import { listingMessages } from "../../messages";
import { FieldShell } from "./FieldShell";
import { inputSx } from "./fieldStyles";

interface RhfSelectProps<T extends FieldValues> {
  name: FieldPath<T>;
  label?: string;
  info?: string | boolean;
  options: SelectOption[];
  placeholder?: string;
}

/** RHF ↔ MUI adapter for a single-choice dropdown with an empty placeholder. */
export function RhfSelect<T extends FieldValues>({
  name,
  label,
  info,
  options,
  placeholder,
}: RhfSelectProps<T>) {
  const { control } = useFormContext<T>();
  const ph = placeholder ?? listingMessages.fields.selectPlaceholder;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FieldShell label={label} info={info} error={fieldState.error?.message} htmlFor={name}>
          <TextField
            {...field}
            id={name}
            value={field.value ?? ""}
            select
            fullWidth
            size="small"
            error={!!fieldState.error}
            sx={inputSx}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value="" disabled>
              <Box component="span" sx={{ color: "text.secondary" }}>
                {ph}
              </Box>
            </MenuItem>
            {options.map((o) => (
              <MenuItem key={o.value} value={o.value}>
                {o.label}
              </MenuItem>
            ))}
          </TextField>
        </FieldShell>
      )}
    />
  );
}
