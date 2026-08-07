import { z } from "zod";

// Login form validation. Password complexity is enforced by Supabase on sign-up;
// for sign-in we only require the field to be present.
export const loginSchema = z.object({
  email: z.string().min(1, "Ingresa tu email").email("Email inválido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
