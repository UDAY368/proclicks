export const NAV_ICON_IDS = [
  "home",
  "service",
  "approach",
  "portfolio",
  "team",
  "contact",
] as const;

export type NavIconId = (typeof NAV_ICON_IDS)[number];

export type NavItem = {
  label: string;
  href: string;
  icon: NavIconId;
};

export const SITE_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "#home", icon: "home" },
  { label: "Services", href: "#about", icon: "service" },
  { label: "Approach", href: "#approach", icon: "approach" },
  { label: "Portfolio", href: "#portfolio", icon: "portfolio" },
  { label: "Team", href: "#team", icon: "team" },
  { label: "Contact Us", href: "#contact", icon: "contact" },
];

export const HOME_NAV_ITEM = SITE_NAV_ITEMS[0]!;
