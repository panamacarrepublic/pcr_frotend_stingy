/**
 * Static content for the lower half of the public home, transcribed from Figma
 * "Inicio • Desktop" (10167:12355).
 *
 * Split from `content.ts` so neither file grows past a glance. Same caveat: all
 * of this is design content, not API data. Pricing plans, merch and events all
 * become query hooks once their endpoints exist.
 */

/* ── Pricing (Figma 10175:32030) ─────────────────────────────────────────── */

export type PricingAudience = "particular" | "empresarial";

export type PricingPlan = {
  id: string;
  name: string;
  /** Integer cents per quarter, so no float math reaches the price. */
  priceCents: number;
  features: readonly string[];
};

export const PRICING_AUDIENCES: readonly { id: PricingAudience; label: string; note: string }[] = [
  {
    id: "particular",
    label: "Particular",
    note: "¡Crear tu cuenta Particular es totalmente gratis! Empieza a explorar sin pagar un centavo.",
  },
  {
    id: "empresarial",
    label: "Empresarial",
    note: "Planes con mayor volumen de anuncios y herramientas de gestión para tu concesionario.",
  },
];

/**
 * Figma only draws the Particular tab. The Empresarial figures below are a
 * placeholder set at 4x the volume so the toggle has something to switch to.
 * TODO: replace with the real business tiers once commercial confirms them.
 */
export const PRICING_PLANS: Record<PricingAudience, readonly PricingPlan[]> = {
  particular: [
    {
      id: "particular-autos",
      name: "Plan Automóviles",
      priceCents: 1_500,
      features: ["2 Anuncios Incluidos", "Servicio de Fotografía", "Promoción en Redes Sociales"],
    },
    {
      id: "particular-piezas",
      name: "Plan Piezas",
      priceCents: 500,
      features: ["2 Anuncios Incluidos", "Servicio de Fotografía", "Promoción en Redes Sociales"],
    },
    {
      id: "particular-hobbies",
      name: "Plan Hobbies",
      priceCents: 200,
      features: ["5 Anuncios Incluidos", "Servicio de Fotografía", "Promoción en Redes Sociales"],
    },
  ],
  empresarial: [
    {
      id: "empresarial-autos",
      name: "Plan Automóviles",
      priceCents: 6_000,
      features: ["10 Anuncios Incluidos", "Servicio de Fotografía", "Promoción en Redes Sociales"],
    },
    {
      id: "empresarial-piezas",
      name: "Plan Piezas",
      priceCents: 2_000,
      features: ["10 Anuncios Incluidos", "Servicio de Fotografía", "Promoción en Redes Sociales"],
    },
    {
      id: "empresarial-hobbies",
      name: "Plan Hobbies",
      priceCents: 800,
      features: ["25 Anuncios Incluidos", "Servicio de Fotografía", "Promoción en Redes Sociales"],
    },
  ],
};

/* ── Merch slider (Figma 10928:8859) ─────────────────────────────────────── */

export type MerchItem = {
  id: string;
  name: string;
  variant: string;
  priceCents: number;
  imageSrc: string;
};

export const MERCH_ITEMS: readonly MerchItem[] = [
  { id: "camiseta", name: "Camiseta Logo", variant: "Negro", priceCents: 5_500, imageSrc: "/images/home/merch/camiseta-logo.png" },
  { id: "taza", name: "Taza Oficial", variant: "Blanco", priceCents: 5_500, imageSrc: "/images/home/merch/taza-oficial.png" },
  { id: "gorra", name: "Gorra Estilo", variant: "Rojo", priceCents: 5_500, imageSrc: "/images/home/merch/gorra-estilo.png" },
  { id: "sudadera", name: "Sudadera Clásica", variant: "Gris", priceCents: 5_500, imageSrc: "/images/home/merch/sudadera-clasica.png" },
  // Figma reuses one placeholder frame for the last two items — no art yet.
  { id: "mochila", name: "Mochila Estilo", variant: "Azul", priceCents: 5_500, imageSrc: "/images/home/merch/placeholder.png" },
  { id: "llaveros", name: "Llaveros Únicos", variant: "Metal", priceCents: 5_500, imageSrc: "/images/home/merch/placeholder.png" },
];

/* ── Testimonials (Figma 10285:20428) ────────────────────────────────────── */

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatarSrc: string;
};

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: "jaime",
    quote:
      "“Me gusta que toda la información está visible desde el principio. No hay sorpresas ni costos ocultos. Todo es transparente: precio, condición, historial. Así debe ser un marketplace moderno.”",
    name: "Jaime S.",
    role: "Comprador Frecuente",
    avatarSrc: "/images/home/avatars/jaime.png",
  },
  {
    id: "moises",
    quote:
      "“El chat interno es genial. Puedo hacer todas mis preguntas sin tener que compartir mi número personal. Me siento más seguro negociando dentro de la plataforma.”",
    name: "Moises A.",
    role: "Vendedor de Repuestos",
    avatarSrc: "/images/home/avatars/moises.png",
  },
];

/* ── Events calendar (Figma 10928:9327) ──────────────────────────────────── */

export type CalendarEvent = { id: string; time: string; title: string; location: string };

export type CalendarDay = {
  id: string;
  /** Figma renders the date as its own uppercase heading, e.g. "VIERNES 09 FEB". */
  label: string;
  events: readonly CalendarEvent[];
};

export const CALENDAR_DAYS: readonly CalendarDay[] = [
  {
    id: "viernes-09",
    label: "Viernes 09 Feb",
    events: [
      { id: "feria", time: "8:00 am", title: "Feria Automotriz", location: "Panamá" },
      { id: "conferencia", time: "9:00 am", title: "Conferencia de Autos", location: "Panamá" },
      { id: "taller", time: "10:00 am", title: "Taller de Mantenimiento", location: "Panamá Este" },
    ],
  },
  {
    id: "sabado-10",
    label: "Sábado 10 Feb",
    events: [
      { id: "exposicion", time: "8:00 am", title: "Exposición de Autos", location: "Chiriquí" },
      { id: "seminario", time: "9:00 am", title: "Seminario de Seguridad", location: "Darién" },
      { id: "foro", time: "10:00 am", title: "Foro de Innovación", location: "Los Santos" },
    ],
  },
  {
    id: "domingo-11",
    label: "Domingo 11 Feb",
    events: [
      { id: "cierre-eventos", time: "8:00 am", title: "Cierre de Eventos", location: "Los Santos" },
      { id: "reunion", time: "9:00 am", title: "Reunión de Conclusiones", location: "Herrera" },
      { id: "cierre-feria", time: "10:00 am", title: "Cierre de Feria", location: "Veraguas" },
    ],
  },
];
