"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Controller, useForm } from "react-hook-form";

import { publicTokens as pt } from "@/theme/tokens";

import { homeMessages } from "../messages";
import {
  defaultNewsletterValues,
  newsletterSchema,
  type NewsletterValues,
} from "../schemas/newsletter.schema";
import { SectionShell } from "./SectionShell";

const m = homeMessages.newsletter;

/** Newsletter sign-up band (Figma 10175:32110). */
export function NewsletterCta() {
  const { control, handleSubmit } = useForm<NewsletterValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: defaultNewsletterValues,
  });

  const submit = handleSubmit((values) => {
    // eslint-disable-next-line no-console -- placeholder until the list exists
    console.log("[home] suscripción al boletín:", values);
  });

  return (
    <SectionShell bgcolor={pt.colors.roti.light}>
      <Stack spacing={4} sx={{ maxWidth: pt.layout.maxWidthLarge }}>
        <Stack spacing={3}>
          <Typography variant="h2" component="h2" color="brand.darker">
            {m.heading}
          </Typography>
          <Typography variant="subtitle2" color="brand.darkest">
            {m.lead}
          </Typography>
        </Stack>

        <Stack spacing={2} component="form" onSubmit={submit} noValidate>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="flex-start">
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="email"
                  placeholder={m.emailPlaceholder}
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  inputProps={{ "aria-label": m.emailLabel }}
                  sx={{ "& .MuiOutlinedInput-root": { bgcolor: pt.colors.alphaDarkest[15] } }}
                />
              )}
            />
            <Button
              type="submit"
              sx={{
                flexShrink: 0,
                bgcolor: pt.colors.thunderLight,
                "&:hover": { bgcolor: pt.colors.thunder },
              }}
            >
              {m.action}
            </Button>
          </Stack>
          <Box>
            <Typography variant="caption" color="text.primary">
              {m.terms}
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </SectionShell>
  );
}
