/**
 * TypeScript mirror of the backend listings contract
 * (`app/modules/listings/schemas.py`, documented in `docs/api/listings.md`).
 *
 * Module-local on purpose, following the precedent set by `schemas/enums.ts`:
 * the listings module owns its own contract until `@pcr/types` and the backend
 * Pydantic models are aligned in a coordinated PR. (`@pcr/types` is not even
 * resolvable in this checkout today — see `useMakes.ts`/`useModels.ts`.)
 *
 * The value enums are reused from `schemas/enums.ts` rather than redeclared, so
 * the form and the API contract cannot drift apart silently.
 */
import type {
  FuelType,
  ItemCondition,
  ListingCategory,
  TransmissionType,
  VehicleType,
} from "../schemas/enums";

/** Only USD is supported; the backend rejects anything else. */
export type Currency = "USD";

/** All 7 persisted states. The client can only *set* 3 of them — see `ListingStatusUpdate`. */
export type ListingStatus =
  | "draft"
  | "pending_payment"
  | "active"
  | "paused"
  | "sold"
  | "expired"
  | "rejected";

/**
 * The only states a client may write via PATCH. `draft`/`pending_payment` belong
 * to the payment flow and `expired`/`rejected` to moderation — sending any of
 * them is a 422 from FastAPI before the transition table is even consulted.
 */
export type ListingStatusUpdate = Extract<ListingStatus, "active" | "paused" | "sold">;

/** Listings that reject every PATCH (content or status) with a 409. */
export const READ_ONLY_STATUSES: readonly ListingStatus[] = ["sold", "expired", "rejected"];

/** Allowed status transitions, mirroring §6 of the contract. `sold` is terminal. */
export const STATUS_TRANSITIONS: Record<ListingStatusUpdate, readonly ListingStatusUpdate[]> = {
  active: ["paused", "sold"],
  paused: ["active", "sold"],
  sold: [],
};

export interface PhotoInput {
  url: string;
  /** Integer, 1..10. Also decides the feed's `cover_photo` (lowest wins). */
  sort_order: number;
}

export interface PhotoOut {
  url: string;
  sort_order: number;
}

/** `data` on a response, with `make`/`model` resolved to display names. */
export interface VehicleDataOut {
  category: "cars";
  vin_number: string | null;
  make_id: string;
  model_id: string | null;
  model_text: string | null;
  mileage: number;
  year: number;
  vehicle_type: VehicleType;
  fuel_type: FuelType;
  transmission_type: TransmissionType;
  /** Resolved from reference_makes; `""` if the make_id no longer exists. */
  make: string;
  /** Resolved from reference_models, or `model_text` when there is no model_id. */
  model: string;
}

/**
 * Shape of POST, GET /{id} and PATCH /{id}.
 *
 * NOTE `price` is a **string**: Pydantic v2 serializes `Decimal` to a JSON
 * string so precision survives the wire. Use `listingPrice()` before doing
 * arithmetic or formatting currency.
 */
export interface ListingResponse {
  id: string;
  category: ListingCategory;
  title: string;
  description: string | null;
  professional_photos: boolean;
  business_id: string | null;
  /** Decimal-as-string, e.g. `"18500.00"`. See `listingPrice()`. */
  price: string;
  currency: Currency;
  condition: ItemCondition;
  quantity: number;
  province: string;
  district: string;
  status: ListingStatus;
  data: VehicleDataOut;
  photos: PhotoOut[];
  /** ISO 8601 with offset. */
  created_at: string;
}

/**
 * Feed / "my listings" card. Deliberately poorer than `ListingResponse`: no VIN,
 * description, fuel type, transmission or full photo array — just the cover.
 */
export interface ListingSummary {
  id: string;
  title: string;
  /** Decimal-as-string. See `listingPrice()`. */
  price: string;
  currency: Currency;
  condition: ItemCondition;
  province: string;
  district: string;
  status: ListingStatus;
  created_at: string;
  /** The photo with the lowest `sort_order`; `null` when the listing has none. */
  cover_photo: string | null;
  year: number;
  mileage: number;
  make: string;
  model: string;
  vehicle_type: VehicleType;
}

export interface ListingPage {
  items: ListingSummary[];
  /** Opaque. Pass back verbatim; `null` means the last page. Never parse it. */
  next_cursor: string | null;
}

/** Query params for the public feed. All optional. */
export interface ListingFilters {
  category?: ListingCategory;
  make_id?: string;
  model_id?: string;
  /** Must be > 0 if present. */
  price_min?: number;
  /** Must be > 0 if present. */
  price_max?: number;
  province?: string;
}

/** Cursor pagination params, shared by the feed and `/me`. */
export interface PageParams {
  cursor?: string;
  /** 1..50, default 20. Asking for more is a 422, not a truncation. */
  limit?: number;
}

/**
 * Vehicle patch. `category` is absent on purpose: changing vertical is a
 * different listing, not an edit.
 *
 * Only the three fields typed `| null` below map to nullable columns. The other
 * fields are typed as non-nullable optionals **deliberately** — the backend
 * accepts `null` for any of them at the Pydantic layer but then hits a NOT NULL
 * column (or `VehicleType(None)`) and returns an untranslated 500, not a 422.
 * Keeping `null` out of the type turns that runtime 500 into a compile error.
 */
export interface VehicleDataUpdate {
  vin_number?: string | null;
  make_id?: string;
  model_id?: string | null;
  model_text?: string | null;
  mileage?: number;
  year?: number;
  vehicle_type?: VehicleType;
  fuel_type?: FuelType;
  transmission_type?: TransmissionType;
}

/**
 * PATCH body. Omitted keys are untouched (`exclude_unset` server-side); `{}` is
 * a valid no-op patch.
 *
 * `description` is the only top-level field safe to send as `null` (it is the
 * one with a passing backend test for clearing). Every other field is typed
 * non-nullable for the reason described on `VehicleDataUpdate`.
 *
 * `currency` is absent: the currency of a published listing cannot change.
 */
export interface ListingUpdate {
  /** 5..150 characters if present. */
  title?: string;
  description?: string | null;
  professional_photos?: boolean;
  /** Must be > 0 if present. A plain number — only *responses* use strings. */
  price?: number;
  condition?: ItemCondition;
  /** Must be > 0 if present. */
  quantity?: number;
  province?: string;
  district?: string;
  status?: ListingStatusUpdate;
  /** Total replacement, not a merge: sending this deletes every existing photo. */
  photos?: PhotoInput[];
  data?: VehicleDataUpdate;
}

/**
 * Parse a listing's decimal-as-string price into a number for formatting or
 * arithmetic. Returns `NaN` for a malformed value, like `Number` itself, so
 * callers can guard with `Number.isFinite`.
 */
export function listingPrice(listing: Pick<ListingResponse | ListingSummary, "price">): number {
  return Number(listing.price);
}
