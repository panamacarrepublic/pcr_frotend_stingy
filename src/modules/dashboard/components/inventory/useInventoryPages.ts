"use client";

import { useCallback, useState } from "react";

import { useMyListings } from "@/hooks/useMyListings";
import type { ListingSummary } from "@/modules/listings/api/types";

export interface InventoryPagination {
  /** Listings for the page currently on screen. */
  items: ListingSummary[];
  /** 0-based index of the visible page. */
  pageIndex: number;
  /** How many pages have been fetched so far — the numbers the footer renders. */
  pageCount: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  goToPage: (index: number) => void;
  goPrevious: () => void;
  goNext: () => void;
  isLoading: boolean;
  /** True while a not-yet-fetched next page is in flight. */
  isLoadingMore: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Paging for the inventory table on top of a cursor-paginated API.
 *
 * `GET /api/v1/listings/me` returns an opaque `next_cursor` and no total count,
 * so there is no way to know the page count up front or jump to an arbitrary
 * page. `useInfiniteQuery` keeps every page it has fetched, which gives us the
 * cursor stack for free: we track which of those pages is on screen, and the
 * footer renders one number per page **already visited**. Going back is
 * instant (the page is cached); going forward fetches only when we have run off
 * the end of what we hold.
 *
 * The upshot for the UI: the numbers start at "1" and grow as the user pages
 * forward, rather than showing a fixed 1-2-3-4 the API cannot support.
 */
export function useInventoryPages(): InventoryPagination {
  const query = useMyListings();
  const [pageIndex, setPageIndex] = useState(0);

  const pages = query.data?.pages ?? [];
  const pageCount = pages.length;
  const items = pages[pageIndex]?.items ?? [];

  const goToPage = useCallback(
    (index: number) => {
      if (index >= 0 && index < pageCount) setPageIndex(index);
    },
    [pageCount],
  );

  const goPrevious = useCallback(() => {
    setPageIndex((current) => Math.max(0, current - 1));
  }, []);

  const goNext = useCallback(async () => {
    const next = pageIndex + 1;
    if (next < pageCount) {
      setPageIndex(next);
      return;
    }
    if (!query.hasNextPage || query.isFetchingNextPage) return;
    // Only advance once the page actually arrives, so a failed fetch leaves the
    // user on a page that still has rows rather than on an empty one.
    const result = await query.fetchNextPage();
    if (result.data && result.data.pages.length > pageCount) setPageIndex(next);
  }, [pageIndex, pageCount, query]);

  return {
    items,
    pageIndex,
    pageCount,
    canGoPrevious: pageIndex > 0,
    canGoNext: pageIndex + 1 < pageCount || Boolean(query.hasNextPage),
    goToPage,
    goPrevious,
    goNext: () => void goNext(),
    isLoading: query.isLoading,
    isLoadingMore: query.isFetchingNextPage,
    isError: query.isError,
    error: query.error,
    refetch: () => void query.refetch(),
  };
}
