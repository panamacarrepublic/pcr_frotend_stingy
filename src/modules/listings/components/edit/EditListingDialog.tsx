"use client";

import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useListing } from "@/hooks/useListing";
import { tokens } from "@/theme/tokens";

import { getListingErrorMessage } from "../../api/errors";
import { listingMessages } from "../../messages";
import { EditListingForm } from "./EditListingForm";

const m = listingMessages.edit;

interface Props {
  listingId: string;
  open: boolean;
  onClose: () => void;
}

/**
 * Host for the full edit modal, reached from "Editar Completo" on the inventory
 * panel.
 *
 * The table only has a `ListingSummary` — no description, VIN, fuel type or
 * photo array — so the form needs the full `GET /{id}` before it can seed its
 * defaults. It seeds them once, on mount, which is why the form is not rendered
 * until the data is actually here: mounting it early would fill every field
 * with a blank and the save diff would read as "the seller cleared everything".
 */
export function EditListingDialog({ listingId, open, onClose }: Props) {
  const listing = useListing(open ? listingId : undefined);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="body">
      <DialogTitle sx={{ pr: 7 }}>
        <Typography variant="h3" component="span" sx={{ textTransform: "uppercase" }}>
          {m.title}
        </Typography>
        <IconButton
          aria-label={m.close}
          onClick={onClose}
          sx={{ position: "absolute", right: 12, top: 12 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {listing.isLoading ? (
          <Stack alignItems="center" spacing={2} sx={{ py: 6 }}>
            <CircularProgress sx={{ color: tokens.colors.roti.main }} />
            <Typography variant="body2" color="text.secondary">
              {m.loading}
            </Typography>
          </Stack>
        ) : null}

        {listing.isError ? (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => listing.refetch()}>
                {m.retry}
              </Button>
            }
          >
            {listing.error ? getListingErrorMessage(listing.error) : m.loadError}
          </Alert>
        ) : null}

        {listing.data ? <EditListingForm listing={listing.data} onClose={onClose} /> : null}
      </DialogContent>
    </Dialog>
  );
}
