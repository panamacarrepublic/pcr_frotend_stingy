/**
 * Every user-facing string on the public home, transcribed from Figma
 * "Inicio • Desktop" (10167:12355).
 *
 * Copy lives here rather than in JSX so a future i18n pass has a single file to
 * extract. Spanish (Panama) is the only locale today.
 */
export const homeMessages = {
  banner: {
    title: "¡Mira nuestro nuevo video sobre la Exhibición de Autos Clásicos!",
    body: "Descubre los modelos más icónicos, revive el desfile y déjanos tu like para seguir compartiendo la pasión por los motores.",
    action: "Ver",
    dismiss: "Cerrar anuncio",
  },
  nav: {
    home: "Inicio",
    parts: "Piezas & Accesorios",
    vehicles: "Vehículos",
    hobbies: "Hobbies",
    more: "Más Opciones",
    signUp: "Crear Cuenta",
    signIn: "Iniciar",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    logoAlt: "Panama Car Republic",
  },
  hero: {
    headline: "¿Qué estás buscando hoy?",
    lead: "El marketplace automotriz más completo de Panamá. Miles de autos, piezas y coleccionables.",
    imageAlt: "Interior de un vehículo en venta en Panama Car Republic",
  },
  search: {
    legend: "Categoría a buscar",
    queryLabel: "¿Qué estás buscando?",
    queryPlaceholder: "¿Qué estás buscando?...",
    submit: "Buscar",
    placeholder: "Selecciona...",
    location: "Ubicación",
    price: "Precio",
    year: "Año",
  },
  categories: {
    heading: "Explora por categoría",
    cta: "Ver categoría",
  },
  featured: {
    tagline: "Destacados",
    heading: "Anuncios nuevos",
    lead: "Descubre lo mejor en vehículos y accesorios aquí",
    action: "Ver todo",
  },
  community: {
    headingBefore: "¡Únete a nuestra ",
    headingAccent: "comunidad",
    headingAfter: " hoy!",
    lead: "Regístrate ahora y descubre un mundo de oportunidades en la compra y venta de vehículos.",
    primary: "Registrarse",
    secondary: "Explorar",
    imageAlt: "Vehículo clásico azul estacionado",
  },
  marketplaceIntro: {
    headingBefore: "Descubre un mercado automotriz ",
    headingAccent: "accesible y moderno",
    headingAfter: " para todos.",
    lead: "Nuestro marketplace te permite comprar y vender vehículos, piezas y más de manera segura. Con herramientas avanzadas y un diseño intuitivo, tu experiencia será rápida y confiable.",
    features: [
      {
        title: "Fácil de usar",
        body: "Navega fácilmente entre categorías y encuentra lo que necesitas al instante.",
      },
      {
        title: "Seguridad garantizada",
        body: "Verificación de usuarios y reputación para una experiencia de compra confiable.",
      },
    ],
    imageAlt: "Pareja mirando el interior de un vehículo en venta",
  },
  benefits: {
    tagline: "Confianza",
    headingBefore: "Beneficios de usar nuestra ",
    headingAccent: "plataforma",
    lead: "Nuestra plataforma garantiza la seguridad a través de la verificación de ID y un sistema de reputación robusto. Esto asegura que tanto compradores como vendedores tengan una experiencia confiable y sin preocupaciones.",
    items: [
      "Chat integrado para comunicarte directo con vendedores.",
      "Panel de control para gestionar tus anuncios y ventas.",
      "Sistema de reportes para mantener la comunidad segura.",
    ],
    action: "Únete",
    imageAlt: "Mascota de Panama Car Republic usando la aplicación en su teléfono",
  },
  pricing: {
    tagline: "Precios",
    heading: "Planes de precios",
    lead: "Elige el plan que más se ajuste a tu personalidad.",
    audienceLabel: "Tipo de cuenta",
    action: "Comprar",
    perQuarter: "/TRIM",
  },
  merch: {
    tagline: "Merch",
    heading: "¡Compra nuestra mercancía!",
    lead: "Descubre nuestra exclusiva colección de productos.",
    action: "Ver todo",
    previous: "Producto anterior",
    next: "Producto siguiente",
    goToSlide: "Ir al grupo",
    carousel: "Carrusel de mercancía",
  },
  testimonials: {
    heading: "Testimonios de clientes",
    lead: "¡Una experiencia increíble comprando mi auto aquí!",
    rating: "5 de 5 estrellas",
  },
  events: {
    tagline: "Eventos",
    heading: "Calendario",
    lead: "Descubre todos los eventos emocionantes que están sucediendo en Panamá este mes.",
    action: "Ver detalles",
    toggleDay: "Mostrar u ocultar los eventos del día",
  },
  newsletter: {
    heading: "¡Suscríbete a nuestro boletín!",
    lead: "Recibe las últimas actualizaciones y promociones exclusivas directamente en tu correo electrónico.",
    emailLabel: "Correo electrónico",
    emailPlaceholder: "Ingresa tu correo",
    action: "Suscribirse",
    terms: "Al hacer clic en Suscribirse, aceptas nuestros Términos y Condiciones.",
  },
  contact: {
    tagline: "Contáctanos",
    heading: "Contáctanos",
    lead: "Estamos aquí para ayudarte con tus consultas.",
    email: "info@panamacarrepublik.com",
    phone: "+1 (555) 123-4567",
    address: "Calle Ejemplo 123, Ciudad de Panamá, PA",
    form: {
      name: "Nombre",
      email: "Correo",
      subject: "Asunto",
      message: "Mensaje",
      messagePlaceholder: "Escribe tu mensaje...",
      terms: "Acepto los Términos",
      action: "Enviar",
    },
  },
  footer: {
    contactLabel: "Contacto:",
    email: "daniel.mck@panamacarrepublic.com",
    wordmarkAlt: "Panama Car Republic",
    columns: [
      { heading: "Categorías", links: ["Autos", "Piezas & Accesorios", "Hobbies"] },
      { heading: "Compañía", links: ["Soporte", "Sobre Nosotros", "Guía de Seguridad"] },
    ],
    trust: ["Empresa Verificada", "SSL Seguro", "Pagos Protegidos", "Soporte 24/7"],
    copyright: "© 2024 Panama Car Republic. All rights reserved.",
    legal: ["Política de Privacidad", "Términos de Servicio", "Configuración de Cookies"],
    social: "Redes sociales",
  },
} as const;
