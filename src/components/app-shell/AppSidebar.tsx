"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock3, LayoutGrid, LogOut, UserRound } from "lucide-react";
import { useSyncExternalStore } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { ThemeSwitch } from "./ThemeSwitch";
import styles from "./AppSidebar.module.css";

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

const SIDEBAR_STORAGE_KEY = "meetsync-sidebar-collapsed";
const SIDEBAR_CHANGE_EVENT = "meetsync-sidebar-change";
let sidebarFallbackCollapsed = false;

function getSidebarSnapshot() {
  try {
    return localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
  } catch {
    return sidebarFallbackCollapsed;
  }
}

function subscribeToSidebar(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === SIDEBAR_STORAGE_KEY) onStoreChange();
  };

  window.addEventListener(SIDEBAR_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener(SIDEBAR_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", handleStorage);
  };
}

export function AppSidebar({ active, onNavigate }: AppSidebarProps) {
  const { user, logout } = useAuthStore();
  const isCollapsed = useSyncExternalStore(subscribeToSidebar, getSidebarSnapshot, () => false);

  const toggleSidebar = () => {
    sidebarFallbackCollapsed = !isCollapsed;
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(sidebarFallbackCollapsed));
    } catch {
      // The sidebar can still update for this page if storage is unavailable.
    }
    window.dispatchEvent(new Event(SIDEBAR_CHANGE_EVENT));
  };

  return (
    <aside className={`sidebar${isCollapsed ? " sidebar--collapsed" : ""}`}>
      <div className="sidebar__inner">
        <div className="sidebar__header">
          <Link href="/dashboard" className="sidebar__brand focus-ring-night">
            <span className="sidebar__brand-icon">
              <Image className="sidebar__brand-logo" src="/brand/EDIT1.webp" alt="" width={750} height={719} priority />
            </span>
            <span className="sidebar__brand-text">
              <span className="sidebar__brand-name">MeetSync</span>
              <span className="sidebar__brand-tagline">Meeting rooms</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={isCollapsed ? "ขยายแถบเมนู" : "ย่อแถบเมนู"}
            aria-expanded={!isCollapsed}
            title={isCollapsed ? "ขยายเมนู" : "ย่อเมนู"}
            data-tooltip={isCollapsed ? "ขยายเมนู" : "ย่อเมนู"}
            className={`sidebar__collapse-toggle ${styles.collapseToggle} focus-ring-night`}
          >
            <Image
              aria-hidden="true"
              className={styles.collapseToggleIcon}
              src="/brand/sidebar.png"
              alt=""
              width={512}
              height={512}
            />
          </button>
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
                  <span className="sidebar__nav-label">{label}</span>
                </>
              );
              return (
                <li key={section}>
                  {onNavigate ? (
                    <button
                      type="button"
                      onClick={() => onNavigate(section)}
                      aria-current={isActive ? "page" : undefined}
                      aria-label={label}
                      data-tooltip={label}
                      className={className}
                    >
                      {content}
                    </button>
                  ) : (
                    <Link
                      href={href}
                      aria-current={isActive ? "page" : undefined}
                      aria-label={label}
                      data-tooltip={label}
                      className={className}
                    >
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
              aria-label="แก้ไขโปรไฟล์"
              data-tooltip="แก้ไขโปรไฟล์"
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
              data-tooltip="ออกจากระบบ"
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
