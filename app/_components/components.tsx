import React, { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ─── AVATAR ───────────────────────────────────────────────────────────────────
interface AvatarProps {
  initials: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ initials, size = "md" }: AvatarProps): React.ReactElement {
  const sizes: Record<string, string> = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-lg",
  };
  return (
    <div className={`${sizes[size]} rounded-xl flex items-center justify-center font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0`}>
      {initials}
    </div>
  );
}

// ─── BADGE ────────────────────────────────────────────────────────────────────
interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "purple";
  className?: string; // added support for custom class
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps): React.ReactElement {
  const variants: Record<string, string> = {
    default: "bg-slate-700 text-slate-300",
    success: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    warning: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    danger: "bg-rose-500/20 text-rose-400 border border-rose-500/30",
    info: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    purple: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

// ─── BUTTON ───────────────────────────────────────────────────────────────────
interface BtnProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
  title?: string; // added support for title attribute
}

export function Btn({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  icon,
  title,
}: BtnProps): React.ReactElement {
  const base = "inline-flex items-center gap-2 font-semibold rounded-xl transition-all duration-200 cursor-pointer border";
  const variants: Record<string, string> = {
    primary: "bg-emerald-500 hover:bg-emerald-400 text-white border-emerald-500 shadow-lg shadow-emerald-500/20",
    secondary: "bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600",
    ghost: "bg-transparent hover:bg-slate-700 text-slate-300 border-transparent",
    danger: "bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border-rose-500/30",
    outline: "bg-transparent hover:bg-emerald-500/10 text-emerald-400 border-emerald-500/40",
  };
  const sizes: Record<string, string> = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled ? "opacity-40 cursor-not-allowed" : ""} ${className}`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}

// ─── INPUT ────────────────────────────────────────────────────────────────────
interface InputProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}

export function Input({ label, value, onChange, placeholder, type = "text", className = "" }: InputProps): React.ReactElement {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all"
      />
    </div>
  );
}

// ─── CARD ─────────────────────────────────────────────────────────────────────
interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = "", onClick }: CardProps): React.ReactElement {
  return (
    <div
      onClick={onClick}
      className={`bg-slate-800/60 border border-slate-700/50 rounded-2xl ${onClick ? "cursor-pointer hover:border-emerald-500/30 hover:bg-slate-800" : ""} transition-all duration-200 ${className}`}
    >
      {children}
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color?: "emerald" | "blue" | "amber" | "purple";
}

export function StatCard({ icon, label, value, sub, color = "emerald" }: StatCardProps): React.ReactElement {
  const colors: Record<string, string> = {
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  };
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl border ${colors[color]}`}>{icon}</div>
      </div>
      <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
      <p className="text-sm font-medium text-slate-400">{label}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </Card>
  );
}

// ─── PAGINATION ───────────────────────────────────────────────────────────────
interface PaginationProps {
  page: number;
  total: number;
  perPage: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, total, perPage, onChange }: PaginationProps): React.ReactElement {
  const totalPages = Math.ceil(total / perPage);
  return (
    <div className="flex items-center gap-2 justify-end mt-4">
      <Btn variant="ghost" size="sm" onClick={() => onChange(page - 1)} disabled={page === 1} icon={<ChevronLeft size={14} />}>
        Prev
      </Btn>
      <span className="text-xs text-slate-400 px-2">
        {page} / {totalPages}
      </span>
      <Btn variant="ghost" size="sm" onClick={() => onChange(page + 1)} disabled={page === totalPages} icon={<ChevronRight size={14} />}>
        Next
      </Btn>
    </div>
  );
}
