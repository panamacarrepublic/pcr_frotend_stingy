"use client";

import type { InputBaseComponentProps } from "@mui/material/InputBase";
import TextField from "@mui/material/TextField";
import { Controller, type FieldPath, type FieldValues, useFormContext } from "react-hook-form";

import { FieldShell } from "./FieldShell";
import { inputSx } from "./fieldStyles";

interface RhfTextFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  info?: string | boolean;
  type?: "text" | "email" | "tel";
  multiline?: boolean;
  minRows?: number;
  maxRows?: number;
  inputMode?: InputBaseComponentProps["inputMode"];
  maxLength?: number;
}

/** RHF ↔ MUI adapter for single/multi-line text, with the Figma "label on top" layout. */
export function RhfTextField<T extends FieldValues>({
  name,
  label,
  placeholder,
  info,
  type = "text",
  multiline,
  minRows,
  maxRows,
  inputMode,
  maxLength,
}: RhfTextFieldProps<T>) {
  const { control } = useFormContext<T>();
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
            placeholder={placeholder}
            type={type}
            multiline={multiline}
            minRows={minRows}
            maxRows={maxRows}
            fullWidth
            size="small"
            error={!!fieldState.error}
            inputProps={{ inputMode, maxLength }}
            sx={inputSx}
          />
        </FieldShell>
      )}
    />
  );
}
