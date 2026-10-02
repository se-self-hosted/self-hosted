"use client";

import Link from "next/link";
import { Clock3, LayoutGrid, LogOut, UserRound, Video } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { ThemeSwitch } from "./ThemeSwitch";

export type AppSidebarSection = "dashboard" | "history" | "profile";

type AppSidebarProps = {
  active: AppSidebarSection;
  // When given, Dashboard/History switch in place (the dashboard's own tabs)
  // instead of navigating to their routes.
  onNavigate?: (section: "dashboard" | "history") => void;
};

const NAV_ITEMS = [
  { section: "dashboard", label: "แดชบอร์ด", href: "/dashboard", Icon: LayoutGrid },
  { section: "history", label: "ประวัติการประชุม", href: "/history", Icon: Clock3 },
] as const;

export function AppSidebar({ active, onNavigate }: AppSidebarProps) {
  const { user, logout } = useAuthStore();

  return (
    <aside className="sidebar">
      <div className="sidebar__inner">
        <div className="sidebar__header">
          <Link href="/dashboard" className="sidebar__brand focus-ring-night">
            <span className="sidebar__brand-icon">
              <Video aria-hidden="true" className="icon-20" strokeWidth={1.8} />
            </span>
            <span className="sidebar__brand-text">
              <span className="sidebar__brand-name">MeetSync</span>
              <span className="sidebar__brand-tagline">Meeting rooms</span>
            </span>
          </Link>
          {user && (
            <button
              type="button"
              onClick={() => logout()}
              aria-label="ออกจากระบบ"
              className="sidebar__logout-mobile focus-ring-night"
            >
              <LogOut aria-hidden="true" className="icon-18" />
              <span className="sidebar__logout-label">Logout</span>
            </button>
          )}
        </div>

        <div className="sidebar__theme">
          <ThemeSwitch />
        </div>

        <nav aria-label="เมนูหลัก" className="sidebar__nav">
          <ul className="sidebar__nav-grid">
            {NAV_ITEMS.map(({ section, label, href, Icon }) => {
              const isActive = active === section;
              const className = `${isActive ? "sidebar__nav-link--active" : "sidebar__nav-link"} focus-ring-night`;
              const content = (
                <>
                  <Icon aria-hidden="true" className="icon-20" strokeWidth={1.8} />
                  {label}
                </>
              );
              return (
                <li key={section}>
                  {onNavigate ? (
                    <button
                      type="button"
                      onClick={() => onNavigate(section)}
                      aria-current={isActive ? "page" : undefined}
                      className={className}
                    >
                      {content}
                    </button>
                  ) : (
                    <Link href={href} aria-current={isActive ? "page" : undefined} className={className}>
                      {content}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {user && (
          <div className="sidebar__footer">
            <Link
              href="/account/edit"
              aria-current={active === "profile" ? "page" : undefined}
              className={`${active === "profile" ? "sidebar__user-link--active" : "sidebar__user-link"} focus-ring-night`}
            >
              <span className="sidebar__avatar">
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatarUrl} alt="" className="sidebar__avatar-image" />
                ) : (
                  <UserRound aria-hidden="true" className="icon-18" strokeWidth={1.8} />
                )}
              </span>
              <span className="sidebar__user-info">
                <span className="sidebar__user-name">{user.fullname || "Host"}</span>
                <span className="sidebar__user-email">แก้ไขโปรไฟล์</span>
              </span>
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              aria-label="ออกจากระบบ"
              title="ออกจากระบบ"
              className="sidebar__logout-desktop focus-ring-night"
            >
              <LogOut aria-hidden="true" className="icon-18" strokeWidth={1.8} />
              <span className="sidebar__logout-label">Logout</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
