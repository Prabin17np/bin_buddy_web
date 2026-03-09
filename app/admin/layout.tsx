"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { handleLogout } from "@/lib/action/auth-action";
import { getCurrentUser } from "@/lib/action/user-action";
import Link from "next/link";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/users",     label: "Users",      icon: "👥" },
  { href: "/admin/reports",   label: "Reports",    icon: "📋" },
  { href: "/admin/messages",  label: "Messages",   icon: "💬" },
  { href: "/admin/settings",  label: "Settings",   icon: "⚙️" },
];

function AdminSidebar({ open, onClose, onLogout }: { open: boolean; onClose: () => void; onLogout: () => void }) {
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
          <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-sm">♻</div>
          <div>
            <p className="font-bold text-gray-800 leading-tight">BinBuddy</p>
            <p className="text-[10px] text-green-600 font-medium uppercase tracking-widest">Admin Console</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${active ? "bg-green-50 text-green-700 shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}>
                <span className="text-base">{item.icon}</span>
                {item.label}
                {active && <div className="ml-auto w-1.5 h-1.5 bg-green-500 rounded-full" />}
              </Link>
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

function AdminHeader({
  user,
  onMenuToggle,
  onLogout,
}: {
  user?: { name: string; email: string; avatarUrl?: string };
  onMenuToggle: () => void;
  onLogout: () => void;
}) {
  const [dropOpen, setDropOpen] = useState(false);
  const pathname = usePathname();
  const title = NAV.find(n => pathname === n.href || pathname.startsWith(n.href))?.label ?? "Admin";

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
      <div className="relative">
        <button onClick={() => setDropOpen(v => !v)}
          className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm ring-2 ring-green-200 hover:ring-green-400 transition-all overflow-hidden">
          {user?.avatarUrl
            ? <img src={user.avatarUrl} alt={user?.name} className="w-full h-full object-cover" />
            : user?.name?.[0]?.toUpperCase() ?? "A"}
        </button>
        {dropOpen && (
          <div className="absolute right-0 top-11 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-800">{user?.name ?? "Admin"}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
            <Link href="/admin/settings" onClick={() => setDropOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
              ⚙️ Settings
            </Link>
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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    getCurrentUser().then(res => {
      if (res.success && res.data) setUser(res.data);
    });
  }, []);

  const onLogout = async () => {
    await handleLogout();
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={onLogout} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader user={user} onMenuToggle={() => setSidebarOpen(v => !v)} onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
