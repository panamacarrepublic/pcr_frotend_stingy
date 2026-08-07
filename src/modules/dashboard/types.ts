import type { DashboardProfile } from "@/components/layout/dashboard/types";

export type { NavItem, DashboardProfile } from "@/components/layout/dashboard/types";

// Back-compat alias — the business dashboard's profile is a plain DashboardProfile.
export type CompanyProfile = DashboardProfile;

export interface QuotaCardData {
  key: "hobbies" | "autos" | "piezas";
  label: string;
  icon: "toys_and_games" | "directions_car" | "tools_power_drill";
  used: number;
  total: number;
  variant: "warm" | "info" | "default";
}

export interface TopProduct {
  rank: number;
  imageUrl?: string;
  category: "Piezas & Accesorios" | "Vehículos";
  categoryTone: "azul" | "neutral";
  title: string;
  views: number;
}

export interface MessageItem {
  id: string;
  author: string;
  avatarUrl?: string;
  subject: string; // "Sobre: Toyota Prado 2020"
  snippet: string;
  date: string; // "12/04/2025"
  unread: boolean;
}

export interface ReviewItem {
  id: string;
  productTitle: string;
  imageUrl?: string;
  rating: number; // 4.5
  comments: number; // 3
  lastDate: string; // "12 dic 2025"
  unread: boolean;
}

export interface DashboardData {
  profile: CompanyProfile;
  quotas: QuotaCardData[];
  activeListings: { count: number };
  soldListings: { count: number; trendPct: number };
  verification: { status: string; detail: string; active: boolean };
  totalViews: { count: number; label: string };
  topProducts: TopProduct[];
  planRenewal: { tier: string; daysLeft: number };
  messages: MessageItem[];
  reviews: ReviewItem[];
}
