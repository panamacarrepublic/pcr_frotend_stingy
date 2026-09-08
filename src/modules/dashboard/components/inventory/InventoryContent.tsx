"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useState } from "react";

import { getListingErrorMessage } from "@/modules/listings/api/errors";
import type { ListingSummary } from "@/modules/listings/api/types";
import { EditListingDialog } from "@/modules/listings/components/edit/EditListingDialog";
import { tokens } from "@/theme/tokens";

import { DeleteListingDialog } from "./DeleteListingDialog";
import { InventoryPagination } from "./InventoryPagination";
import { InventoryTable } from "./InventoryTable";
import { ListingQuickView } from "./ListingQuickView";
import { inventoryMessages } from "./messages";
import { useInventoryPages } from "./useInventoryPages";

const m = inventoryMessages;

/** White table card + footer, matching the Figma content area. */
function TableCard({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        bgcolor: tokens.colors.white,
        border: `1px solid ${tokens.colors.cardBorder}`,
        borderRadius: `${tokens.radius.md}px`,
        overflow: "hidden",
      }}
    >
      {children}
    </Box>
  );
}

export function InventoryContent() {
  const page = useInventoryPages();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  // Three surfaces, at most one open at a time. The panel is the entry point
  // and hands off to the edit modal; the delete dialog is reached straight from
  // the row, per the Figma handover notes.
  const [detailsFor, setDetailsFor] = useState<ListingSummary | null>(null);
  const [deleteFor, setDeleteFor] = useState<ListingSummary | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Selection is per-page in the design ("selecciona todos los items de la
  // página actual"), so it resets when the visible page changes.
  useEffect(() => {
    setSelectedIds([]);
  }, [page.pageIndex]);

  const toggleRow = useCallback((id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    );
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedIds((current) =>
      current.length === page.items.length ? [] : page.items.map((item) => item.id),
    );
  }, [page.items]);

  // "Cierra sidebar / Abre modal de edicion completo" — stacking the modal on
  // top of the open drawer would leave focus trapped in the wrong surface.
  const openEditor = useCallback(() => {
    setDetailsFor((current) => {
      if (current) setEditingId(current.id);
      return null;
    });
  }, []);

  const handleDeleted = useCallback((deletedId: string) => {
    // The row is gone; leaving its id selected would keep a phantom in the
    // bulk-action count.
    setSelectedIds((current) => current.filter((id) => id !== deletedId));
  }, []);

  if (page.isLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" spacing={2} sx={{ py: 8 }}>
        <CircularProgress sx={{ color: tokens.colors.roti.main }} />
        <Typography variant="body2" color="text.secondary">
          {m.states.loading}
        </Typography>
      </Stack>
    );
  }

  if (page.isError) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={page.refetch}>
            {m.states.retry}
          </Button>
        }
      >
        {page.error ? getListingErrorMessage(page.error) : m.states.error}
      </Alert>
    );
  }

  if (page.items.length === 0) {
    return (
      <TableCard>
        <Stack alignItems="center" spacing={1} sx={{ py: 8, px: 3, textAlign: "center" }}>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {m.states.empty}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {m.states.emptyHint}
          </Typography>
        </Stack>
      </TableCard>
    );
  }

  return (
    <>
      <TableCard>
        <Box sx={{ overflowX: "auto" }}>
          <InventoryTable
            items={page.items}
            selectedIds={selectedIds}
            onToggleRow={toggleRow}
            onToggleAll={toggleAll}
            onOpenDetails={setDetailsFor}
            onDelete={setDeleteFor}
          />
        </Box>
        <InventoryPagination
          pageIndex={page.pageIndex}
          pageCount={page.pageCount}
          canGoPrevious={page.canGoPrevious}
          canGoNext={page.canGoNext}
          isLoadingMore={page.isLoadingMore}
          onPrevious={page.goPrevious}
          onNext={page.goNext}
          onGoToPage={page.goToPage}
        />
      </TableCard>

      {detailsFor ? (
        <ListingQuickView
          listing={detailsFor}
          open
          onClose={() => setDetailsFor(null)}
          onEdit={openEditor}
        />
      ) : null}

      {editingId ? (
        <EditListingDialog listingId={editingId} open onClose={() => setEditingId(null)} />
      ) : null}

      {deleteFor ? (
        <DeleteListingDialog
          listing={deleteFor}
          open
          onClose={() => setDeleteFor(null)}
          onDeleted={() => handleDeleted(deleteFor.id)}
        />
      ) : null}
    </>
  );
}
