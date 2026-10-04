"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { LoginScreen } from "@/components/auth/LoginScreen";
import { LandingAnimatedBackground } from "./LandingAnimatedBackground";
import { LandingThemeToggle } from "./LandingThemeToggle";
import styles from "./LandingWelcomePreview.module.css";

type PreviewPhase = "welcome" | "leaving" | "login";

const TRANSITION_MS = 560;

export function LandingWelcomeFlow() {
  const [phase, setPhase] = useState<PreviewPhase>("welcome");
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (transitionTimer.current) clearTimeout(transitionTimer.current);
    };
  }, []);

  const showLogin = () => {
    if (phase !== "welcome") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPhase("leaving");
    transitionTimer.current = setTimeout(() => setPhase("login"), reduceMotion ? 0 : TRANSITION_MS);
  };

  return (
    <>
      <LandingAnimatedBackground forceDark={phase !== "login"} />

      {phase === "login" ? (
        <div className={styles.loginStage} data-preview-stage="login">
          <LoginScreen />
          <div className={styles.themeToggle}>
            <LandingThemeToggle />
          </div>
        </div>
      ) : (
        <section
          className={`${styles.welcomeStage} ${phase === "leaving" ? styles.welcomeStageLeaving : ""}`}
          aria-labelledby="welcome-title"
        >
          <div className={styles.content}>
            <div className={styles.brandBox}>
              <Image className={styles.logo} src="/brand/EDIT1.webp" alt="" width={750} height={719} priority />
              <span className={styles.wordmark}>MeetSync</span>
            </div>

            <p className={styles.description}>Web-based Real-time Voice Meeting Platform</p>
            <h1 id="welcome-title" className={styles.title}>ยินดีต้อนรับ</h1>

            <button className={styles.getStarted} type="button" onClick={showLogin} disabled={phase === "leaving"}>
              <span className={styles.circle} aria-hidden="true">
                <span className={styles.arrow} />
              </span>
              <span className={styles.buttonText}>เริ่ม</span>
            </button>
          </div>
        </section>
      )}
    </>
  );
}

export function LandingWelcomePreview() {
  return <LandingWelcomeFlow />;
}
