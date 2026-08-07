import { z } from "zod";

import { listingMessages } from "../messages";

const e = listingMessages.errors;

/**
 * Spanish (Panama) messages for the common zod issues this form produces, so
 * validation errors read in the app's language. Field-specific overrides (e.g.
 * terms_accepted) still win over this map. Passed to zodResolver's schemaOptions.
 */
export const listingErrorMap: z.ZodErrorMap = (issue, ctx) => {
  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      // Empty numeric inputs arrive as NaN; empty selects/strings as undefined.
      if (issue.expected === "number") return { message: "Ingresa un número válido" };
      return { message: e.required };
    case z.ZodIssueCode.too_small:
      if (issue.type === "string") return { message: e.required };
      if (issue.type === "array") return { message: e.photosMin };
      return { message: "Ingresa un valor válido" };
    case z.ZodIssueCode.too_big:
      if (issue.type === "array") return { message: e.photosMax };
      if (issue.type === "string") return { message: "El texto es demasiado largo" };
      return { message: "Ingresa un valor válido" };
    case z.ZodIssueCode.invalid_enum_value:
      return { message: "Selecciona una opción" };
    default:
      return { message: ctx.defaultError };
  }
};
