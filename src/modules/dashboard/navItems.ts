import type { NavItem } from "@/modules/dashboard/types";

export const businessNavItems: NavItem[] = [
  { key: "overview", label: "Resumen General", icon: "Summarize", href: "/dashboard", info: true },
  { key: "messages", label: "Mensajes", icon: "ChatBubbleOutline", href: "/dashboard/mensajes", badge: 5 },
  { key: "inventory", label: "Inventario", icon: "PostAdd", href: "/dashboard/inventario", info: true },
  { key: "stats", label: "Estadísticas", icon: "BarChart", href: "/dashboard/estadisticas", info: true },
  { key: "billing", label: "Planes & Facturación", icon: "AccountBalanceWallet", href: "/dashboard/facturacion", info: true },
  { key: "notifications", label: "Notificaciones", icon: "NotificationsNone", href: "/dashboard/notificaciones", badge: 3 },
];

export const businessBottomNavItems: NavItem[] = [
  { key: "support", label: "Soporte", icon: "HelpOutline", href: "/dashboard/soporte" },
  { key: "settings", label: "Configuración", icon: "SettingsOutlined", href: "/dashboard/configuracion" },
];
