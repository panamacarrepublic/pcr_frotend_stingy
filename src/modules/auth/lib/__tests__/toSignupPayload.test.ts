import { signupSchema } from "../../schemas";
import { toSignupPayload } from "../toSignupPayload";

const regularForm = (overrides: Record<string, unknown> = {}) =>
  signupSchema.parse({
    kind: "regular",
    name: "Diego Sastoque",
    national_id: "8-123-4567",
    email: "diego@example.com",
    phone: "61234567",
    province: "Panamá",
    password: "Contrasena1",
    password_confirm: "Contrasena1",
    terms_accepted: true,
    ...overrides,
  });

const businessForm = (overrides: Record<string, unknown> = {}) =>
  signupSchema.parse({
    kind: "business",
    business_name: "AutoTech S.A.",
    manager_name: "Diego Sastoque",
    national_id: "8-123-4567",
    ruc: "155123456-2-2015",
    email: "diego@example.com",
    phone: "61234567",
    province: "Panamá",
    address: "Vía España, Edificio 5",
    description: "Concesionario de vehículos usados.",
    password: "Contrasena1",
    password_confirm: "Contrasena1",
    terms_accepted: true,
    ...overrides,
  });

describe("signupSchema", () => {
  it("accepts a complete particular sign-up", () => {
    expect(() => regularForm()).not.toThrow();
  });

  it("accepts a complete business sign-up", () => {
    expect(() => businessForm()).not.toThrow();
  });

  // users.national_id is NOT NULL and UNIQUE for every kind of user, business
  // owners included — it is not a particular-only field.
  it("requires the national id on the business branch too", () => {
    expect(() => businessForm({ national_id: "" })).toThrow();
  });

  it("rejects a mistyped password confirmation", () => {
    expect(() => regularForm({ password_confirm: "Otra1234" })).toThrow();
  });

  it("rejects an unchecked terms box", () => {
    expect(() => regularForm({ terms_accepted: false })).toThrow();
  });

  it("rejects a malformed cédula", () => {
    expect(() => regularForm({ national_id: "no-es-una-cedula-valida!" })).toThrow();
  });

  // The helper text under the field promises exactly this rule.
  it.each([
    ["sin mayúscula", "contrasena1"],
    ["sin número", "Contrasenaa"],
    ["muy corta", "Contr1"],
  ])("rejects a password %s", (_label, value) => {
    expect(() => regularForm({ password: value, password_confirm: value })).toThrow();
  });

  it("requires the RUC on a business sign-up", () => {
    expect(() => businessForm({ ruc: "" })).toThrow();
  });

  // business_users.description and logo_url are the only nullable profile
  // columns, so they are the only optional fields on that branch.
  it("accepts a business sign-up with no description", () => {
    expect(() => businessForm({ description: "" })).not.toThrow();
  });

  it("requires the business address", () => {
    expect(() => businessForm({ address: "" })).toThrow();
  });
});

describe("toSignupPayload", () => {
  // The password belongs to auth.users, never to the profile tables, so the
  // payload keeps the two apart the way the two calls will.
  it("separates the Supabase credentials from the profile rows", () => {
    const payload = toSignupPayload(regularForm());

    expect(payload.credentials).toEqual({
      email: "diego@example.com",
      password: "Contrasena1",
    });
    expect(payload.user).not.toHaveProperty("password");
    expect(payload.profile).not.toHaveProperty("password");
  });

  it("builds the users row for a particular", () => {
    const payload = toSignupPayload(regularForm());
    expect(payload.user).toEqual({
      email: "diego@example.com",
      national_id: "8-123-4567",
      kind: "regular",
    });
  });

  // The design asks for one phone field, but both profile tables have a NOT
  // NULL phone_prefix, so the row still needs a country code.
  it("builds the regular_users row, defaulting the country code the form never asks for", () => {
    const payload = toSignupPayload(regularForm());
    expect(payload.profile).toEqual({
      name: "Diego Sastoque",
      province: "Panamá",
      phone_prefix: "+507",
      phone: "61234567",
    });
  });

  it("builds the business_users row with exactly its columns", () => {
    const payload = toSignupPayload(businessForm());
    expect(payload.user.kind).toBe("business");
    expect(payload.profile).toEqual({
      business_name: "AutoTech S.A.",
      manager_name: "Diego Sastoque",
      phone_prefix: "+507",
      phone: "61234567",
      email: "diego@example.com",
      ruc: "155123456-2-2015",
      province: "Panamá",
      address: "Vía España, Edificio 5",
      description: "Concesionario de vehículos usados.",
    });
  });

  // The design asks for a single email, but the database keeps two columns —
  // the owner's login and the business's public address. Both are seeded from
  // the one input, and both are still filled.
  it("fills the users and business_users emails from the single field", () => {
    const payload = toSignupPayload(businessForm({ email: "Ventas@AutoTech.com" }));
    expect(payload.credentials.email).toBe("ventas@autotech.com");
    expect(payload.user.email).toBe("ventas@autotech.com");
    expect((payload.profile as { email: string }).email).toBe("ventas@autotech.com");
  });

  it("omits an empty description rather than sending a blank string", () => {
    const payload = toSignupPayload(businessForm({ description: "" }));
    expect(payload.profile).not.toHaveProperty("description");
  });

  // `status` defaults to `pending` and `user_id` comes from the auth session;
  // sending either from the client would be the client deciding its own state.
  it("never sends server-owned columns", () => {
    const payload = toSignupPayload(businessForm());
    const flat = { ...payload.user, ...payload.profile } as Record<string, unknown>;
    ["status", "user_id", "business_id", "owner_id", "created_at"].forEach((key) => {
      expect(flat).not.toHaveProperty(key);
    });
  });

  it("normalizes the email so a stray capital cannot create a duplicate", () => {
    const payload = toSignupPayload(regularForm({ email: "  Diego@Example.COM  " }));
    expect(payload.credentials.email).toBe("diego@example.com");
    expect(payload.user.email).toBe("diego@example.com");
  });
});
