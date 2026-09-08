"use client";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";

import { useDeleteListing } from "@/hooks/useDeleteListing";
import { getListingErrorMessage } from "@/modules/listings/api/errors";
import type { ListingSummary } from "@/modules/listings/api/types";
import { tokens } from "@/theme/tokens";

import { inventoryMessages } from "./messages";

const m = inventoryMessages.deleteDialog;

interface Props {
  listing: ListingSummary;
  open: boolean;
  onClose: () => void;
  /** Fired only after the delete actually succeeded. */
  onDeleted: () => void;
}

/**
 * Confirmation for the row's trash button, per the handover notes: "Abre modal
 * confirmacion / Muestra info del producto a eliminar / Requiere confirmacion".
 *
 * The dialog stays open on failure so the message has somewhere to land — the
 * row it belongs to is still in the table behind it.
 */
export function DeleteListingDialog({ listing, open, onClose, onDeleted }: Props) {
  const remove = useDeleteListing();

  const handleConfirm = async () => {
    try {
      await remove.mutateAsync(listing.id);
      onDeleted();
      onClose();
    } catch {
      // Rendered from `remove.error` below; rethrowing would surface as an
      // unhandled rejection from an onClick handler.
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{m.title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <DialogContentText>
            {m.body}
            <br />
            <strong>{listing.title}</strong>
          </DialogContentText>
          <Alert severity="warning" variant="outlined">
            {m.vinWarning}
          </Alert>
          {remove.error ? (
            <Alert severity="error">{getListingErrorMessage(remove.error)}</Alert>
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={remove.isPending}>
          {m.cancel}
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={remove.isPending}
          sx={{
            bgcolor: tokens.colors.naranja.main,
            color: tokens.colors.white,
            "&:hover": { bgcolor: tokens.colors.naranja.darkest },
          }}
        >
          {remove.isPending ? m.deleting : m.confirm}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
