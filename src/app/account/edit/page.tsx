"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  Camera,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  KeyRound,
  LayoutGrid,
  LogOut,
  Mail,
  Menu,
  Mic2,
  Settings,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

const navigation = [
  { label: "Overview", icon: LayoutGrid, href: "/dashboard" },
  { label: "Profile", icon: UserRound, href: "/account/edit", active: true },
  { label: "Security", icon: ShieldCheck, href: "#security" },
  { label: "Notifications", icon: Bell, href: "#notifications" },
];

export default function EditProfilePage() {
  const { user, checkAuth, logout } = useAuthStore();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const displayName = user?.name ?? "";
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
    <main className="min-h-screen bg-[#0f172a] text-white">
      <div className="flex min-h-screen">
        <aside
          className={`${menuOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-40 flex w-[270px] flex-col border-r border-[#263451] bg-[#111a2e] px-5 py-6 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0`}
        >
          <div className="flex items-center justify-between px-2">
            <Link href="/dashboard" className="flex items-center gap-3">
              <span className="grid size-10 place-items-center bg-[#4f46e5] text-white">
                <Mic2 size={21} strokeWidth={2.4} />
              </span>
              <span>
                <span className="block text-[17px] font-bold tracking-[-0.03em]">Vocalist</span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8292b2]">Meeting studio</span>
              </span>
            </Link>
            <button className="p-2 lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <X size={20} />
            </button>
          </div>

          <nav className="mt-12 space-y-1" aria-label="Account navigation">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a1a6ac]">Workspace</p>
            {navigation.map(({ label, icon: Icon, href, active }) => (
              <Link
                key={label}
                href={href}
                className={`group flex h-12 items-center gap-3 px-3 text-sm font-semibold transition ${active ? "bg-[#4f46e5] text-white" : "text-[#9cabc6] hover:bg-[#1d2942] hover:text-white"}`}
              >
                <Icon size={18} strokeWidth={active ? 2.3 : 1.8} />
                {label}
                {active && <ChevronRight className="ml-auto" size={16} />}
              </Link>
            ))}
          </nav>

          <div className="mt-auto border-t border-[#263451] pt-5">
            <div className="mb-4 flex items-center gap-3 px-2">
              <span className="grid size-10 shrink-0 place-items-center bg-[#4f46e5] text-sm font-bold text-white">{initials || "H"}</span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold">{displayName || "Host account"}</span>
                <span className="block truncate text-xs text-[#8292b2]">{displayEmail || "Account settings"}</span>
              </span>
            </div>
            <button onClick={() => logout()} className="flex w-full items-center gap-3 px-3 py-3 text-sm font-semibold text-[#9cabc6] transition hover:bg-[#1d2942] hover:text-white">
              <LogOut size={18} /> Log out
            </button>
          </div>
        </aside>

        {menuOpen && <button className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Close navigation" />}

        <section className="min-w-0 flex-1">
          <header className="flex h-[74px] items-center justify-between border-b border-[#263451] bg-[#111a2e] px-5 sm:px-8 lg:px-12">
            <div className="flex items-center gap-3">
              <button onClick={() => setMenuOpen(true)} className="p-2 lg:hidden" aria-label="Open menu"><Menu size={21} /></button>
              <Link href="/dashboard" className="hidden items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#9cabc6] transition hover:text-white sm:flex">
                <ArrowLeft size={16} /> Dashboard
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <button className="grid size-10 place-items-center border border-[#33415f] bg-[#1e293b] text-[#b4c0d6] transition hover:border-[#4f46e5] hover:text-white" aria-label="Notifications"><Bell size={18} /></button>
              <button className="grid size-10 place-items-center border border-[#33415f] bg-[#1e293b] text-[#b4c0d6] transition hover:border-[#4f46e5] hover:text-white" aria-label="Settings"><Settings size={18} /></button>
            </div>
          </header>

          <div className="mx-auto max-w-[1050px] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
            <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#818cf8]">Account settings</p>
                <h1 className="text-3xl font-bold tracking-[-0.045em] sm:text-[40px]">Edit profile</h1>
                <p className="mt-2 max-w-lg text-sm leading-6 text-[#9cabc6]">Manage personal information and sign-in credentials for your host account.</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#aab6cc]">
                <span className="size-2 bg-[#2caf6f]" /> Account active
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <section className="border border-[#33415f] bg-[#1e293b]">
                <div className="border-b border-[#33415f] px-6 py-5 sm:px-8">
                  <h2 className="text-base font-bold tracking-[-0.02em]">Profile details</h2>
                  <p className="mt-1 text-sm text-[#9cabc6]">Information visible across your meeting rooms.</p>
                </div>

                <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[210px_1fr]">
                  <div>
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[#b4c0d6]">Profile photo</p>
                    <div className="group relative size-32 overflow-hidden bg-[#111a2e]">
                      {avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={avatar} alt="Profile preview" className="size-full object-cover" />
                      ) : (
                        <div className="grid size-full place-items-center text-3xl font-bold text-[#818cf8]">{initials || "H"}</div>
                      )}
                      <button type="button" onClick={() => fileInput.current?.click()} className="absolute inset-x-0 bottom-0 flex h-10 items-center justify-center gap-2 bg-[#17191c]/90 text-xs font-bold text-white opacity-0 transition group-hover:opacity-100 focus:opacity-100">
                        <Camera size={15} /> Change
                      </button>
                    </div>
                    <input ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleAvatar} className="sr-only" />
                    <button type="button" onClick={() => fileInput.current?.click()} className="mt-3 text-xs font-bold text-[#818cf8] hover:text-white">Upload new photo</button>
                    <p className="mt-1 text-[11px] leading-4 text-[#8292b2]">JPG, PNG or WebP. Max 5MB.</p>
                  </div>

                  <div className="grid content-start gap-6 sm:grid-cols-2">
                    <Field label="Full name" icon={<UserRound size={17} />}>
                      <input id="name" name="name" defaultValue={displayName} placeholder="Your full name" className="profile-input" />
                    </Field>
                    <Field label="Username" icon={<span className="text-sm font-bold">@</span>}>
                      <input id="username" name="username" defaultValue={displayUsername} placeholder="Your username" autoComplete="username" className="profile-input" />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field label="Email address" icon={<Mail size={17} />}>
                      <input id="email" name="email" type="email" required defaultValue={displayEmail} placeholder="name@company.com" className="profile-input" />
                      </Field>
                    </div>
                    <div className="sm:col-span-2 border-l-2 border-[#6366f1] bg-[#17213a] px-4 py-3 text-xs leading-5 text-[#b4c0d6]">
                      Email changes require verification before becoming active.
                    </div>
                  </div>
                </div>
              </section>

              <section id="security" className="border border-[#33415f] bg-[#1e293b]">
                <div className="flex items-center gap-4 border-b border-[#33415f] px-6 py-5 sm:px-8">
                  <span className="grid size-10 place-items-center bg-[#111a2e] text-[#818cf8]"><KeyRound size={19} /></span>
                  <div>
                    <h2 className="text-base font-bold tracking-[-0.02em]">Password & security</h2>
                    <p className="mt-1 text-sm text-[#9cabc6]">Leave blank to keep current password.</p>
                  </div>
                </div>
                <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
                  <Field label="New password">
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" minLength={8} className="profile-input pr-12" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 grid w-12 place-items-center text-[#8292b2] hover:text-white" aria-label={showPassword ? "Hide password" : "Show password"}>
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                  </Field>
                  <Field label="Confirm password">
                    <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repeat new password" className={`profile-input ${passwordMismatch ? "!border-[#d9483b] !bg-[#fff8f7]" : ""}`} />
                    {passwordMismatch && <p className="mt-2 text-xs font-semibold text-[#d9483b]">Passwords do not match.</p>}
                  </Field>
                </div>
              </section>

              <div className="flex flex-col-reverse items-stretch justify-between gap-4 py-2 sm:flex-row sm:items-center">
                <p className={`flex items-center gap-2 text-sm font-semibold text-[#23875a] transition ${saved ? "opacity-100" : "opacity-0"}`} aria-live="polite">
                  <span className="grid size-6 place-items-center bg-[#dff5e9]"><Check size={14} /></span> Changes saved
                </p>
                <div className="flex gap-3">
                  <Link href="/dashboard" className="flex h-12 flex-1 items-center justify-center border border-[#465574] bg-[#1e293b] px-6 text-sm font-bold text-white transition hover:bg-[#283750] sm:flex-none">Cancel</Link>
                  <button type="submit" disabled={passwordMismatch} className="h-12 flex-1 bg-[#4f46e5] px-7 text-sm font-bold text-white transition hover:bg-[#6366f1] disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none">Save changes</button>
                </div>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#b4c0d6]">{icon}{label}</span>
      {children}
    </label>
  );
}
