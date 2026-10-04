"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import { FileDown, Mic, Sparkles } from "lucide-react";

type LoginScreenProps = {
  checkAuthOnMount?: boolean;
};

export function LoginScreen({ checkAuthOnMount = true }: LoginScreenProps) {
  const { user, isLoading, checkAuth, setUser } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (checkAuthOnMount) checkAuth();
  }, [checkAuth, checkAuthOnMount]);

  useEffect(() => {
    if (!isLoading && user) {
      window.location.href = "/dashboard";
    }
  }, [user, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data: Record<string, unknown> = {};
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }

      if (!res.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "Failed to login");
      }

      setUser(data.user as Parameters<typeof setUser>[0]);
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-paper text-ink">
      {/* Left Pane - Hidden on Mobile */}
      <div className="hidden lg:flex lg:flex-col lg:w-[52%] bg-night p-12 lg:p-16 text-night-text justify-between relative overflow-hidden">
        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex size-11 items-center justify-center rounded-xl bg-night-3 text-accent">
            <Image src="/brand/EDIT1.webp" alt="" width={750} height={719} priority className="h-auto w-9 object-contain" />
          </div>
          <span className="font-display text-2xl font-bold tracking-[-0.01em] text-night-strong">MeetSync</span>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 -mt-16">
          <p className="mb-4 text-lg font-medium text-accent">ระบบประชุมออนไลน์</p>
          <h1 className="mb-6 font-display text-5xl font-bold leading-[1.25] tracking-[-0.02em] text-night-strong lg:text-7xl">
            ประชุมได้<br />ทุกที่ทุกเวลา
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-night-muted">
            แพลตฟอร์มประชุมออนไลน์สำหรับทีมงานยุคใหม่ พร้อม
            ระบบ transcript และ AI summary อัตโนมัติ
          </p>
        </div>

        {/* Feature List */}
        <ul className="relative z-10 flex flex-col gap-4 text-base font-medium text-night-text">
          <li className="flex items-center gap-4">
            <span className="flex size-10 items-center justify-center rounded-[10px] bg-night-3 text-accent">
              <Mic className="size-5" strokeWidth={1.8} aria-hidden="true" />
            </span>
            Real-time transcript อัตโนมัติ
          </li>
          <li className="flex items-center gap-4">
            <span className="flex size-10 items-center justify-center rounded-[10px] bg-night-3 text-accent">
              <Sparkles className="size-5" strokeWidth={1.8} aria-hidden="true" />
            </span>
            AI สรุปประชุมทุกครั้ง
          </li>
          <li className="flex items-center gap-4">
            <span className="flex size-10 items-center justify-center rounded-[10px] bg-night-3 text-accent">
              <FileDown className="size-5" strokeWidth={1.8} aria-hidden="true" />
            </span>
            ประวัติและ export รายงาน
          </li>
        </ul>
      </div>

      {/* Right Pane */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-12 relative">
        {/* Simple logo for mobile visible only on small screens */}
        <div className="flex lg:hidden items-center gap-2.5 absolute top-6 left-4 sm:left-6">
          <div className="flex size-9 items-center justify-center rounded-[10px] bg-night text-accent">
            <Image src="/brand/EDIT1.webp" alt="" width={750} height={719} priority className="h-auto w-7 object-contain" />
          </div>
          <span className="font-display text-xl font-bold">MeetSync</span>
        </div>

        <div className="w-full max-w-[440px] rounded-[20px] border border-line bg-surface p-6 shadow-[0_20px_60px_rgba(27,29,28,0.08)] sm:p-10">
          <h2 className="mb-2 font-display text-[32px] font-bold tracking-[-0.02em]">ยินดีต้อนรับ</h2>
          <p className="mb-8 text-[15px] text-muted">เข้าสู่ระบบเพื่อจัดการห้องประชุมของคุณ</p>

          {error && (
            <div role="alert" className="mb-6 rounded-[10px] border border-bad-line bg-bad-bg px-4 py-3 text-sm text-bad-deep">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="login-email" className="text-sm font-semibold">อีเมล</label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field-input"
                placeholder="you@company.com"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="login-password" className="text-sm font-semibold">รหัสผ่าน</label>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field-input"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn--primary action-fill focus-ring mt-2 h-[52px] w-full text-base"
            >
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
