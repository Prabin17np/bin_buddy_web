"use client";
import React, { useEffect, useState, useCallback } from "react";
import { getCurrentUser } from "@/lib/action/user-action";
import axios from "@/lib/api/axios";
import { API } from "@/lib/api/endpoint";
import type { User } from "@/app/utils/types";

interface Stats {
  points: number;
  totalReports: number;
  openReports: number;
  totalMessages: number;
  unreadMessages: number;
}

interface RecentTask {
  _id: string; title: string; location: string; status: string; points: number; createdAt: string;
}

interface RecentMessage {
  _id: string; title: string; body: string; read: boolean; reply?: string; createdAt: string;
}

const STATUS_STYLE: Record<string, string> = {
  pending:    "bg-amber-50 text-amber-700",
  collected:  "bg-sky-50 text-sky-700",
  verified:   "bg-emerald-50 text-emerald-700",
  rejected:   "bg-red-50 text-red-700",
  open:       "bg-orange-50 text-orange-700",
  resolved:   "bg-emerald-50 text-emerald-700",
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

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function UserDashboardPage() {
  const [user, setUser]                     = useState<User | null>(null);
  const [stats, setStats]                   = useState<Stats | null>(null);
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [userRes,reportsRes, messagesRes] = await Promise.all([
        getCurrentUser(),
        axios.get(API.USER.REPORTS),
        axios.get(API.USER.MESSAGES),
      ]);

      if (userRes.success && userRes.data) setUser(userRes.data);
      const reports  = reportsRes.data?.data  ?? [];
      const messages = messagesRes.data?.data ?? [];

      setStats({
        points:         userRes.data?.points ?? 0,
        totalReports:   reports.length,
        openReports:    reports.filter((r: any) => r.status === "open" || r.status === "pending").length,
        totalMessages:  messages.length,
        unreadMessages: messages.filter((m: any) => !m.read).length,
      });

      const byDate = (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      setRecentMessages([...messages].sort(byDate).slice(0, 5));
    } catch (e: any) {
      setError(e?.message ?? "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Welcome banner */}
      <div className="bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-400 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative">
          <p className="text-emerald-100 text-sm font-medium">Welcome back 👋</p>
          <h2 className="text-2xl font-black mt-1">{user?.name ?? "User"}</h2>
          <p className="text-emerald-100 text-sm mt-1">Here's your BinBuddy activity at a glance.</p>
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
            <StatCard label="My Reports" value={stats.totalReports}  icon="📋" color="bg-gradient-to-br from-violet-500 to-purple-600" sub={`${stats.openReports} open`} />
            <StatCard label="Messages"   value={stats.totalMessages} icon="💬" color="bg-gradient-to-br from-sky-400 to-blue-500"      sub={`${stats.unreadMessages} unread`} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
              <p className="text-2xl font-black text-sky-600">{stats.unreadMessages}</p>
              <p className="text-xs text-gray-400 font-semibold mt-1 uppercase tracking-wider">Unread Messages</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Messages */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                <h3 className="font-bold text-gray-800 text-sm">Recent Messages</h3>
                <a href="/user/messages" className="text-xs text-emerald-600 hover:underline font-medium">View all →</a>
              </div>
              {recentMessages.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">No messages yet</div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {recentMessages.map((msg) => (
                    <div key={msg._id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 ${msg.read ? "bg-gray-100" : "bg-sky-100"}`}>
                        {msg.reply ? "💬" : "📩"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{msg.title}</p>
                        <p className="text-xs text-gray-400 truncate">{msg.body}</p>
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
        </>
      )}
    </div>
  );
}