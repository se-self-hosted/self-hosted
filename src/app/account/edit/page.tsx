"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  UserRound,
} from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function EditProfilePage() {
  const { user, checkAuth } = useAuthStore();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const displayName = user?.fullname ?? "";
  const displayEmail = user?.email ?? "";
  const displayUsername = displayEmail.split("@")[0] ?? "";
  const initials = (displayName || displayEmail || "Host")
    .split(/[\s@]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const passwordMismatch = Boolean(
    password && confirmPassword && password !== confirmPassword,
  );

  function handleAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(file);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (passwordMismatch) return;
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2600);
  }

  return (
    <main className="profile-page">
      <header className="profile-header">
        <div className="profile-header__left">
          <Link href="/dashboard" className="profile-header__back-link">
            <ArrowLeft size={16} /> Dashboard
          </Link>
        </div>
      </header>

      <div className="profile-content">
        <div className="profile-page-header">
          <div>
            <p className="profile-eyebrow">Account settings</p>
            <h1 className="profile-title">Edit profile</h1>
            <p className="profile-description">Manage personal information and sign-in credentials for your host account.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <section className="profile-section">
            <div className="profile-section__header">
              <h2 className="profile-section__title">Profile details</h2>
              <p className="profile-section__subtitle">Information visible across your meeting rooms.</p>
            </div>

            <div className="profile-section__body">
              <div>
                <p className="profile-photo-label">Profile photo</p>
                <div className="profile-photo-frame group">
                  {avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatar} alt="Profile preview" className="profile-photo-image" />
                  ) : (
                    <div className="profile-photo-placeholder">{initials || "H"}</div>
                  )}
                  <button type="button" onClick={() => fileInput.current?.click()} className="profile-photo-change-btn">
                    <Camera size={15} /> Change
                  </button>
                </div>
                <input ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleAvatar} className="sr-only" />
                <button type="button" onClick={() => fileInput.current?.click()} className="profile-photo-upload-btn">Upload new photo</button>
                <p className="profile-photo-hint">JPG, PNG or WebP. Max 5MB.</p>
              </div>

              <div className="profile-fields-grid">
                <Field label="Full name" icon={<UserRound size={17} />}>
                  <input id="fullname" name="fullname" defaultValue={displayName} placeholder="Your full name" className="profile-input" />
                </Field>
                <Field label="Username" icon={<span className="text-sm font-bold">@</span>}>
                  <input id="username" name="username" defaultValue={displayUsername} placeholder="Your username" autoComplete="username" className="profile-input" />
                </Field>
                <div className="profile-field-full">
                  <Field label="Email address" icon={<Mail size={17} />}>
                  <input id="email" name="email" type="email" required defaultValue={displayEmail} placeholder="name@company.com" className="profile-input" />
                  </Field>
                </div>
                <div className="profile-callout">
                  Email changes require verification before becoming active.
                </div>
              </div>
            </div>
          </section>

          <section id="security" className="profile-section">
            <div className="profile-section__header--with-icon">
              <span className="profile-section__icon"><KeyRound size={19} /></span>
              <div>
                <h2 className="profile-section__title">Password & security</h2>
                <p className="profile-section__subtitle">Leave blank to keep current password.</p>
              </div>
            </div>
            <div className="profile-section__body-security">
              <Field label="New password">
                <div className="profile-input-wrap">
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" minLength={8} className="profile-input pr-12" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="profile-input-eye-btn" aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </Field>
              <Field label="Confirm password">
                <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repeat new password" className={`profile-input ${passwordMismatch ? "profile-input--mismatch" : ""}`} />
                {passwordMismatch && <p className="profile-mismatch-text">Passwords do not match.</p>}
              </Field>
            </div>
          </section>

          <div className="profile-actions-row">
            <p className={`profile-saved-msg ${saved ? "opacity-100" : "opacity-0"}`} aria-live="polite">
              <span className="profile-saved-icon"><Check size={14} /></span> Changes saved
            </p>
            <div className="flex gap-3">
              <Link href="/dashboard" className="profile-cancel-btn">Cancel</Link>
              <button type="submit" disabled={passwordMismatch} className="profile-submit-btn">Save changes</button>
            </div>
          </div>
        </form>
      </div>
    </main>
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
