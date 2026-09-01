"use client";

import InputAdornment from "@mui/material/InputAdornment";
import type { InputBaseComponentProps } from "@mui/material/InputBase";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

import { listingMessages } from "../../messages";
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
  /** Appends the design's `*` to the label. Only for genuinely required fields. */
  required?: boolean;
  /** Fixed text before the value, e.g. the price field's currency symbol. */
  prefix?: string;
  /** Trailing affordance icon, e.g. the edit pencil on the title field. */
  endIcon?: ReactNode;
  /** Renders "<len>/<maxLength> caracteres" under the field. Needs maxLength. */
  counter?: boolean;
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
  required,
  prefix,
  endIcon,
  counter,
}: RhfTextFieldProps<T>) {
  const { control } = useFormContext<T>();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FieldShell
          label={label}
          info={info}
          required={required}
          error={fieldState.error?.message}
          htmlFor={name}
        >
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
            InputProps={{
              startAdornment: prefix ? (
                <InputAdornment position="start">{prefix}</InputAdornment>
              ) : undefined,
              endAdornment: endIcon ? (
                <InputAdornment position="end">{endIcon}</InputAdornment>
              ) : undefined,
            }}
            sx={inputSx}
          />
          {counter && maxLength ? (
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {listingMessages.edit.counter
                .replace("{n}", String(String(field.value ?? "").length))
                .replace("{max}", String(maxLength))}
            </Typography>
          ) : null}
        </FieldShell>
      )}
    />
  );
}
