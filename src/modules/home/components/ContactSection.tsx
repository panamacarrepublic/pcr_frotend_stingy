"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneIcon from "@mui/icons-material/Phone";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Controller, useForm, type Control } from "react-hook-form";

import { publicTokens as pt } from "@/theme/tokens";

import { homeMessages } from "../messages";
import { contactSchema, defaultContactValues, type ContactValues } from "../schemas/contact.schema";
import { SectionShell } from "./SectionShell";

const m = homeMessages.contact;

/** One labelled field in the contact form; label sits above the input, per Figma. */
function ContactField({
  control,
  name,
  label,
  placeholder,
  type = "text",
  multiline,
}: {
  control: Control<ContactValues>;
  name: "name" | "email" | "subject" | "message";
  label: string;
  placeholder?: string;
  type?: "text" | "email";
  multiline?: boolean;
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Stack spacing={1}>
          <Typography component="label" htmlFor={`contacto-${name}`} variant="body2" color="text.primary">
            {label}
          </Typography>
          <TextField
            {...field}
            id={`contacto-${name}`}
            type={type}
            placeholder={placeholder}
            multiline={multiline}
            minRows={multiline ? 5 : undefined}
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message}
            sx={{ "& .MuiOutlinedInput-root": { bgcolor: pt.colors.roti.lighter } }}
          />
        </Stack>
      )}
    />
  );
}

/** "Contáctanos" (Figma 10970:31899). */
export function ContactSection() {
  const { control, handleSubmit } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: defaultContactValues as ContactValues,
  });

  const submit = handleSubmit((values) => {
    // eslint-disable-next-line no-console -- placeholder until the endpoint exists
    console.log("[home] mensaje de contacto:", values);
  });

  const details = [
    { Icon: MailOutlineIcon, text: m.email, href: `mailto:${m.email}` },
    { Icon: PhoneIcon, text: m.phone, href: `tel:${m.phone.replace(/[^+\d]/g, "")}` },
    { Icon: PlaceOutlinedIcon, text: m.address, href: undefined },
  ];

  return (
    <SectionShell bgcolor={pt.colors.roti.lightest}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 6, md: 10 }} alignItems="flex-start">
        <Stack spacing={3} sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" fontWeight={600} color="text.secondary">
            {m.tagline}
          </Typography>
          <Typography variant="h2" component="h2" color="brand.darker">
            {m.heading}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {m.lead}
          </Typography>

          <Stack spacing={2} sx={{ pt: 2 }}>
            {details.map(({ Icon, text, href }) => (
              <Stack key={text} direction="row" spacing={2} alignItems="center">
                <Icon sx={{ fontSize: 20, color: "text.secondary" }} />
                {href ? (
                  <Link href={href} underline="always" variant="body1" color="text.secondary">
                    {text}
                  </Link>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    {text}
                  </Typography>
                )}
              </Stack>
            ))}
          </Stack>
        </Stack>

        <Stack component="form" onSubmit={submit} noValidate spacing={2} sx={{ flex: 1, minWidth: 0, width: "100%" }}>
          <ContactField control={control} name="name" label={m.form.name} />
          <ContactField control={control} name="email" label={m.form.email} type="email" />
          <ContactField control={control} name="subject" label={m.form.subject} />
          <ContactField
            control={control}
            name="message"
            label={m.form.message}
            placeholder={m.form.messagePlaceholder}
            multiline
          />

          <Controller
            name="acceptedTerms"
            control={control}
            render={({ field, fieldState }) => (
              <Box>
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} size="small" />}
                  label={m.form.terms}
                  sx={{ "& .MuiFormControlLabel-label": { typography: "body2" } }}
                />
                {fieldState.error ? <FormHelperText error>{fieldState.error.message}</FormHelperText> : null}
              </Box>
            )}
          />

          <Box>
            <Button
              type="submit"
              sx={{ bgcolor: pt.colors.neutralDarker, "&:hover": { bgcolor: pt.colors.neutralDarkest } }}
            >
              {m.form.action}
            </Button>
          </Box>
        </Stack>
      </Stack>
    </SectionShell>
  );
}
