import { z } from "zod";

/**
 * Blank/whitespace strings from empty MUI inputs should read as "not provided"
 * rather than "". Wrap an optional string schema so the output is
 * `string | undefined`.
 */
export const optionalText = (schema: z.ZodString) =>
  z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    schema.optional(),
  );

/**
 * Required numeric field fed by a text input. Empty string / null becomes
 * `undefined` (so `.positive()/.min()` reject it); other values are coerced to
 * numbers. Chain constraints on the returned schema at the call site.
 */
export const numeric = () =>
  z.preprocess((v) => (v === "" || v === null ? undefined : v), z.coerce.number());
