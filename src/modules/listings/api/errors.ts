/**
 * Normalizes listing API failures into something the UI can render.
 *
 * Two things make this non-trivial (contract §7):
 *
 * 1. `detail` has **two shapes**. Domain errors raised by our own service send
 *    `{"detail": "<mensaje>"}` — a string, already written in Spanish. FastAPI's
 *    automatic body/query validation sends `{"detail": [{type, loc, msg}, ...]}`
 *    — an array of objects. Both are 422. A naive `String(detail)` on the array
 *    renders "[object Object]" to the user.
 * 2. `409` means three different things (duplicate VIN, read-only listing,
 *    invalid status transition) and is only distinguishable by the message.
 *
 * Because the backend's domain messages are already Spanish and more specific
 * than anything we could infer from the status code, we prefer `detail` when it
 * is a string and fall back to status-based copy otherwise.
 */
import { AxiosError } from "axios";

import { listingMessages } from "../messages";

const copy = listingMessages.errors.api;

/** A FastAPI/Pydantic validation issue, as sent inside an array `detail`. */
interface ValidationIssue {
  msg?: string;
  loc?: (string | number)[];
}

export interface ListingApiError {
  /** HTTP status, or `null` when the request never got a response (offline, CORS, timeout). */
  status: number | null;
  /** The server's `detail` when it was a plain string; `null` for validation arrays. */
  detail: string | null;
  /** Field-level issues when FastAPI rejected the body/query; empty otherwise. */
  issues: ValidationIssue[];
  /** Ready-to-render Spanish message. */
  message: string;
}

function isValidationIssueArray(value: unknown): value is ValidationIssue[] {
  return Array.isArray(value) && value.every((v) => typeof v === "object" && v !== null);
}

/**
 * FastAPI's `HTTPBearer` rejects a request with no `Authorization` header itself,
 * before any of our handlers run, with an untranslated `"Not authenticated"` —
 * and as a **403**, not the 401 the contract doc documents (verified against the
 * running server). Everything else on this resource answers in Spanish, so
 * passing this one through verbatim would put a stray English string in front of
 * a user whose session simply expired.
 */
function isUnauthenticatedDetail(detail: string): boolean {
  return detail.trim().toLowerCase() === "not authenticated";
}

/** Status-based fallback, used only when the server gave us no usable string. */
function fallbackMessage(status: number | null): string {
  switch (status) {
    case 400:
      return copy.badReference;
    case 401:
      return copy.unauthorized;
    case 403:
      return copy.forbidden;
    case 404:
      return copy.notFound;
    case 409:
      return copy.conflict;
    case 422:
      return copy.validation;
    case null:
      return copy.network;
    default:
      return status >= 500 ? copy.server : listingMessages.errors.submit;
  }
}

export function toListingApiError(error: unknown): ListingApiError {
  if (!(error instanceof AxiosError)) {
    return {
      status: null,
      detail: null,
      issues: [],
      message: error instanceof Error ? error.message : listingMessages.errors.submit,
    };
  }

  const status = error.response?.status ?? null;
  const rawDetail = (error.response?.data as { detail?: unknown } | undefined)?.detail;

  if (typeof rawDetail === "string" && rawDetail.trim() !== "") {
    // A domain error: the backend's own Spanish copy is the most specific thing
    // available, and for 409 it is the only way to tell the three cases apart.
    // The one exception is FastAPI's own English auth rejection.
    const message = isUnauthenticatedDetail(rawDetail) ? copy.unauthorized : rawDetail;
    return { status, detail: rawDetail, issues: [], message };
  }

  if (isValidationIssueArray(rawDetail)) {
    const issues = rawDetail;
    const first = issues.find((issue) => typeof issue.msg === "string");
    return {
      status,
      detail: null,
      issues,
      message: first?.msg ? `${copy.validation}: ${first.msg}` : copy.validation,
    };
  }

  return { status, detail: null, issues: [], message: fallbackMessage(status) };
}

/** Convenience wrapper for call sites that only need something to display. */
export function getListingErrorMessage(error: unknown): string {
  return toListingApiError(error).message;
}
