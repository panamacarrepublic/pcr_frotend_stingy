"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Link from "next/link";
import { useRef, useState } from "react";
import { FormProvider, useForm, useWatch, type DefaultValues } from "react-hook-form";

import { useUpdateListing } from "@/hooks/useUpdateListing";
import { tokens } from "@/theme/tokens";

import { getListingErrorMessage } from "../../api/errors";
import type { ListingResponse } from "../../api/types";
import {
  countPendingChanges,
  toEditListingValues,
  toListingUpdatePayload,
} from "../../lib/editListingValues";
import { editTabs, firstTabWithError, type EditTabId } from "../../lib/editTabs";
import { listingMessages } from "../../messages";
import {
  editListingSchema,
  type EditListingForm as EditFormValues,
} from "../../schemas/editListing.schema";
import { listingErrorMap } from "../../schemas/errorMap";
import { EditListingHeader } from "./EditListingHeader";
import { DetailsTab } from "./tabs/DetailsTab";
import { InfoTab } from "./tabs/InfoTab";
import { PhotosTab } from "./tabs/PhotosTab";

const m = listingMessages.edit;

/** Segmented control, not MUI's underlined tabs: a white pill on a grey track. */
const segmentedSx = {
  minHeight: 0,
  bgcolor: tokens.colors.foreground,
  borderRadius: `${tokens.radius.md}px`,
  p: 0.5,
  "& .MuiTabs-indicator": { display: "none" },
  "& .MuiTabs-flexContainer": { gap: 0.5 },
  "& .MuiTab-root": {
    flex: 1,
    minHeight: 0,
    py: 1.25,
    borderRadius: `${tokens.radius.sm}px`,
    textTransform: "none",
    color: "text.secondary",
  },
  "& .MuiTab-root.Mui-selected": {
    bgcolor: tokens.colors.white,
    color: "text.primary",
    fontWeight: 600,
    boxShadow: tokens.shadows.card,
  },
} as const;

function TabBody({ id }: { id: EditTabId }) {
  switch (id) {
    case "info":
      return <InfoTab />;
    case "photos":
      return <PhotosTab />;
    case "details":
      return <DetailsTab />;
    default:
      return null;
  }
}

interface Props {
  listing: ListingResponse;
  /** Called after a successful save, and by the Cancelar button. */
  onClose: () => void;
}

/**
 * The edit form itself: three tabs over one react-hook-form instance.
 *
 * One form, not one per tab, because the payload is a diff against the listing
 * as a whole — a save has to see every field at once, including the ones on
 * tabs the seller never opened.
 */
export function EditListingForm({ listing, onClose }: Props) {
  const [tab, setTab] = useState<EditTabId>("info");
  const [noChanges, setNoChanges] = useState(false);
  const update = useUpdateListing();

  const form = useForm<EditFormValues>({
    resolver: zodResolver(editListingSchema, { errorMap: listingErrorMap }),
    // Values start as the zod *input* shape (numbers as text, nulls as ""); the
    // resolver coerces to the output shape on validate. Cast bridges the two.
    defaultValues: toEditListingValues(listing) as unknown as DefaultValues<EditFormValues>,
    mode: "onTouched",
  });

  // Live count for the "cambios pendientes" banner. Mid-edit the form often
  // fails to parse (an emptied number, a half-typed year); rather than blink to
  // zero, the banner holds the last count it could actually compute.
  const values = useWatch({ control: form.control });
  const lastCount = useRef(0);
  const parsed = editListingSchema.safeParse(values);
  if (parsed.success) {
    lastCount.current = countPendingChanges(toListingUpdatePayload(parsed.data, listing));
  }
  const pending = lastCount.current;

  const submit = form.handleSubmit(
    async (data) => {
      const patch = toListingUpdatePayload(data, listing);
      // An empty patch is a valid no-op server-side, so sending it would be a
      // round trip that changes nothing.
      if (Object.keys(patch).length === 0) {
        setNoChanges(true);
        return;
      }
      setNoChanges(false);
      try {
        await update.mutateAsync({ listingId: listing.id, patch });
        onClose();
      } catch {
        // Shown from `update.error`; rethrowing here would surface as an
        // unhandled rejection out of an onClick handler.
      }
    },
    (errors) => {
      // The broken field may be on a tab the seller cannot see, which makes the
      // save button look inert. Bring that tab forward instead.
      setNoChanges(false);
      const target = firstTabWithError(errors);
      if (target) setTab(target);
    },
  );

  return (
    <FormProvider {...form}>
      <Stack spacing={2.5}>
        <EditListingHeader listing={listing} />

        {pending > 0 ? (
          <Alert severity="info">
            {pending === 1 ? m.pendingOne : m.pendingMany.replace("{n}", String(pending))}
            <Box component="span" sx={{ display: "block", color: "text.secondary" }}>
              {m.pendingHint}
            </Box>
          </Alert>
        ) : null}

        {noChanges ? <Alert severity="info">{m.noChanges}</Alert> : null}
        {update.error ? <Alert severity="error">{getListingErrorMessage(update.error)}</Alert> : null}

        {/* Above the tabs, per the design: the actions apply to the whole
            listing, not to whichever tab happens to be open. */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <Button
            onClick={onClose}
            disabled={update.isPending}
            sx={{
              bgcolor: tokens.colors.naranja.lighter,
              color: tokens.colors.naranja.darkest,
              "&:hover": { bgcolor: tokens.colors.naranja.lighter },
            }}
          >
            {m.cancel}
          </Button>
          <Button
            component={Link}
            href={`/listings/${listing.id}`}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              bgcolor: tokens.colors.azul.lightest,
              color: tokens.colors.neutralDarkest,
              "&:hover": { bgcolor: tokens.colors.azul.lighter },
            }}
          >
            {m.preview}
          </Button>
          <Button
            onClick={submit}
            disabled={update.isPending}
            sx={{
              flex: 1,
              bgcolor: tokens.colors.neutralDarkest,
              color: tokens.colors.white,
              "&:hover": { bgcolor: tokens.colors.neutralDarker },
            }}
          >
            {update.isPending ? m.saving : m.save}
          </Button>
        </Stack>

        <Tabs value={tab} onChange={(_, next: EditTabId) => setTab(next)} sx={segmentedSx}>
          {editTabs.map((meta) => (
            <Tab key={meta.id} value={meta.id} label={meta.label} />
          ))}
        </Tabs>

        {/* Only the active tab is mounted, so a hidden tab's inputs cannot be
            reached by keyboard or by a screen reader. */}
        <Box>
          <TabBody id={tab} />
        </Box>
      </Stack>
    </FormProvider>
  );
}
