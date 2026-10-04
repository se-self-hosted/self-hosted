"use client";

import { useSyncExternalStore } from "react";
import { FloatingLines } from "./FloatingLines";
import styles from "./LandingAnimatedBackground.module.css";

type Theme = "light" | "dark";

const ENABLED_WAVES = ["top", "middle", "bottom"] as const;
const LINE_COUNTS = [3, 4, 3] as const;
const LINE_DISTANCES = [8, 8, 8] as const;
const NIGHT_LINE_GRADIENT = ["#D4F36B", "#657A2D", "#D4F36B"] as const;
const DAY_LINE_GRADIENT = ["#141614", "#657A2D", "#141614"] as const;

function getTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  window.addEventListener("app-theme-change", onChange);
  return () => {
    observer.disconnect();
    window.removeEventListener("app-theme-change", onChange);
  };
}

type LandingAnimatedBackgroundProps = {
  forceDark?: boolean;
};

export function LandingAnimatedBackground({ forceDark = false }: LandingAnimatedBackgroundProps) {
  const theme = useSyncExternalStore(subscribeToTheme, getTheme, () => "light");
  const isDark = forceDark || theme === "dark";

  return (
    <div className={`${styles.background} ${isDark ? styles.backgroundDark : ""}`}>
      <FloatingLines
        enabledWaves={ENABLED_WAVES}
        lineCount={LINE_COUNTS}
        lineDistance={LINE_DISTANCES}
        bendRadius={8}
        bendStrength={-1.25}
        mouseDamping={0.045}
        interactive
        parallax
        parallaxStrength={0.08}
        animationSpeed={0.35}
        linesGradient={isDark ? NIGHT_LINE_GRADIENT : DAY_LINE_GRADIENT}
        backgroundColor={isDark ? "#141614" : "#F4F2EC"}
        lightMode={!isDark}
        className={styles.lines}
      />
    </div>
  );
}
