import { z } from "zod";

import { publishListingSchema } from "./listing.schema";

/**
 * Form contract for editing an existing listing.
 *
 * Deliberately derived from `publishListingSchema` rather than redeclared: the
 * two forms validate the same fields against the same rules, so a constraint
 * that changes on publish (title length, photo count, year bounds) cannot drift
 * out of sync with edit.
 *
 * The one field dropped is `terms_accepted` — a UI-only gate for the *first*
 * publish. Re-accepting the terms to fix a typo in the mileage makes no sense,
 * and it was never persisted anyway.
 *
 * `data.category` stays in the shape (the discriminated union needs it) but the
 * mapper never sends it: changing vertical is a different listing, not an edit.
 */
export const editListingSchema = publishListingSchema.omit({ terms_accepted: true });

export type EditListingInput = z.input<typeof editListingSchema>;
export type EditListingForm = z.output<typeof editListingSchema>;
