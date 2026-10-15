"use client";

import Link from "next/link";
import {
  Camera,
  Check,
  CircleAlert,
  KeyRound,
  Mail,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { AVATAR_ERROR_PREFIX, AVATAR_MAX_DIMENSION, avatarSizeError, checkAvatar } from "@/lib/avatar";
import { AppSidebar } from "@/components/app-shell/AppSidebar";
import { PasswordInput } from "@/components/auth/PasswordInput";

export default function EditProfilePage() {
  const { user, checkAuth, setUser } = useAuthStore();
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saved, setSaved] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const displayName = user?.fullname ?? "";
  const displayEmail = user?.email ?? "";
  const initials = (displayName || displayEmail || "Host")
    .split(/[\s@]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const passwordMismatch = Boolean(
    password && confirmPassword && password !== confirmPassword,
  );

  /** Uploads the chosen photo right away; the same checks run here first for instant feedback. */
  async function handleAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Clear the input so choosing the same file again still fires a change.
    event.target.value = "";
    if (!file) return;

    const fail = (reason: string) => setAvatarError(`${AVATAR_ERROR_PREFIX}: ${reason}`);
    setAvatarError(null);
    const sizeError = avatarSizeError(file.size);
    if (sizeError) return fail(sizeError);
    const check = checkAvatar(new Uint8Array(await file.arrayBuffer()));
    if (!check.ok) return fail(check.reason);

    setAvatarUploading(true);
    try {
      const body = new FormData();
      body.append("avatar", file);
      const res = await fetch("/api/account/avatar", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.user) return fail(data.error ?? "เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง");
      setUser(data.user);
    } catch {
      fail("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setAvatarUploading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (passwordMismatch || saving) return;
    const fullname = String(new FormData(event.currentTarget).get("fullname") ?? "");

    setSaving(true);
    setSaveError(null);
    setCurrentPasswordError(null);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, ...(password ? { password, currentPassword } : {}) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.user) {
        const reason = data.error ?? "เกิดข้อผิดพลาดในระบบ";
        if (data.field === "currentPassword") setCurrentPasswordError(reason);
        setSaveError(`บันทึกไม่สำเร็จ: ${reason}`);
        return;
      }
      setUser(data.user);
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2600);
    } catch {
      setSaveError("บันทึกไม่สำเร็จ: เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="dashboard">
      <AppSidebar active="profile" />

      <main className="dashboard__main">
        <div className="profile-content">
          <div className="profile-page-header">
            <p className="eyebrow">การตั้งค่าบัญชี</p>
            <h1 className="profile-title">แก้ไขโปรไฟล์</h1>
            <p className="profile-description">จัดการข้อมูลส่วนตัวและข้อมูลการเข้าสู่ระบบของบัญชีของคุณ</p>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            <section className="profile-section">
              <div className="profile-section__header">
                <h2 className="profile-section__title">ข้อมูลโปรไฟล์</h2>
                <p className="profile-section__subtitle">ข้อมูลที่แสดงในห้องประชุมของคุณ</p>
              </div>

              <div className="profile-section__body">
                {avatarError && (
                  <div role="alert" className="profile-photo-error">
                    <CircleAlert aria-hidden="true" size={16} className="mt-px shrink-0" />
                    <span className="flex-1">{avatarError}</span>
                    <button type="button" onClick={() => setAvatarError(null)} aria-label="ปิดข้อความแจ้งเตือน" className="profile-photo-error__close">
                      <X aria-hidden="true" size={15} />
                    </button>
                  </div>
                )}
                <div className="profile-photo-column">
                  <p className="profile-photo-label">รูปโปรไฟล์</p>
                  <div className="profile-photo-frame group">
                    {user?.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.avatarUrl} alt="รูปโปรไฟล์" className="profile-photo-image" />
                    ) : (
                      <div className="profile-photo-placeholder">{initials || "H"}</div>
                    )}
                    <button type="button" onClick={() => fileInput.current?.click()} disabled={avatarUploading} className="profile-photo-change-btn">
                      <Camera size={15} /> เปลี่ยนรูป
                    </button>
                  </div>
                  <input ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleAvatar} className="sr-only" />
                  <button type="button" onClick={() => fileInput.current?.click()} disabled={avatarUploading} className="profile-photo-upload-btn action-fill focus-ring"><Upload size={16} strokeWidth={1.8} />{avatarUploading ? "กำลังอัปโหลด…" : "อัปโหลดรูปใหม่"}</button>
                  <p className="profile-photo-hint">รองรับ JPG, PNG หรือ WebP ขนาดไม่เกิน 5 MB<br />ความละเอียดสูงสุด {AVATAR_MAX_DIMENSION}×{AVATAR_MAX_DIMENSION} พิกเซล</p>
                </div>

                <div className="profile-fields-grid">
                  <Field label="ชื่อ-นามสกุล" icon={<UserRound size={15} />}>
                    <input key={user?.id ?? "signed-out"} id="fullname" name="fullname" required maxLength={100} defaultValue={displayName} placeholder="ชื่อ-นามสกุลของคุณ" className="profile-input" />
                  </Field>
                  <Field label="อีเมล" icon={<Mail size={15} />}>
                    <input id="email" name="email" type="email" readOnly value={displayEmail} placeholder="name@company.com" className="profile-input" />
                  </Field>
                </div>
              </div>
            </section>

            <section id="security" className="profile-section">
              <div className="profile-section__header--with-icon">
                <span className="profile-section__icon"><KeyRound size={20} strokeWidth={1.8} /></span>
                <div>
                  <h2 className="profile-section__title">รหัสผ่านและความปลอดภัย</h2>
                  <p className="profile-section__subtitle">หากไม่ต้องการเปลี่ยนรหัสผ่าน ให้เว้นช่องรหัสผ่านใหม่ไว้</p>
                </div>
              </div>
              <div className="profile-section__body-security">
                <div className="profile-field-full">
                  <Field label="รหัสผ่านปัจจุบัน">
                    <PasswordInput
                      name="current-password"
                      autoComplete="current-password"
                      value={currentPassword}
                      onChange={(event) => {
                        setCurrentPassword(event.target.value);
                        setCurrentPasswordError(null);
                      }}
                      required={Boolean(password)}
                      placeholder="กรุณากรอกรหัสผ่านปัจจุบันเพื่อเปลี่ยนรหัสผ่าน"
                      invalid={Boolean(currentPasswordError)}
                    />
                    {currentPasswordError && <p className="profile-mismatch-text">{currentPasswordError}</p>}
                  </Field>
                </div>
                <Field label="รหัสผ่านใหม่">
                  <PasswordInput name="new-password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="อย่างน้อย 8 ตัวอักษร" minLength={8} />
                </Field>
                <Field label="ยืนยันรหัสผ่านใหม่">
                  <PasswordInput name="confirm-password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required={Boolean(password)} placeholder="กรอกรหัสผ่านใหม่อีกครั้ง" invalid={passwordMismatch} />
                  {passwordMismatch && <p className="profile-mismatch-text">รหัสผ่านใหม่ไม่ตรงกัน</p>}
                </Field>
              </div>
            </section>

            <div className="profile-actions-row">
              {saveError ? (
                <p role="alert" className="profile-save-error">{saveError}</p>
              ) : (
                <p className={`profile-saved-msg ${saved ? "opacity-100" : "opacity-0"}`} aria-live="polite">
                  <Check aria-hidden="true" size={16} strokeWidth={2.2} /> บันทึกการเปลี่ยนแปลงแล้ว
                </p>
              )}
              <div className="flex gap-3">
                <Link href="/dashboard" className="profile-cancel-btn action-fill action-fill--danger-hover focus-ring-danger">ยกเลิก</Link>
                <button type="submit" disabled={passwordMismatch || saving} className="profile-submit-btn action-fill action-fill--accent">{saving ? "กำลังบันทึก…" : "บันทึกการเปลี่ยนแปลง"}</button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="profile-field-label">{icon}{label}</span>
      {children}
    </label>
  );
}
