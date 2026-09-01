"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useState } from "react";
import { FormProvider, useForm, type DefaultValues } from "react-hook-form";

import { useUpdateListing } from "@/hooks/useUpdateListing";

import { getListingErrorMessage } from "../../api/errors";
import type { ListingResponse } from "../../api/types";
import { editTabs, firstTabWithError, type EditTabId } from "../../lib/editTabs";
import { toEditListingValues, toListingUpdatePayload } from "../../lib/editListingValues";
import { listingMessages } from "../../messages";
import { editListingSchema, type EditListingForm as EditFormValues } from "../../schemas/editListing.schema";
import { listingErrorMap } from "../../schemas/errorMap";
import { DetailsTab } from "./tabs/DetailsTab";
import { InfoTab } from "./tabs/InfoTab";
import { PhotosTab } from "./tabs/PhotosTab";

const m = listingMessages.edit;

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

  const submit = form.handleSubmit(
    async (values) => {
      const patch = toListingUpdatePayload(values, listing);
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
      <Stack spacing={3}>
        <Tabs
          value={tab}
          onChange={(_, next: EditTabId) => setTab(next)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {editTabs.map((meta) => (
            <Tab key={meta.id} value={meta.id} label={meta.label} />
          ))}
        </Tabs>

        {/* Only the active tab is mounted, so a hidden tab's inputs cannot be
            reached by keyboard or by a screen reader. */}
        <Box>
          <TabBody id={tab} />
        </Box>

        {noChanges ? <Alert severity="info">{m.noChanges}</Alert> : null}
        {update.error ? <Alert severity="error">{getListingErrorMessage(update.error)}</Alert> : null}

        <Stack direction="row" spacing={1.5} justifyContent="flex-end">
          <Button onClick={onClose} disabled={update.isPending}>
            {m.cancel}
          </Button>
          <Button variant="contained" onClick={submit} disabled={update.isPending}>
            {update.isPending ? m.saving : m.save}
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
}
