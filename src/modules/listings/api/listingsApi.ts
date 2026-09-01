/**
 * Thin typed wrapper over the listings endpoints. One place that knows the
 * routes and the response shapes; hooks stay about caching, components stay
 * about rendering.
 *
 * Auth is handled by `api-client.ts`, which attaches the Supabase JWT to every
 * request — nothing here touches tokens.
 */
import apiClient from "@/lib/api-client";

import type {
  ListingFilters,
  ListingPage,
  ListingResponse,
  ListingUpdate,
  PageParams,
} from "./types";
import type { ListingCreatePayload } from "../lib/toListingCreatePayload";

const BASE = "/api/v1/listings";

/**
 * `POST /api/v1/listings` → 201. `user_id`/`business_id`/`category_id` are
 * resolved server-side from the JWT and are not part of the body.
 *
 * `photos[].url` must already point somewhere durable — the backend has no
 * upload endpoint and stores the string verbatim. See `uploadListingPhotos`.
 */
export async function createListing(
  payload: ListingCreatePayload,
): Promise<ListingResponse> {
  const { data } = await apiClient.post<ListingResponse>(BASE, payload);
  return data;
}

/**
 * `GET /api/v1/listings` → the public feed: `status=active` only, newest first.
 * Public — works without a session.
 */
export async function fetchListings(
  params: ListingFilters & PageParams = {},
): Promise<ListingPage> {
  // axios drops `undefined` params, so optional filters simply don't appear.
  const { data } = await apiClient.get<ListingPage>(BASE, { params });
  return data;
}

/**
 * `GET /api/v1/listings/me` → every listing you own (or your business owns), in
 * any status except deleted. Requires a session. Only accepts cursor/limit —
 * the feed filters are not available here.
 */
export async function fetchMyListings(params: PageParams = {}): Promise<ListingPage> {
  const { data } = await apiClient.get<ListingPage>(`${BASE}/me`, { params });
  return data;
}

/**
 * `GET /api/v1/listings/{id}`. Auth is optional: anonymous callers (and
 * non-owners) only ever see `active` listings — anything else is a 404, never a
 * 403, so that a listing's existence isn't leaked.
 */
export async function fetchListing(listingId: string): Promise<ListingResponse> {
  const { data } = await apiClient.get<ListingResponse>(`${BASE}/${listingId}`);
  return data;
}

/**
 * `PATCH /api/v1/listings/{id}`. Partial: omitted keys are left untouched, and
 * `{}` is a valid no-op.
 *
 * Two sharp edges encoded in `ListingUpdate` rather than handled here:
 * `photos` is a **total replacement**, and only `description`/`vin_number`/
 * `model_id`/`model_text` may be sent as `null`.
 */
export async function updateListing(
  listingId: string,
  patch: ListingUpdate,
): Promise<ListingResponse> {
  const { data } = await apiClient.patch<ListingResponse>(`${BASE}/${listingId}`, patch);
  return data;
}

/**
 * `DELETE /api/v1/listings/{id}` → 204 with no body (don't parse it). Always a
 * soft delete; note this does **not** free the VIN, so republishing the same
 * vehicle later returns a 409.
 */
export async function deleteListing(listingId: string): Promise<void> {
  await apiClient.delete(`${BASE}/${listingId}`);
}
