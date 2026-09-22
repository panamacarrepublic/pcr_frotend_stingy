import { z } from "zod";

/**
 * Contact form (Figma 10970:31899).
 *
 * Figma shows no validation states, so the rules here are the conventional
 * minimum: everything required, a real email, and the terms box ticked.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(1, "Ingresa tu nombre.").max(120),
  email: z.string().min(1, "Ingresa tu correo.").email("Ingresa un correo válido."),
  subject: z.string().trim().min(1, "Ingresa un asunto.").max(160),
  message: z.string().trim().min(1, "Escribe tu mensaje.").max(2000),
  acceptedTerms: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar los Términos para continuar." }),
  }),
});

export type ContactValues = z.infer<typeof contactSchema>;

export const defaultContactValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
  acceptedTerms: false as boolean,
};
