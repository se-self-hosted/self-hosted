"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Video } from "lucide-react";

export default function LoginPage() {
  const { user, isLoading, checkAuth, setUser } = useAuthStore();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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
    <div className="flex min-h-screen bg-white">
      {/* Left Pane - Hidden on Mobile */}
      <div className="hidden lg:flex lg:flex-col lg:w-[55%] bg-[#211E52] p-12 lg:p-16 text-white justify-between relative overflow-hidden">
        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="bg-[#5B4EFA] p-2 rounded-xl">
            <Video className="w-6 h-6 text-white" fill="currentColor" />
          </div>
          <span className="text-2xl font-bold tracking-tight">MeetSync</span>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 -mt-16">
          <p className="text-[#8B82FF] font-medium mb-4 text-lg">ระบบประชุมออนไลน์</p>
          <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] mb-6">
            ประชุมได้<br />ทุกที่ทุกเวลา
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-md">
            แพลตฟอร์มประชุมออนไลน์สำหรับทีมงานยุคใหม่ พร้อม
            ระบบ transcript และ AI summary อัตโนมัติ
          </p>
        </div>

        {/* Feature List */}
        <div className="relative z-10 flex flex-col gap-5 text-sm text-gray-300">
          <div className="flex items-center gap-4">
            <span className="text-2xl">🎙️</span>
            <span className="text-base font-medium">Real-time transcript อัตโนมัติ</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-2xl">🤖</span>
            <span className="text-base font-medium">AI สรุปประชุมทุกครั้ง</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-2xl">📊</span>
            <span className="text-base font-medium">ประวัติและ export รายงาน</span>
          </div>
        </div>
      </div>

      {/* Right Pane */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative">
        {/* Simple logo for mobile visible only on small screens */}
        <div className="flex lg:hidden items-center gap-2 mb-8 absolute top-6 left-6">
          <div className="bg-[#5B4EFA] p-1.5 rounded-lg">
            <Video className="w-5 h-5 text-white" fill="currentColor" />
          </div>
          <span className="text-xl font-bold text-gray-900">MeetSync</span>
        </div>

        <div className="w-full max-w-[420px]">
          <h2 className="text-[2rem] font-bold text-gray-900 mb-2">ยินดีต้อนรับ</h2>
          <p className="text-gray-500 mb-10 text-[15px]">เข้าสู่ระบบเพื่อจัดการห้องประชุมของคุณ</p>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-[15px] font-semibold text-gray-700 mb-2">อีเมล</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#5B4EFA] focus:border-[#5B4EFA] outline-none transition"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="block text-[15px] font-semibold text-gray-700 mb-2">รหัสผ่าน</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#5B4EFA] focus:border-[#5B4EFA] outline-none transition"
                placeholder="••••••••"
              />
              {/* <div className="flex justify-end mt-3">
                <Link href="#" className="text-[14px] text-[#5B4EFA] hover:underline">
                  ลืมรหัสผ่าน?
                </Link>
              </div> */}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 bg-[#5B4EFA] text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 disabled:opacity-70 transition flex justify-center items-center text-[15px]"
            >
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>
          
          {/* <p className="mt-10 text-center text-[15px] text-gray-500">
            ยังไม่มีบัญชี? <Link href="/register" className="text-[#5B4EFA] font-semibold hover:underline">สมัครสมาชิก</Link>
          </p> */}
        </div>
      </div>
    </div>
  );
}
