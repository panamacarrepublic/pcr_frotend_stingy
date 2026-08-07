// Spanish (Panama) copy for the login UI. Copy lives here, not in JSX,
// so i18n stays possible later.
export const loginMessages = {
  brand: "Panama Car Republic",
  title: "Bienvenido de nuevo",
  subtitle: "Inicia sesión para continuar",
  emailPlaceholder: "Email",
  passwordPlaceholder: "Contraseña",
  remember: "Recordarme",
  forgot: "¿Olvidaste tu contraseña?",
  recaptcha: "No soy un robot",
  recaptchaBrand: "reCAPTCHA",
  recaptchaLinks: "Privacidad · Términos",
  submit: "Log In",
  submitting: "Iniciando sesión…",
  errors: {
    invalidCredentials: "Email o contraseña incorrectos.",
    generic: "No pudimos iniciar sesión. Inténtalo de nuevo.",
  },
  noAccount: "¿Aún no tiene cuenta?",
  register: "Regístrate",
  social: {
    google: "Log in with Google",
    meta: "Log in with Meta",
    apple: "Log in with Apple",
  },
  footer: "© 2025 Panama Car Republic",
  imageAlt: "Pareja viendo vehículos en una tableta",
} as const;
