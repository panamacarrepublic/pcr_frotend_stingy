/**
 * Sign-up form values → the objects the two writes will need.
 *
 * Registration is two steps against two different systems, so the payload is
 * split the same way instead of being one flat blob:
 *
 *   1. `credentials` → `supabase.auth.signUp`, which owns the password
 *      (CLAUDE.md: sign-in and sign-up go straight to Supabase, never through
 *      the FastAPI auth endpoints).
 *   2. `user` + `profile` → the `users` row and the kind-specific profile row,
 *      keyed by the id the first step returns.
 *
 * Server-owned columns are absent on purpose: `user_id`/`business_id`/`owner_id`
 * come from the auth session, `created_at` from the database, and `status`
 * defaults to `pending` — a client that sends its own status is a client that
 * can activate itself.
 */
import type { AccountKind, SignupFormValues } from "../schemas";

export interface SignupCredentials {
  email: string;
  password: string;
}

/** The `users` row, minus everything the server fills in. */
export interface SignupUserRow {
  email: string;
  national_id: string;
  kind: AccountKind;
}

/** The `regular_users` row. */
export interface RegularProfileRow {
  name: string;
  province: string;
  phone_prefix: string;
  phone: string;
}

/** The `business_users` row. `logo_url` is absent: there is no upload on this
 *  screen, and the column is nullable. */
export interface BusinessProfileRow {
  business_name: string;
  manager_name: string;
  phone_prefix: string;
  phone: string;
  email: string;
  ruc: string;
  province: string;
  address: string;
  description?: string;
}

export interface SignupPayload {
  credentials: SignupCredentials;
  user: SignupUserRow;
  profile: RegularProfileRow | BusinessProfileRow;
}

/**
 * Lowercased and trimmed. `users.email` is UNIQUE, and Postgres compares text
 * case-sensitively, so `Diego@x.com` and `diego@x.com` would otherwise be two
 * accounts for one person.
 */
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function toSignupPayload(values: SignupFormValues): SignupPayload {
  const email = normalizeEmail(values.email);

  const user: SignupUserRow = {
    email,
    national_id: values.national_id,
    kind: values.kind,
  };

  const credentials: SignupCredentials = { email, password: values.password };

  if (values.kind === "regular") {
    return {
      credentials,
      user,
      profile: {
        name: values.name,
        province: values.province,
        phone_prefix: values.phone_prefix,
        phone: values.phone,
      },
    };
  }

  const profile: BusinessProfileRow = {
    business_name: values.business_name,
    manager_name: values.manager_name,
    phone_prefix: values.phone_prefix,
    phone: values.phone,
    // `business_users.email` is its own column, but the form asks for one
    // address, so both start out the same. The split still matters later: a
    // business can change its public contact email without moving the owner's
    // login.
    email,
    ruc: values.ruc,
    province: values.province,
    address: values.address,
  };

  // The column is nullable, so a blank textarea means "no description" rather
  // than an empty string sitting in the database.
  if (values.description) profile.description = values.description;

  return { credentials, user, profile };
}
