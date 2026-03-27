import type { ReactNode } from "react";
import type { NavIconId } from "./nav-items";

const stroke = {
  width: 1.5 as const,
  cap: "round" as const,
  join: "round" as const,
};

function IconShell({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke.width}
      strokeLinecap={stroke.cap}
      strokeLinejoin={stroke.join}
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

/** Refined outline icons — match link color via `currentColor`. */
export function NavMenuIcon({
  id,
  className = "size-[18px] shrink-0 sm:size-5",
}: {
  id: NavIconId;
  className?: string;
}) {
  switch (id) {
    case "home":
      return (
        <IconShell className={className}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </IconShell>
      );
    case "service":
      return (
        <IconShell className={className}>
          {/* wand + sparkle */}
          <path d="M4.5 19.5 14.8 9.2" />
          <path d="M12.9 7.3 16.7 11.1" />
          <path d="M17.8 6.2l.6-1.7.6 1.7 1.7.6-1.7.6-.6 1.7-.6-1.7-1.7-.6 1.7-.6Z" />
          <path d="M8.6 4.4l.5-1.4.5 1.4 1.4.5-1.4.5-.5 1.4-.5-1.4-1.4-.5 1.4-.5Z" />
        </IconShell>
      );
    case "approach":
      return (
        <IconShell className={className}>
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </IconShell>
      );
    case "portfolio":
      return (
        <IconShell className={className}>
          <rect x="3" y="3" width="7.5" height="7.5" rx="1.25" />
          <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.25" />
          <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.25" />
          <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.25" />
        </IconShell>
      );
    case "team":
      return (
        <IconShell className={className}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </IconShell>
      );
    case "contact":
      return (
        <IconShell className={className}>
          <path d="M4 6.75A2.75 2.75 0 0 1 6.75 4h10.5A2.75 2.75 0 0 1 20 6.75v10.5A2.75 2.75 0 0 1 17.25 20H6.75A2.75 2.75 0 0 1 4 17.25V6.75Z" />
          <path d="m4 7 7.89 5.26a2 2 0 0 0 2.22 0L20 7" />
        </IconShell>
      );
    default:
      return null;
  }
}
