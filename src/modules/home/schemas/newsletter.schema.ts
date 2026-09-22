import { z } from "zod";

/** Newsletter sign-up (Figma 10175:32110). One field, so one message. */
export const newsletterSchema = z.object({
  email: z.string().min(1, "Ingresa tu correo electrónico.").email("Ingresa un correo válido."),
});

export type NewsletterValues = z.infer<typeof newsletterSchema>;

export const defaultNewsletterValues: NewsletterValues = { email: "" };
