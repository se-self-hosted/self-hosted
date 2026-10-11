import Image from "next/image";
import styles from "./MeetSyncLogo.module.css";

type MeetSyncLogoProps = {
  className?: string;
  showWordmark?: boolean;
  size?: "small" | "medium" | "large";
};

export function MeetSyncLogo({ className = "", showWordmark = true, size = "medium" }: MeetSyncLogoProps) {
  return (
    <div className={`${styles.logo} ${styles[size]} ${className}`} role="img" aria-label="MeetSync">
      <Image className={styles.mark} src="/brand/EDIT1.webp" alt="" width={750} height={719} priority />
      {showWordmark && <span className={styles.wordmark}>MeetSync</span>}
    </div>
  );
}
