// Role-agnostic layout types shared by every dashboard (business/particular/admin).
export interface NavItem {
  key: string;
  label: string;
  icon: string; // key into NAV_ICONS
  href: string;
  badge?: number;
  info?: boolean; // trailing info icon
}

export interface DashboardProfile {
  name: string;
  email: string;
  avatarUrl?: string;
}
