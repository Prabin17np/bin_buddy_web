"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCurrentUser } from "@/lib/action/user-action";
import { handleLogout } from "@/lib/action/auth-action";
import type { User } from "@/app/utils/types";

const NAV = [
   { href: "/user/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/user/reports",           label: "Reports",       icon: "📋" },
  { href: "/user/messages",          label: "Messages",      icon: "💬" },
  { href: "/user/trashlog",          label: "Trash Log",     icon: "♻️" },
  { href: "/user/recycling-tracker", label: "Tracker",       icon: "📊" },
  { href: "/user/tips",              label: "Disposal Tips", icon: "💡" },
  { href: "/user/settings",          label: "Settings",      icon: "⚙️" },
];

function Sidebar({ open, onClose, onLogout }: { open: boolean; onClose: () => void; onLogout: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={onClose} />}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 z-30 flex flex-col
        shadow-xl lg:shadow-none transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100">
          <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-sm">♻</div>
          <div>
            <p className="font-bold text-gray-800 leading-tight">BinBuddy</p>
            <p className="text-[10px] text-emerald-500 font-medium uppercase tracking-widest">Community</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href);
            return (
              <a key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${active ? "bg-emerald-50 text-emerald-700 shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}>
                <span className="text-base">{item.icon}</span>
                {item.label}
                {active && <div className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
              </a>
            );
          })}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <button onClick={onLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
            <span>🚪</span> Log out
          </button>
        </div>
      </aside>
    </>
  );
}

function Header({ user, onMenuToggle, onLogout }: { user: User | null; onMenuToggle: () => void; onLogout: () => void }) {
  const [dropOpen, setDropOpen] = useState(false);
  const pathname = usePathname();
  const title = NAV.find(n => pathname === n.href || pathname.startsWith(n.href))?.label ?? "Dashboard";

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center gap-3">
      <button onClick={onMenuToggle} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="flex-1">
        <h1 className="text-base font-semibold text-gray-800">{title}</h1>
        <p className="text-xs text-gray-400 hidden sm:block">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>
      {user && (
        <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
          <span className="text-sm">⭐</span>
          <span className="text-sm font-bold text-emerald-700">{(user.points ?? 0).toLocaleString()}</span>
          <span className="text-xs text-emerald-500">pts</span>
        </div>
      )}
      <div className="relative">
        <button onClick={() => setDropOpen(v => !v)}
          className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm ring-2 ring-emerald-200 hover:ring-emerald-400 transition-all overflow-hidden">
          {user?.avatarUrl
            ? <img src={user.avatarUrl} alt={user?.name} className="w-full h-full object-cover" />
            : user?.name?.[0]?.toUpperCase() ?? "U"}
        </button>
        {dropOpen && (
          <div className="absolute right-0 top-11 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
            <a href="/user/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">⚙️ Settings</a>
            <button onClick={() => { setDropOpen(false); onLogout(); }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50">
              🚪 Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    getCurrentUser().then(res => { if (res.success && res.data) setUser(res.data); });
  }, []);

  const onLogout = async () => {
    await handleLogout();
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={onLogout} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header user={user} onMenuToggle={() => setSidebarOpen(v => !v)} onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}