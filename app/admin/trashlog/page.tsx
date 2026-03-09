"use client";
import React, { useEffect, useCallback, useState } from "react";
import {
  adminGetAllTrashLogs,
  adminGetTrashStats,
  adminDeleteTrashLog,
} from "@/lib/action/admin/admin-action";

const CATEGORIES = [
  { value: "plastic",  label: "Plastic",  emoji: "🧴", color: "bg-blue-50   text-blue-700   border-blue-200"   },
  { value: "paper",    label: "Paper",    emoji: "📄", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  { value: "organic",  label: "Organic",  emoji: "🍂", color: "bg-green-50  text-green-700  border-green-200"  },
  { value: "metal",    label: "Metal",    emoji: "🔩", color: "bg-gray-50   text-gray-700   border-gray-200"   },
  { value: "glass",    label: "Glass",    emoji: "🫙", color: "bg-cyan-50   text-cyan-700   border-cyan-200"   },
  { value: "e-waste",  label: "E-Waste",  emoji: "📱", color: "bg-purple-50 text-purple-700 border-purple-200" },
];

const PAGE_SIZE = 10;

const getCat = (val: string) => CATEGORIES.find(c => c.value === val) ?? { emoji: "🗑️", label: val, color: "bg-gray-50 text-gray-600 border-gray-200" };

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function Spinner() {
  return (
    <div className="flex flex-col items-center gap-3 py-20">
      <div className="w-8 h-8 border-[3px] border-emerald-100 border-t-emerald-500 rounded-full animate-spin" />
      <p className="text-xs text-gray-400">Loading logs…</p>
    </div>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const cat = getCat(category);
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${cat.color}`}>
      {cat.emoji} {cat.label}
    </span>
  );
}

function DeleteModal({ log, onConfirm, onCancel, busy }: {
  log: any; onConfirm: () => void; onCancel: () => void; busy: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onCancel}>
      <div className="w-full max-w-xs bg-white rounded-3xl shadow-2xl p-6 space-y-4" onClick={e => e.stopPropagation()}>
        <div className="text-center">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3">🗑️</div>
          <h3 className="font-bold text-gray-800">Delete Log?</h3>
          <p className="text-sm text-gray-500 mt-1">
            This {log.category} log from <span className="font-medium">{log.userId?.username ?? "a user"}</span> will be permanently deleted.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={onConfirm} disabled={busy}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2">
            {busy ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminTrashLogsPage() {
  const [logs, setLogs]                 = useState<any[]>([]);
  const [stats, setStats]               = useState<any>(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [toast, setToast]               = useState<{ ok: boolean; msg: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleting, setDeleting]         = useState(false);
  const [filter, setFilter]             = useState("all");
  const [search, setSearch]             = useState("");
  const [page, setPage]                 = useState(1);

  const flash = (ok: boolean, msg: string) => {
    setToast({ ok, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    const [logsRes, statsRes] = await Promise.all([adminGetAllTrashLogs(), adminGetTrashStats()]);
    if (logsRes.success) {
      const sorted = (logsRes.data ?? []).sort((a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setLogs(sorted);
    } else {
      setError(logsRes.message ?? "Failed to load logs");
    }
    if (statsRes.success) setStats(statsRes.data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await adminDeleteTrashLog(deleteTarget._id);
    if (res.success) {
      setLogs(prev => prev.filter(l => l._id !== deleteTarget._id));
      flash(true, "Log deleted.");
    } else {
      flash(false, res.message ?? "Failed to delete.");
    }
    setDeleting(false);
    setDeleteTarget(null);
  };

  // Compute stats from logs if API stats not available
  const totalLogs   = stats?.totalLogs   ?? logs.length;
  const totalWeight = stats?.totalWeight ?? logs.reduce((s: number, l: any) => s + (l.weight ?? 0), 0);
  const totalUsers  = new Set(logs.map(l => l.userId?._id ?? l.userId)).size;

  const categoryCounts = CATEGORIES.map(cat => ({
    ...cat,
    count: logs.filter(l => l.category === cat.value).length,
  }));

  // Leaderboard: top users by log count
  const userMap: Record<string, { username: string; count: number; weight: number }> = {};
  logs.forEach(l => {
    const id = l.userId?._id ?? l.userId ?? "unknown";
    const username = l.userId?.username ?? "Unknown";
    if (!userMap[id]) userMap[id] = { username, count: 0, weight: 0 };
    userMap[id].count++;
    userMap[id].weight += l.weight ?? 0;
  });
  const leaderboard = Object.entries(userMap)
    .map(([id, v]) => ({ id, ...v }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Filter + search + paginate
  const filteredLogs = logs.filter(l => {
    const matchCat = filter === "all" || l.category === filter;
    const q = search.toLowerCase();
    const matchSearch = !search || (l.userId?.username ?? "").toLowerCase().includes(q) || l.category.includes(q) || (l.notes ?? "").toLowerCase().includes(q);
    return matchCat && matchSearch;
  });
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE));
  const paginated  = filteredLogs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const changeFilter = (f: string) => { setFilter(f); setPage(1); };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold
          ${toast.ok ? "bg-emerald-500" : "bg-red-500"} text-white`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Trash Logs</h1>
          <p className="text-xs text-gray-400 mt-0.5">All user waste categorization logs</p>
        </div>
        <button onClick={load} title="Refresh" className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Logs",    value: totalLogs,                      bg: "bg-white",       text: "text-gray-800"    },
          { label: "Total Weight",  value: `${totalWeight.toFixed(1)} kg`, bg: "bg-emerald-50",  text: "text-emerald-700" },
          { label: "Active Users",  value: totalUsers,                     bg: "bg-blue-50",     text: "text-blue-700"    },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border border-gray-100 rounded-2xl p-4 text-center shadow-sm`}>
            <p className={`text-2xl font-black ${s.text}`}>{s.value}</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category breakdown */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
          <p className="text-sm font-bold text-gray-800">By Category</p>
          {categoryCounts.sort((a, b) => b.count - a.count).map(cat => (
            <div key={cat.value} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-600">{cat.emoji} {cat.label}</span>
                <span className="text-xs text-gray-400">{cat.count} logs · {totalLogs ? Math.round(cat.count / totalLogs * 100) : 0}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-emerald-400 h-2 rounded-full transition-all"
                  style={{ width: `${totalLogs ? (cat.count / totalLogs * 100) : 0}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Top users leaderboard */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
          <p className="text-sm font-bold text-gray-800">Top Recyclers</p>
          {leaderboard.length === 0 ? (
            <p className="text-xs text-gray-400 py-4 text-center">No data yet</p>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((u, i) => (
                <div key={u.id} className="flex items-center gap-3 py-2">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0
                    ${i === 0 ? "bg-yellow-100 text-yellow-600" :
                      i === 1 ? "bg-gray-100 text-gray-500" :
                      i === 2 ? "bg-orange-100 text-orange-500" : "bg-gray-50 text-gray-400"}`}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{u.username}</p>
                    <p className="text-xs text-gray-400">{u.weight.toFixed(1)} kg recycled</p>
                  </div>
                  <span className="text-sm font-bold text-emerald-600 shrink-0">{u.count} logs</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap items-center">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search user, notes…"
            className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all" />
        </div>
        <button onClick={() => changeFilter("all")}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all
            ${filter === "all" ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-gray-400"}`}>
          All
        </button>
        {CATEGORIES.map(cat => (
          <button key={cat.value} onClick={() => changeFilter(cat.value)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all
              ${filter === cat.value ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-gray-400"}`}>
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3">
          <span>⚠️</span>
          <p className="text-sm text-red-600 flex-1">{error}</p>
          <button onClick={load} className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg font-medium">Retry</button>
        </div>
      )}

      {/* Table */}
      {loading ? <Spinner /> : paginated.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-gray-500 font-medium">No logs found</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">User</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Category</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Weight</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Notes</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Date</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map(log => (
                  <tr key={log._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-600 shrink-0">
                          {(log.userId?.username ?? "U")[0].toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{log.userId?.username ?? "Unknown"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><CategoryBadge category={log.category} /></td>
                    <td className="px-4 py-3 text-sm text-gray-500">{log.weight ? `${log.weight} kg` : "—"}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 max-w-[160px] truncate">{log.notes || "—"}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{formatDate(log.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setDeleteTarget(log)}
                        className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-red-100 hover:text-red-600 text-gray-400 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="w-8 h-8 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors flex items-center justify-center text-sm">‹</button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-xl text-sm font-semibold transition-colors
                ${p === page ? "bg-gray-900 text-white" : "border border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="w-8 h-8 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors flex items-center justify-center text-sm">›</button>
        </div>
      )}

      {deleteTarget && (
        <DeleteModal log={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} busy={deleting} />
      )}
    </div>
  );
}