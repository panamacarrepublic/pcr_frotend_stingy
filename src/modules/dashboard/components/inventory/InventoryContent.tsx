"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useState } from "react";

import { getListingErrorMessage } from "@/modules/listings/api/errors";
import { tokens } from "@/theme/tokens";

import { InventoryPagination } from "./InventoryPagination";
import { InventoryTable } from "./InventoryTable";
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
    <TableCard>
      <Box sx={{ overflowX: "auto" }}>
        <InventoryTable
          items={page.items}
          selectedIds={selectedIds}
          onToggleRow={toggleRow}
          onToggleAll={toggleAll}
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
  );
}
