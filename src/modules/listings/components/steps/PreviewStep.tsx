"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useFormContext, useWatch } from "react-hook-form";

import { useMakes } from "@/hooks/useMakes";
import { useModels } from "@/hooks/useModels";
import { tokens } from "@/theme/tokens";

import {
  conditionLabels,
  fuelTypeLabels,
  transmissionLabels,
  vehicleTypeLabels,
} from "../../constants";
import { listingMessages } from "../../messages";
import type { PublishListingForm } from "../../schemas/listing.schema";
import { OTHER_MODEL } from "../../schemas/vehicle.schema";
import { RhfCheckbox } from "../fields";
import { usePublishWizard } from "../PublishWizardContext";

const currency = new Intl.NumberFormat("es-PA", { style: "currency", currency: "USD" });

export function PreviewStep() {
  const { goBack, submit, submitting } = usePublishWizard();
  const { formState } = useFormContext();
  // useWatch returns live values (input shape at runtime); typed as the output
  // shape here purely so the display fields are renderable (no `unknown`).
  const v = useWatch() as PublishListingForm;
  const data = v.data;
  const photos = (v.photos ?? []) as { url: string }[];
  // price/condition/province are the listing's, not the vehicle's.
  const priceNum = Number(v.price);
  const s = listingMessages.steps.preview;
  const nav = listingMessages.nav;

  const specs = [
    data?.year,
    data?.mileage ? `${data.mileage} km` : null,
    data?.fuel_type ? fuelTypeLabels[data.fuel_type] : null,
    data?.transmission_type ? transmissionLabels[data.transmission_type] : null,
    v.condition ? conditionLabels[v.condition] : null,
    data?.vehicle_type ? vehicleTypeLabels[data.vehicle_type] : null,
    v.province,
  ].filter(Boolean) as (string | number)[];

  const makes = useMakes();
  const models = useModels(data?.make_id);
  const makeName = makes.data?.find((m) => m.id === data?.make_id)?.name ?? "";
  const modelName =
    data?.model_id && data.model_id !== OTHER_MODEL
      ? (models.data?.find((m) => m.id === data.model_id)?.name ?? "")
      : (data?.model_text ?? "");

  const termsError = formState.errors.terms_accepted?.message as string | undefined;
  const heading = v.title || `${makeName} ${modelName}`.trim();

  return (
    <Box>
      <Box
        sx={{
          bgcolor: tokens.colors.foreground,
          borderRadius: `${tokens.radius.md}px`,
          p: { xs: 2, md: 3 },
          mb: 3,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {s.title}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
          {s.subtitle}
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <Button
            fullWidth
            variant="contained"
            onClick={goBack}
            sx={{
              bgcolor: tokens.colors.neutral,
              color: tokens.colors.white,
              "&:hover": { bgcolor: tokens.colors.neutralDark },
            }}
          >
            {nav.backToEdit}
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={submit}
            disabled={submitting}
            sx={{
              bgcolor: tokens.colors.neutralDarkest,
              color: tokens.colors.white,
              "&:hover": { bgcolor: tokens.colors.neutralDarker },
            }}
          >
            {nav.publish}
          </Button>
        </Stack>
      </Box>

      <Box
        sx={{
          bgcolor: tokens.colors.white,
          border: `1px solid ${tokens.colors.border}`,
          borderRadius: `${tokens.radius.lg}px`,
          overflow: "hidden",
        }}
      >
        <Box sx={{ position: "relative", width: "100%", pt: "46%", bgcolor: tokens.colors.neutralDarkest }}>
          {photos[0] ? (
            <Box sx={{ position: "absolute", inset: 0 }}>
              <Image
                src={photos[0].url}
                alt={heading || "Anuncio"}
                fill
                sizes="100vw"
                style={{ objectFit: "cover" }}
                unoptimized
              />
            </Box>
          ) : null}
        </Box>
        {photos.length > 1 ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
              gap: 1,
              p: 1,
            }}
          >
            {photos.slice(1, 6).map((p, i) => (
              <Box
                key={i}
                sx={{ position: "relative", pt: "70%", borderRadius: `${tokens.radius.sm}px`, overflow: "hidden" }}
              >
                <Box sx={{ position: "absolute", inset: 0 }}>
                  <Image src={p.url} alt={`Foto ${i + 2}`} fill sizes="90px" style={{ objectFit: "cover" }} unoptimized />
                </Box>
              </Box>
            ))}
          </Box>
        ) : null}
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {heading}
          </Typography>
          {Number.isFinite(priceNum) && priceNum > 0 ? (
            <Typography variant="h5" sx={{ color: tokens.colors.roti.dark, fontWeight: 700, mt: 0.5 }}>
              {currency.format(priceNum)}
            </Typography>
          ) : null}
          <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 2 }}>
            {specs.map((sp, i) => (
              <Chip
                key={i}
                label={sp}
                size="small"
                sx={{ bgcolor: tokens.colors.roti.lighter, color: tokens.colors.neutralDarkest }}
              />
            ))}
          </Stack>
          {v.description ? (
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 2, whiteSpace: "pre-wrap" }}>
              {v.description}
            </Typography>
          ) : null}
        </Box>
      </Box>

      <Stack spacing={0.5} sx={{ mt: 3 }}>
        <FormControlLabel
          control={<RhfCheckbox name="terms_accepted" ariaLabel={listingMessages.terms.label} />}
          label={<Typography variant="body2">{listingMessages.terms.label}</Typography>}
        />
        {termsError ? (
          <Typography variant="caption" sx={{ color: "error.main" }}>
            {termsError}
          </Typography>
        ) : null}
      </Stack>
    </Box>
  );
}
