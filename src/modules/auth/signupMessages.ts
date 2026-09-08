// Spanish (Panama) copy for the sign-up screen, transcribed from the Figma
// frames "SignUp / Particular / Desktop" and "SignUp / Empresa / Desktop".
// Copy lives here, not in JSX, so i18n stays possible later.
export const signupMessages = {
  title: "REGÍSTRATE",
  welcome: "¡Bienvenido a Panama Car Republic!",
  chooseKind: "Selecciona tu tipo de cuenta",
  kinds: { regular: "Particular", business: "Empresarial" },
  submit: "Sign Up",
  submitting: "Creando cuenta…",
  haveAccount: "Ya tienes una cuenta?",
  login: "Inicia Sesión",
  footer: "© 2025 Panama Car Republic",
  terms: { prefix: "Acepto los ", link: "términos y condiciones del servicio" },
  passwordHint: "Mínimo 8 caracteres, una mayúscula y un número.",
  fields: {
    name: "Nombre",
    phone: "Numero de Teléfono",
    email: "Email",
    nationalId: "Documento de Identidad",
    province: "Seleccione la Provincia",
    password: "Contraseña",
    passwordConfirm: "Confirme Contraseña",
    businessName: "Nombre de Empresa",
    managerName: "Nombre del Encargado",
    // Figma reads "RUC (Opcional)*", contradicting itself. `business_users.ruc`
    // is NOT NULL and UNIQUE, so the label matches what can be saved.
    ruc: "RUC",
    address: "Dirección del Local",
    description: "Descripción de la Empresa",
  },
  placeholders: {
    name: "Juan Pérez",
    phone: "6123-4567",
    email: "correo@ejemplo.com",
    nationalId: "8-765-432",
    province: "Selecciona Una...",
    businessName: "Panama Car Republic",
    managerName: "Carlos Gómez",
    businessEmail: "empresa@correo.com",
    ruc: "123456786-0",
    address: "Calle 50, Edificio Plaza",
    description: "Somos líderes en el mercado de vehículos...",
  },
  logo: {
    drop: "Arrastra y suelta archivos o ",
    browse: "Explorar",
    formats: "Formatos compatibles: SVG, EPS, AI, PDF, PNG, JPG",
    counter: (n: number) => `Subir Archivo - ${n}/1 files`,
    remove: "Quitar archivo",
  },
  social: {
    google: "Log in with Google",
    meta: "Log in with Meta",
    apple: "Log in with Apple",
  },
  imageAlt: {
    regular: "Persona usando una laptop",
    business: "Persona trabajando en una oficina",
  },
} as const;
