"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { Controller, useForm } from "react-hook-form";

import { publicTokens as pt } from "@/theme/tokens";

import { homeMessages } from "../../messages";
import {
  LOCATION_OPTIONS,
  PRICE_OPTIONS,
  YEAR_OPTIONS,
  defaultSearchCriteria,
  searchCriteriaSchema,
  type SearchCriteria,
} from "../../schemas/search.schema";
import { FilterSelect } from "./FilterSelect";
import { VerticalRadioGroup } from "./VerticalRadioGroup";

const m = homeMessages.search;

interface SearchFilterBarProps {
  /**
   * Called with the validated criteria on submit.
   *
   * Defaults to logging because the search endpoint does not exist yet. To wire
   * it up, pass a handler that pushes the criteria into the URL — filters are
   * URL state, never component state:
   *
   *   onSearch={(c) => router.push(`/listings?${new URLSearchParams(c)}`)}
   */
  onSearch?: (criteria: SearchCriteria) => void;
}

/** The hero's search + filter panel (Figma 10175:32270). */
export function SearchFilterBar({ onSearch }: SearchFilterBarProps) {
  const { control, handleSubmit } = useForm<SearchCriteria>({
    resolver: zodResolver(searchCriteriaSchema),
    defaultValues: defaultSearchCriteria,
  });

  const submit = handleSubmit((criteria) => {
    if (onSearch) {
      onSearch(criteria);
      return;
    }
    // eslint-disable-next-line no-console -- placeholder until the search endpoint lands
    console.log("[home] búsqueda:", criteria);
  });

  return (
    <Paper
      component="form"
      onSubmit={submit}
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: { md: 600 },
        p: 1.25,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        bgcolor: pt.colors.alphaWhite[60],
        boxShadow: pt.shadows.xsmall,
      }}
    >
      <VerticalRadioGroup control={control} legend={m.legend} />

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="stretch">
        <Controller
          name="query"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              fullWidth
              placeholder={m.queryPlaceholder}
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message}
              inputProps={{ "aria-label": m.queryLabel }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: "text.primary" }} />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        <Button type="submit">{m.submit}</Button>
      </Stack>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          p: 1.25,
          bgcolor: "background.paper",
          borderRadius: 1,
          boxShadow: pt.shadows.xsmall,
        }}
      >
        <FilterSelect
          control={control}
          name="location"
          label={m.location}
          placeholder={m.placeholder}
          options={LOCATION_OPTIONS}
        />
        <FilterSelect
          control={control}
          name="priceRange"
          label={m.price}
          placeholder={m.placeholder}
          options={PRICE_OPTIONS}
        />
        <FilterSelect
          control={control}
          name="year"
          label={m.year}
          placeholder={m.placeholder}
          options={YEAR_OPTIONS}
          divider={false}
        />
      </Box>
    </Paper>
  );
}
