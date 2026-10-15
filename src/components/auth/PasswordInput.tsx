"use client";

import { Eye, EyeOff } from "lucide-react";
import { InputHTMLAttributes, useState } from "react";

/** Password box with its own show/hide toggle, so revealing one field never reveals the others. */
export function PasswordInput({ invalid, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "className"> & { invalid?: boolean }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="profile-input-wrap">
      <input
        {...props}
        type={visible ? "text" : "password"}
        aria-invalid={invalid || undefined}
        className={`profile-input pr-12 ${invalid ? "profile-input--mismatch" : ""}`}
      />
      <button type="button" onClick={() => setVisible((shown) => !shown)} className="profile-input-eye-btn" aria-label={visible ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}>
        {visible ? <Eye size={17} /> : <EyeOff size={17} />}
      </button>
    </div>
  );
}
