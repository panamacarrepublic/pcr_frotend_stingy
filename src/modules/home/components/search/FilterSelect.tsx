"use client";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { Controller, type Control, type FieldPath } from "react-hook-form";

import type { SearchCriteria, SelectOption } from "../../schemas/search.schema";

interface FilterSelectProps {
  control: Control<SearchCriteria>;
  name: FieldPath<SearchCriteria>;
  label: string;
  placeholder: string;
  options: readonly SelectOption[];
  /** Figma separates the filters with a hairline, omitted after the last one. */
  divider?: boolean;
}

/**
 * One labelled dropdown in the hero filter row (Ubicación / Precio / Año).
 *
 * An empty value is a real, selectable state — it means "no filter" — so the
 * placeholder renders through `displayEmpty` rather than as a disabled option.
 */
export function FilterSelect({
  control,
  name,
  label,
  placeholder,
  options,
  divider = true,
}: FilterSelectProps) {
  const labelId = `filtro-${name}`;
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        // The hairline only separates filters once they sit side by side.
        pr: { sm: divider ? 1.25 : 0 },
        borderRight: { xs: 0, sm: divider ? 1 : 0 },
        borderColor: "divider",
      }}
    >
      <Typography id={labelId} variant="body1" color="text.primary">
        {label}
      </Typography>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            displayEmpty
            labelId={labelId}
            IconComponent={KeyboardArrowUpIcon}
            renderValue={(value) => {
              // Price and year store a code ("0-5000"), so show the option's label.
              const selected = options.find((option) => option.value === value);
              return selected ? (
                selected.label
              ) : (
                <Box component="span" sx={{ color: "text.secondary" }}>
                  {placeholder}
                </Box>
              );
            }}
            MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
            sx={{ "& .MuiSelect-select": { display: "block", overflow: "hidden", textOverflow: "ellipsis" } }}
          >
            <MenuItem value="">{placeholder}</MenuItem>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        )}
      />
    </Box>
  );
}
