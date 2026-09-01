import { AxiosError, AxiosHeaders, type AxiosResponse } from "axios";

import { getListingErrorMessage, toListingApiError } from "../errors";
import { listingMessages } from "../../messages";

const copy = listingMessages.errors.api;

/** Builds an AxiosError carrying the given status/body, as axios would. */
function axiosErrorWith(status: number, data: unknown): AxiosError {
  const config = { headers: new AxiosHeaders() };
  const response = { status, data, statusText: "", headers: {}, config } as AxiosResponse;
  return new AxiosError("Request failed", "ERR_BAD_REQUEST", config, {}, response);
}

test("a string detail is surfaced verbatim — the backend already writes Spanish", () => {
  const error = axiosErrorWith(409, { detail: "El VIN ya está registrado." });

  expect(toListingApiError(error)).toMatchObject({
    status: 409,
    detail: "El VIN ya está registrado.",
    message: "El VIN ya está registrado.",
  });
});

test("the three flavours of 409 stay distinguishable by their message", () => {
  const readOnly = axiosErrorWith(409, { detail: "El anuncio ya fue vendido." });
  const transition = axiosErrorWith(409, { detail: "Transición de estado inválida." });

  expect(getListingErrorMessage(readOnly)).toBe("El anuncio ya fue vendido.");
  expect(getListingErrorMessage(transition)).toBe("Transición de estado inválida.");
});

test("an array detail (FastAPI validation) is not rendered as [object Object]", () => {
  const error = axiosErrorWith(422, {
    detail: [{ type: "greater_than", loc: ["body", "price"], msg: "Input should be greater than 0" }],
  });

  const normalized = toListingApiError(error);

  expect(normalized.message).not.toContain("[object Object]");
  expect(normalized.message).toContain("Input should be greater than 0");
  expect(normalized.detail).toBeNull();
  expect(normalized.issues).toHaveLength(1);
});

test("an array detail with no usable msg falls back to the generic validation copy", () => {
  const error = axiosErrorWith(422, { detail: [{ loc: ["body"] }] });

  expect(getListingErrorMessage(error)).toBe(copy.validation);
});

test("a response with no detail falls back to status-based copy", () => {
  expect(getListingErrorMessage(axiosErrorWith(401, {}))).toBe(copy.unauthorized);
  expect(getListingErrorMessage(axiosErrorWith(403, {}))).toBe(copy.forbidden);
  expect(getListingErrorMessage(axiosErrorWith(404, {}))).toBe(copy.notFound);
  expect(getListingErrorMessage(axiosErrorWith(500, {}))).toBe(copy.server);
});

test("a request that never got a response reads as a connectivity problem", () => {
  const offline = new AxiosError("Network Error", "ERR_NETWORK", { headers: new AxiosHeaders() });

  const normalized = toListingApiError(offline);

  expect(normalized.status).toBeNull();
  expect(normalized.message).toBe(copy.network);
});

test("FastAPI's English 'Not authenticated' is replaced with Spanish session copy", () => {
  // Verified against the running backend: a request with no Authorization header
  // is rejected by HTTPBearer as a 403 (not the 401 the contract doc claims),
  // with an untranslated detail string.
  const missingHeader = axiosErrorWith(403, { detail: "Not authenticated" });

  expect(getListingErrorMessage(missingHeader)).toBe(copy.unauthorized);
  // The raw server detail is still available for logging/debugging.
  expect(toListingApiError(missingHeader).detail).toBe("Not authenticated");
});

test("a genuine 403 about ownership still shows the backend's Spanish message", () => {
  const notYours = axiosErrorWith(403, { detail: "Este anuncio no te pertenece." });

  expect(getListingErrorMessage(notYours)).toBe("Este anuncio no te pertenece.");
});

test("a non-axios error keeps its own message", () => {
  expect(getListingErrorMessage(new Error("Tu sesión expiró."))).toBe("Tu sesión expiró.");
});
