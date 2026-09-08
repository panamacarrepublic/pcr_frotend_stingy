import { z } from "zod";

import { DEFAULT_PHONE_PREFIX, PANAMA_PROVINCES } from "@/lib/panama";

// Login form validation. Password complexity is enforced by Supabase on sign-up;
// for sign-in we only require the field to be present.
export const loginSchema = z.object({
  email: z.string().min(1, "Ingresa tu email").email("Email inválido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// ---------------------------------------------------------------------------
// Sign-up
//
// The shape mirrors the database (verified against the live Supabase project),
// so the mapper is a pure split rather than a translation:
//
//   users            user_id · created_at · national_id! · email! · status · kind
//   regular_users    user_id · name · province · phone_prefix · phone
//   business_users   business_id · owner_id · business_name · manager_name ·
//                    logo_url? · phone_prefix · phone · email · ruc · province ·
//                    address · description? · status
//
// `national_id` and `email` are UNIQUE on `users`, and `ruc` is UNIQUE on
// `business_users`, so a valid form can still be rejected by the database —
// the UI has to render that failure, not just these rules.
// ---------------------------------------------------------------------------

/** `users.kind` also has `business_employee`, which a business creates for its
 *  staff — it is not something anyone can self-register as. */
export const accountKindEnum = z.enum(["regular", "business"]);
export type AccountKind = z.infer<typeof accountKindEnum>;

/**
 * Panamanian cédula: a short province/letter prefix, then two numeric groups
 * (`8-123-4567`, `PE-123-456`, `N-20-1234`).
 *
 * Deliberately structural rather than exhaustive — the authoritative check
 * belongs to whoever owns the registry. A regex that is too clever here would
 * lock out real people, and the UNIQUE constraint is what actually protects the
 * data.
 */
const NATIONAL_ID = /^[0-9A-Za-z]{1,4}-[0-9]{1,4}-[0-9]{1,6}$/;

const requiredText = (max: number, message: string) =>
  z.string().trim().min(1, message).max(max);

const nationalId = z
  .string()
  .trim()
  .min(1, "Ingresa tu documento de identidad")
  .regex(NATIONAL_ID, "Documento inválido (ej. 8-765-432)");

/**
 * The design has a single phone field, so the country code is not asked for.
 * `phone_prefix` is still NOT NULL on both profile tables, hence the default
 * rather than dropping the field: the row needs a value either way.
 */
const phone = z
  .string()
  .trim()
  .min(7, "Teléfono inválido")
  .max(15, "Teléfono inválido")
  .regex(/^[0-9\s-]+$/, "Teléfono inválido");

const province = z.enum(PANAMA_PROVINCES, {
  errorMap: () => ({ message: "Selecciona una provincia" }),
});

/** Exactly the rule printed under the field: "Mínimo 8 caracteres, una
 *  mayúscula y un número." Keep the two in sync — a helper text that promises
 *  less than the validator rejects is how sign-up forms feel broken. */
const password = z
  .string()
  .min(8, "Mínimo 8 caracteres")
  .regex(/[A-Z]/, "Incluye al menos una mayúscula")
  .regex(/[0-9]/, "Incluye al menos un número");

/** Everything that lands on `users`, in Supabase Auth, or on both profiles. */
const sharedFields = {
  national_id: nationalId,
  email: z.string().trim().min(1, "Ingresa tu email").email("Email inválido"),
  phone,
  phone_prefix: z.string().default(DEFAULT_PHONE_PREFIX),
  province,
  password,
  password_confirm: z.string().min(1, "Confirma tu contraseña"),
  terms_accepted: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar los términos y condiciones" }),
  }),
};

export const regularSignupSchema = z.object({
  kind: z.literal("regular"),
  name: requiredText(120, "Ingresa tu nombre"),
  ...sharedFields,
});

export const businessSignupSchema = z.object({
  kind: z.literal("business"),
  business_name: requiredText(160, "Ingresa el nombre de la empresa"),
  manager_name: requiredText(120, "Ingresa el nombre del encargado"),
  /** The design labels this "RUC (Opcional)*" — both at once. `business_users.ruc`
   *  is NOT NULL and UNIQUE, so required is the reading that can actually be
   *  written to the database. */
  ruc: requiredText(40, "Ingresa el RUC"),
  address: requiredText(200, "Ingresa la dirección del local"),
  /** Nullable in the database, so blank is allowed however the design marks it. */
  description: z.string().trim().max(500, "Máximo 500 caracteres").optional(),
  ...sharedFields,
});

export const signupSchema = z
  .discriminatedUnion("kind", [regularSignupSchema, businessSignupSchema])
  .superRefine((values, ctx) => {
    if (values.password !== values.password_confirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password_confirm"],
        message: "Las contraseñas no coinciden",
      });
    }
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
export type SignupFormInput = z.input<typeof signupSchema>;
export type RegularSignupValues = z.infer<typeof regularSignupSchema>;
export type BusinessSignupValues = z.infer<typeof businessSignupSchema>;
