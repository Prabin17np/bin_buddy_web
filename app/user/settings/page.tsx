"use client";

import React, { useRef, useState, useEffect } from "react";
import { getCurrentUser, handleUpdateUser, handleChangePassword } from "@/lib/action/user-action";

const cx = (...cls: (string | undefined | false)[]) => cls.filter(Boolean).join(" ");

// Same helper as AdminUsersPage — converts stored path to full URL
const getImageUrl = (path?: string | null): string | undefined => {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5050/api/v1";
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${base.replace(/\/$/, "")}${clean}`;
};

export default function UserSettingsPage() {
  const [profile, setProfile] = useState({ firstName: "", lastName: "", username: "", email: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [pwVisible, setPwVisible] = useState({ current: false, next: false, confirm: false });
  const [loadingUser, setLoadingUser] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Load real user on mount ────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await getCurrentUser();
        if (res.success && res.data) {
          const u = res.data as any;
          setProfile({
            firstName: u.firstName ?? "",
            lastName:  u.lastName  ?? "",
            username:  u.username  ?? "",
            email:     u.email     ?? "",
          });
          // ← Real profile picture from DB
          if (u.profilePicture) {
            setAvatarPreview(getImageUrl(u.profilePicture) ?? null);
          }
        }
      } catch {}
      finally { setLoadingUser(false); }
    })();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarPreview(URL.createObjectURL(file)); // local preview
  };

  const saveProfile = async () => {
    if (!profile.firstName || !profile.email) {
      setProfileMsg({ type: "error", text: "First name and email are required." });
      return;
    }
    setSavingProfile(true);
    try {
      const fd = new FormData();
      fd.append("firstName", profile.firstName);
      fd.append("lastName",  profile.lastName);
      fd.append("username",  profile.username);
      fd.append("email",     profile.email);
      if (fileRef.current?.files?.[0]) fd.append("profilePicture", fileRef.current.files[0]);
      const res = await handleUpdateUser(fd);
      setProfileMsg({ type: res.success ? "success" : "error", text: res.message ?? (res.success ? "Profile updated!" : "Update failed") });
      // Update avatar to newly saved picture
      if (res.success && (res.data as any)?.profilePicture) {
        setAvatarPreview(getImageUrl((res.data as any).profilePicture) ?? avatarPreview);
      }
    } finally {
      setSavingProfile(false);
      setTimeout(() => setProfileMsg(null), 4000);
    }
  };

  const savePassword = async () => {
    if (!passwords.currentPassword || !passwords.newPassword) {
      setPasswordMsg({ type: "error", text: "Please fill in all password fields." });
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMsg({ type: "error", text: "Passwords do not match." });
      return;
    }
    if (passwords.newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }
    setSavingPassword(true);
    try {
      const res = await handleChangePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      setPasswordMsg({ type: res.success ? "success" : "error", text: res.message ?? "" });
      if (res.success) setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } finally {
      setSavingPassword(false);
      setTimeout(() => setPasswordMsg(null), 4000);
    }
  };

  const initials = `${profile.firstName[0] ?? ""}${profile.lastName[0] ?? ""}`.toUpperCase() || "?";

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <svg className="w-8 h-8 animate-spin text-emerald-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex justify-center">
      <div className="w-full max-w-2xl mx-auto space-y-6">

        <div className="mb-2">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Account Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your profile and security preferences</p>
        </div>

        {/* ── Profile Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-emerald-500 to-teal-500" />

          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-12 mb-5">
              <div className="relative group">
                <div className="w-20 h-20 rounded-2xl ring-4 ring-white shadow-md overflow-hidden bg-emerald-100 flex items-center justify-center">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover"
                      onError={() => setAvatarPreview(null)} />
                  ) : (
                    <span className="text-2xl font-bold text-emerald-600">{initials}</span>
                  )}
                </div>
                <button onClick={() => fileRef.current?.click()}
                  className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>
              <div className="text-right mb-1">
                <p className="text-sm font-semibold text-gray-700">{profile.firstName} {profile.lastName}</p>
                <p className="text-xs text-gray-400">@{profile.username}</p>
              </div>
            </div>

            {profileMsg && (
              <div className={cx(
                "flex items-center gap-2 text-sm px-4 py-3 rounded-xl mb-4 border",
                profileMsg.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"
              )}>
                <span>{profileMsg.type === "success" ? "✓" : "✕"}</span>
                {profileMsg.text}
              </div>
            )}

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Profile Information</p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="First Name *">
                  <input value={profile.firstName} onChange={e => setProfile({ ...profile, firstName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-gray-50 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                    placeholder="Jane" />
                </Field>
                <Field label="Last Name">
                  <input value={profile.lastName} onChange={e => setProfile({ ...profile, lastName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-gray-50 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                    placeholder="Doe" />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Username">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                    <input value={profile.username} onChange={e => setProfile({ ...profile, username: e.target.value })}
                      className="w-full pl-7 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-gray-50 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                      placeholder="janedoe" />
                  </div>
                </Field>
                <Field label="Email *">
                  <input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-gray-50 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                    placeholder="jane@example.com" />
                </Field>
              </div>

              <div className="flex justify-end pt-1">
                <button onClick={saveProfile} disabled={savingProfile}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white text-sm font-medium rounded-xl transition-colors shadow-sm">
                  {savingProfile ? <><Spinner /> Saving...</> : <><SaveIcon /> Save Changes</>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Password Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center"><LockIcon /></div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Change Password</p>
              <p className="text-xs text-gray-400">Use a strong password you don't use elsewhere</p>
            </div>
          </div>

          {passwordMsg && (
            <div className={cx(
              "flex items-center gap-2 text-sm px-4 py-3 rounded-xl mb-4 border",
              passwordMsg.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"
            )}>
              <span>{passwordMsg.type === "success" ? "✓" : "✕"}</span>
              {passwordMsg.text}
            </div>
          )}

          <div className="space-y-4">
            <Field label="Current Password">
              <PasswordInput value={passwords.currentPassword}
                onChange={v => setPasswords({ ...passwords, currentPassword: v })}
                visible={pwVisible.current} onToggle={() => setPwVisible({ ...pwVisible, current: !pwVisible.current })}
                placeholder="Your current password" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="New Password">
                <PasswordInput value={passwords.newPassword}
                  onChange={v => setPasswords({ ...passwords, newPassword: v })}
                  visible={pwVisible.next} onToggle={() => setPwVisible({ ...pwVisible, next: !pwVisible.next })}
                  placeholder="Min. 6 characters" />
              </Field>
              <Field label="Confirm Password">
                <PasswordInput value={passwords.confirmPassword}
                  onChange={v => setPasswords({ ...passwords, confirmPassword: v })}
                  visible={pwVisible.confirm} onToggle={() => setPwVisible({ ...pwVisible, confirm: !pwVisible.confirm })}
                  placeholder="Repeat new password"
                  error={passwords.confirmPassword.length > 0 && passwords.newPassword !== passwords.confirmPassword} />
              </Field>
            </div>
            {passwords.newPassword.length > 0 && <StrengthMeter password={passwords.newPassword} />}
            <div className="flex justify-end pt-1">
              <button onClick={savePassword} disabled={savingPassword}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-700 disabled:opacity-60 text-white text-sm font-medium rounded-xl transition-colors shadow-sm">
                {savingPassword ? <><Spinner /> Updating...</> : <><LockIcon color="white" /> Update Password</>}
              </button>
            </div>
          </div>
        </div>

        {/* ── Sign Out ── */}
        <div className="bg-white rounded-2xl border border-red-100 p-6">
          <p className="text-xs font-semibold text-red-400 uppercase tracking-widest mb-3">Session</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">Sign out</p>
              <p className="text-xs text-gray-400 mt-0.5">You'll need to log in again to access your account</p>
            </div>
            <button
              onClick={async () => {
                const { handleLogout } = await import("@/lib/action/auth-action");
                await handleLogout();
                window.location.href = "/login";
              }}
              className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors">
              Log out
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function PasswordInput({ value, onChange, visible, onToggle, placeholder, error }: {
  value: string; onChange: (v: string) => void; visible: boolean; onToggle: () => void; placeholder?: string; error?: boolean;
}) {
  return (
    <div className="relative">
      <input type={visible ? "text" : "password"} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className={cx("w-full px-3.5 py-2.5 pr-10 rounded-xl border text-sm text-gray-800 bg-gray-50 focus:bg-white focus:ring-2 outline-none transition",
          error ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-emerald-400 focus:ring-emerald-100")} />
      <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
        {visible ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )}
      </button>
    </div>
  );
}

function StrengthMeter({ password }: { password: string }) {
  const score = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length;
  const levels = [{ label: "Weak", color: "bg-red-400" }, { label: "Fair", color: "bg-amber-400" }, { label: "Good", color: "bg-yellow-400" }, { label: "Strong", color: "bg-emerald-400" }];
  const level = levels[score - 1] ?? levels[0];
  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">{[0,1,2,3].map(i => <div key={i} className={cx("h-1 flex-1 rounded-full transition-colors duration-300", i < score ? level.color : "bg-gray-100")} />)}</div>
      <p className="text-xs text-gray-400">Strength: <span className="font-medium text-gray-600">{level.label}</span></p>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function LockIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg className="w-4 h-4" fill="none" stroke={color} strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}