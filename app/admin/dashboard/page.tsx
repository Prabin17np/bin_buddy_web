"use client";
import React, { useEffect, useState, useCallback } from "react";
import { getCurrentUser } from "@/lib/action/user-action";
import axios from "@/lib/api/axios";
import { API } from "@/lib/api/endpoint";

const getImageUrl = (path?: string | null): string | undefined => {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5050/api/v1";
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${base.replace(/\/$/, "")}${clean}`;
};

interface Stats {
  totalUsers: number;
  totalReports: number;
  openReports: number;
  resolvedReports: number;
  totalMessages: number;
  unreadMessages: number;
}

interface RecentReport  { _id: string; title?: string; location: string; status: string; type: string; createdAt: string; }
// ── Real schema shape: firstName + lastName + profilePicture ──────────────
interface RecentUser    { _id: string; firstName: string; lastName: string; username: string; email: string; profilePicture?: string | null; createdAt: string; }
interface RecentMessage { _id: string; title: string; body: string; read: boolean; reply?: string; createdAt: string;  userId: { name?: string; email: string } | string | null; }

const STATUS_STYLE: Record<string, string> = {
  pending:    "bg-amber-50 text-amber-700",
  open:       "bg-orange-50 text-orange-700",
  resolved:   "bg-emerald-50 text-emerald-700",
  rejected:   "bg-red-50 text-red-700",
  inprogress: "bg-blue-50 text-blue-700",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLE[status] ?? "bg-gray-50 text-gray-600"}`}>
      {status}
    </span>
  );
}

function StatCard({ label, value, icon, color, sub }: { label: string; value: number; icon: string; color: string; sub?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-lg ${color}`}>
      <div className="absolute right-3 top-3 text-4xl opacity-20">{icon}</div>
      <p className="text-3xl font-black">{value.toLocaleString()}</p>
      <p className="text-white/80 text-xs font-semibold mt-1 uppercase tracking-wider">{label}</p>
      {sub && <p className="text-white/60 text-xs mt-0.5">{sub}</p>}
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex flex-col items-center gap-3 py-20">
      <div className="w-8 h-8 border-[3px] border-emerald-100 border-t-emerald-500 rounded-full animate-spin" />
      <p className="text-sm text-gray-400">Loading dashboard…</p>
    </div>
  );
}

// ── Avatar with real profilePicture + initials fallback ───────────────────
function UserAvatar({ user }: { user: RecentUser }) {
  const [failed, setFailed] = useState(false);
  const src = getImageUrl(user.profilePicture);
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || user.username?.[0]?.toUpperCase() || "?";

  if (src && !failed) {
    return (
      <img src={src} alt={user.firstName} onError={() => setFailed(true)}
        className="w-8 h-8 rounded-full object-cover shrink-0 border border-gray-100" />
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-700 shrink-0 border border-green-200">
      {initials}
    </div>
  );
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getUserLabel(userId: RecentMessage["userId"]) {
   if (!userId) return "Unknown User";
  if (typeof userId === "string") return userId;
  return userId.name ?? userId.email;
}

export default function AdminDashboardPage() {
  const [user, setUser]                     = useState<any>(null);
  const [stats, setStats]                   = useState<Stats | null>(null);
  const [recentReports, setRecentReports]   = useState<RecentReport[]>([]);
  const [recentUsers, setRecentUsers]       = useState<RecentUser[]>([]);
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [userRes, reportsRes, usersRes, messagesRes] = await Promise.all([
        getCurrentUser(),
        axios.get(API.ADMIN.REPORT.GET_ALL),
        axios.get(API.ADMIN.USER.GET_ALL),
        axios.get(API.ADMIN.MESSAGE.GET_ALL),
      ]);

      if (userRes.success && userRes.data) setUser(userRes.data);

      const reports:  RecentReport[]  = reportsRes.data?.data  ?? [];
      const users:    RecentUser[]    = usersRes.data?.data?.users ?? usersRes.data?.data ?? [];
      const messages: RecentMessage[] = messagesRes.data?.data ?? [];

      setStats({
        totalUsers:      users.length,
        totalReports:    reports.length,
        openReports:     reports.filter((r: any) => r.status === "open" || r.status === "pending").length,
        resolvedReports: reports.filter((r: any) => r.status === "resolved").length,
        totalMessages:   messages.length,
        unreadMessages:  messages.filter((m: any) => !m.read).length,
      });

      const byDate = (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      setRecentReports( [...reports].sort(byDate).slice(0, 5));
      setRecentUsers(   [...users].sort(byDate).slice(0, 5));
      setRecentMessages([...messages].sort(byDate).slice(0, 5));
    } catch (e: any) {
      setError(e?.message ?? "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Welcome banner shows firstName from real user
  const welcomeName = user?.firstName
    ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}`
    : "Admin";

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Welcome */}
      <div className="bg-gradient-to-br from-green-600 via-green-500 to-teal-400 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative">
          <p className="text-green-100 text-sm font-medium">Welcome back 👋</p>
          <h2 className="text-2xl font-black mt-1">{welcomeName}</h2>
          <p className="text-green-100 text-sm mt-1">Here's what's happening with BinBuddy today.</p>
        </div>
      </div>

      {loading && <Spinner />}

      {!loading && error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3">
          <span>⚠️</span>
          <p className="text-sm text-red-600 flex-1">{error}</p>
          <button onClick={load} className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg font-medium">Retry</button>
        </div>
      )}

      {!loading && !error && stats && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard label="Total Users" value={stats.totalUsers}    icon="👥" color="bg-gradient-to-br from-violet-500 to-purple-600" />
            <StatCard label="Reports"     value={stats.totalReports}  icon="📋" color="bg-gradient-to-br from-amber-400 to-orange-500"  sub={`${stats.openReports} open`} />
            <StatCard label="Messages"    value={stats.totalMessages} icon="💬" color="bg-gradient-to-br from-sky-400 to-blue-500"      sub={`${stats.unreadMessages} unread`} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
              <p className="text-2xl font-black text-amber-600">{stats.openReports}</p>
              <p className="text-xs text-gray-400 font-semibold mt-1 uppercase tracking-wider">Open Reports</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
              <p className="text-2xl font-black text-emerald-600">{stats.resolvedReports}</p>
              <p className="text-xs text-gray-400 font-semibold mt-1 uppercase tracking-wider">Resolved Reports</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Reports */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                <h3 className="font-bold text-gray-800 text-sm">Recent Reports</h3>
                <a href="/admin/reports" className="text-xs text-green-600 hover:underline font-medium">View all →</a>
              </div>
              {recentReports.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">No reports yet</div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {recentReports.map(report => (
                    <div key={report._id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-sm shrink-0">⚠️</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{report.title ?? report.type}</p>
                        <p className="text-xs text-gray-400 truncate">📍 {report.location} · {formatDate(report.createdAt)}</p>
                      </div>
                      <StatusBadge status={report.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Messages */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                <h3 className="font-bold text-gray-800 text-sm">Recent Messages</h3>
                <a href="/admin/messages" className="text-xs text-green-600 hover:underline font-medium">View all →</a>
              </div>
              {recentMessages.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">No messages yet</div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {recentMessages.map(msg => (
                    <div key={msg._id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 ${msg.read ? "bg-gray-100" : "bg-sky-100"}`}>
                        {msg.reply ? "💬" : "📩"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{msg.title}</p>
                        <p className="text-xs text-gray-400 truncate">👤 {getUserLabel(msg.userId)} · {formatDate(msg.createdAt)}</p>
                      </div>
                      {msg.reply ? (
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 shrink-0">Replied</span>
                      ) : !msg.read ? (
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 shrink-0">Unread</span>
                      ) : (
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 shrink-0">Read</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recently Joined Users — real profilePicture, firstName+lastName, no points/star */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <h3 className="font-bold text-gray-800 text-sm">Recently Joined Users</h3>
              <a href="/admin/users" className="text-xs text-green-600 hover:underline font-medium">View all →</a>
            </div>
            {recentUsers.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">No users yet</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {recentUsers.map(u => (
                  <div key={u._id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">

                    {/* Real profile picture with initials fallback */}
                    <UserAvatar user={u} />

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {`${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || u.username}
                      </p>
                      <p className="text-xs text-gray-400 truncate">@{u.username} · {u.email}</p>
                    </div>

                    <p className="text-xs text-gray-300 shrink-0">{formatDate(u.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}