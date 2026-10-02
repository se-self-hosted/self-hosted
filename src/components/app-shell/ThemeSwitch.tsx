"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "theme";
const THEME_CHANGE_EVENT = "app-theme-change";

function getThemeSnapshot(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribeToTheme(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    document.documentElement.dataset.theme = event.newValue === "dark" ? "dark" : "light";
    onStoreChange();
  };

  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", handleStorage);
  };
}

export function ThemeSwitch() {
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, () => "light");

  const handleThemeChange = (nextTheme: Theme) => {
    document.documentElement.dataset.theme = nextTheme;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // The selected theme still applies for this page if storage is unavailable.
    }
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  };

  const isNight = theme === "dark";

  return (
    <div className="theme-switch">
      <span className="theme-switch__indicator" aria-hidden="true">
        {isNight ? <Moon className="icon-16" strokeWidth={2} /> : <Sun className="icon-16" strokeWidth={2} />}
      </span>
      <div className="theme-switch__control">
        <input
          id="app-theme-switch"
          type="checkbox"
          className="theme-switch__input"
          checked={isNight}
          onChange={(event) => handleThemeChange(event.target.checked ? "dark" : "light")}
          aria-label="เปลี่ยนโหมดสี"
        />
        <label className="theme-switch__track" htmlFor="app-theme-switch">
          <span className="theme-switch__label">Day</span>
          <span className="theme-switch__label">Night</span>
          <span className="theme-switch__thumb" aria-hidden="true" />
        </label>
      </div>
    </div>
  );
}
