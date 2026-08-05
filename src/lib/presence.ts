export const HEARTBEAT_INTERVAL_MS = 5_000; // อัปเดตต่อเนื่องทุก x วิ ระหว่างเปิดแท็ปอยู่
export const STALE_AFTER_MS = 15_000; // ถ้าหยุดอัปเดตนานเกิน x วิ ระบบจะสรุปเองว่า "หายไปแล้ว"
// ตรงนี้มาแก้ได้

export function isSessionActive(session: {
  leftAt: Date | null;
  lastSeenAt: Date;
}): boolean {
  if (session.leftAt) return false;
  return Date.now() - session.lastSeenAt.getTime() < STALE_AFTER_MS;
}
