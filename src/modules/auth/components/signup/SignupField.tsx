"use client";

import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";

import { tokens } from "@/theme/tokens";

import type { SignupVariantStyle } from "./variants";

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  style: SignupVariantStyle;
  placeholder?: string;
  /** Renders the design's `*`. Only for fields the schema actually requires. */
  required?: boolean;
  type?: "text" | "email" | "password" | "tel";
  autoComplete?: string;
  hint?: string;
  multiline?: boolean;
  minRows?: number;
  /** Non-empty turns the control into a select. */
  options?: readonly string[];
}

/**
 * Label above the control, hint under the label, error under the control —
 * the field layout both sign-up frames use. Colours come from the variant so
 * the same field works on the cream and the gold panel.
 */
export function SignupField<T extends FieldValues>({
  control,
  name,
  label,
  style,
  placeholder,
  required,
  type = "text",
  autoComplete,
  hint,
  multiline,
  minRows,
  options,
}: Props<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Stack spacing={0.5}>
          <Typography
            component="label"
            htmlFor={name}
            variant="body2"
            sx={{ fontWeight: 600, color: style.text }}
          >
            {required ? `${label}*` : label}
          </Typography>
          {hint ? (
            <Typography variant="caption" sx={{ color: style.mutedText }}>
              {hint}
            </Typography>
          ) : null}
          <TextField
            {...field}
            id={name}
            value={field.value ?? ""}
            select={Boolean(options)}
            SelectProps={options ? { displayEmpty: true } : undefined}
            placeholder={placeholder}
            type={type}
            autoComplete={autoComplete}
            multiline={multiline}
            minRows={minRows}
            fullWidth
            size="small"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: style.fieldBg,
                borderRadius: `${tokens.radius.md}px`,
                color: style.text,
              },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: style.fieldBorder },
              "& .MuiSelect-icon": { color: style.text },
              "& input::placeholder, & textarea::placeholder": {
                color: style.placeholder,
                opacity: 1,
              },
            }}
          >
            {options
              ? [
                  <MenuItem key="__placeholder" value="" disabled>
                    {placeholder}
                  </MenuItem>,
                  ...options.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  )),
                ]
              : null}
          </TextField>
        </Stack>
      )}
    />
  );
}
