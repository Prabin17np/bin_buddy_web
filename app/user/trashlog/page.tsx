"use client";
import React, { useEffect, useCallback, useState } from "react";
import {
  getMyTrashLogs,
  submitTrashLog,
  deleteTrashLog,
} from "@/lib/action/user-action";

// ─── Types ────────────────────────────────────────────────────────────────────
interface TrashLog {
  _id: string;
  category: string;
  weightKg?: number;
  notes?: string;
  createdAt: string;
}

interface FormState {
  category: string;
  weightKg: string;
  notes: string;
}

const EMPTY_FORM: FormState = { category: "plastic", weightKg: "", notes: "" };
const PAGE_SIZE = 8;

// ─── Config ───────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: "plastic",  label: "Plastic",  emoji: "🧴", color: "bg-blue-50   text-blue-700   border-blue-200"   },
  { value: "paper",    label: "Paper",    emoji: "📄", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  { value: "organic",  label: "Organic",  emoji: "🍂", color: "bg-green-50  text-green-700  border-green-200"  },
  { value: "metal",    label: "Metal",    emoji: "🔩", color: "bg-gray-50   text-gray-700   border-gray-200"   },
  { value: "glass",    label: "Glass",    emoji: "🫙", color: "bg-cyan-50   text-cyan-700   border-cyan-200"   },
  { value: "e-waste",  label: "E-Waste",  emoji: "📱", color: "bg-purple-50 text-purple-700 border-purple-200" },
];

const getCat = (val: string) => CATEGORIES.find(c => c.value === val) ?? CATEGORIES[0];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── Components ───────────────────────────────────────────────────────────────
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

function LogModal({ onClose, onSave }: {
  onClose: () => void;
  onSave: (form: FormState) => Promise<void>;
}) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [busy, setBusy] = useState(false);
  const [err, setErr]   = useState<string | null>(null);

  const set = (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    if (!form.category) { setErr("Please select a category."); return; }
    setBusy(true); setErr(null);
    try { await onSave(form); }
    catch (e: any) { setErr(e?.message ?? "Something went wrong."); setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-800">Log Waste Item</h2>
            <p className="text-xs text-gray-400 mt-0.5">Track what you're throwing away</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100 transition-colors text-gray-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {err && <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-medium rounded-xl px-3 py-2">⚠️ {err}</div>}

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category *</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map(cat => (
                <button key={cat.value} onClick={() => setForm(f => ({ ...f, category: cat.value }))}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border-2 text-xs font-semibold transition-all
                    ${form.category === cat.value
                      ? "border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm"
                      : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"}`}>
                  <span className="text-xl">{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Weight (kg) <span className="text-gray-300 normal-case font-normal">— optional</span>
            </label>
            <input type="number" min="0" step="0.1" value={form.weightKg} onChange={set("weightKg")}
              placeholder="e.g., 0.5"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Notes <span className="text-gray-300 normal-case font-normal">— optional</span>
            </label>
            <textarea value={form.notes} onChange={set("notes")} rows={2}
              placeholder="Any extra details…"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none transition-all" />
          </div>
        </div>

        <div className="px-5 py-4 border-t border-gray-50 flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={busy}
            className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2">
            {busy ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</> : "Log Waste"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ log, onConfirm, onCancel, busy }: {
  log: TrashLog; onConfirm: () => void; onCancel: () => void; busy: boolean;
}) {
  const cat = getCat(log.category);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onCancel}>
      <div className="w-full max-w-xs bg-white rounded-3xl shadow-2xl p-6 space-y-4" onClick={e => e.stopPropagation()}>
        <div className="text-center">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3">🗑️</div>
          <h3 className="font-bold text-gray-800">Delete Log?</h3>
          <p className="text-sm text-gray-500 mt-1">
            {cat.emoji} <span className="font-medium">{cat.label}</span> entry from {formatDate(log.createdAt)} will be permanently deleted.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={busy}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2">
            {busy ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function LogRow({ log, onDelete }: { log: TrashLog; onDelete: (l: TrashLog) => void }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group">
      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xl shrink-0 mt-0.5">
        {getCat(log.category).emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <CategoryBadge category={log.category} />
          {log.weightKg && <span className="text-xs text-gray-400 font-medium">{log.weightKg} kg</span>}
        </div>
        {log.notes && <p className="text-xs text-gray-400 mt-1.5 line-clamp-1">{log.notes}</p>}
        <p className="text-xs text-gray-400 mt-1.5">🗓 {formatDate(log.createdAt)}</p>
      </div>
      <button onClick={() => onDelete(log)} title="Delete"
        className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-red-100 hover:text-red-600 text-gray-400 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 shrink-0">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function UserTrashLogPage() {
  const [logs, setLogs]                 = useState<TrashLog[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [toast, setToast]               = useState<{ ok: boolean; msg: string } | null>(null);
  const [showAdd, setShowAdd]           = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TrashLog | null>(null);
  const [deleting, setDeleting]         = useState(false);
  const [filter, setFilter]             = useState("all");
  const [page, setPage]                 = useState(1);

  const flash = (ok: boolean, msg: string) => {
    setToast({ ok, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    const res = await getMyTrashLogs();
    if (res.success) {
      const sorted = (res.data ?? []).sort((a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setLogs(sorted);
    } else {
      setError(res.message ?? "Failed to load logs");
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (form: FormState) => {
    const res = await submitTrashLog({
      category: form.category,
      weightKg: form.weightKg ? parseFloat(form.weightKg) : undefined,
      notes: form.notes || undefined,
    });
    if (res.success && res.data) {
      setLogs(prev => [res.data, ...prev]);
      setShowAdd(false);
      flash(true, "Waste logged! Keep up the great recycling habits ♻️");
    } else {
      throw new Error(res.message ?? "Failed to log waste");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await deleteTrashLog(deleteTarget._id);
    if (res.success) {
      setLogs(prev => prev.filter(l => l._id !== deleteTarget._id));
      flash(true, "Log deleted.");
    } else {
      flash(false, res.message ?? "Failed to delete log.");
    }
    setDeleting(false);
    setDeleteTarget(null);
  };

  // Stats
  const totalLogs    = logs.length;
  const totalWeight  = logs.reduce((s, l) => s + (l.weightKg ?? 0), 0);
  const categoryCounts = CATEGORIES.map(cat => ({
    ...cat,
    count: logs.filter(l => l.category === cat.value).length,
  }));

  // Filter + paginate
  const filtered   = filter === "all" ? logs : logs.filter(l => l.category === filter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const changeFilter = (f: string) => { setFilter(f); setPage(1); };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold
          ${toast.ok ? "bg-emerald-500" : "bg-red-500"} text-white`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Trash Log</h1>
          <p className="text-xs text-gray-400 mt-0.5">Track the waste you recycle every day</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-sm transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Log Waste
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Logs",   value: totalLogs,              text: "text-gray-700",    bg: "bg-white"       },
          { label: "Total Weight", value: `${totalWeight.toFixed(1)} kg`, text: "text-emerald-700", bg: "bg-emerald-50" },
          { label: "Categories",   value: categoryCounts.filter(c => c.count > 0).length, text: "text-blue-700", bg: "bg-blue-50" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border border-gray-100 rounded-2xl p-4 text-center shadow-sm`}>
            <p className={`text-2xl font-black ${s.text}`}>{s.value}</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Category breakdown bar */}
      {totalLogs > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">By Category</p>
          <div className="grid grid-cols-3 gap-2">
            {categoryCounts.filter(c => c.count > 0).map(cat => (
              <div key={cat.value}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-all ${cat.color}
                  ${filter === cat.value ? "ring-2 ring-emerald-400" : "hover:opacity-80"}`}
                onClick={() => changeFilter(filter === cat.value ? "all" : cat.value)}>
                <span className="text-base">{cat.emoji}</span>
                <div className="min-w-0">
                  <p className="text-xs font-bold leading-tight">{cat.label}</p>
                  <p className="text-xs opacity-70">{cat.count} log{cat.count !== 1 ? "s" : ""}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
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
        <button onClick={load} title="Refresh" className="ml-auto p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3">
          <span>⚠️</span>
          <p className="text-sm text-red-600 flex-1">{error}</p>
          <button onClick={load} className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg font-medium">Retry</button>
        </div>
      )}

      {/* List */}
      {loading ? <Spinner /> : paginated.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">♻️</p>
          <p className="text-gray-500 font-medium">{filter === "all" ? "No logs yet" : `No ${filter} logs`}</p>
          <p className="text-xs text-gray-400 mt-1">
            {filter === "all"
              ? "Start logging the waste you recycle!"
              : <button onClick={() => changeFilter("all")} className="text-emerald-600 hover:underline">View all logs</button>}
          </p>
          {filter === "all" && (
            <button onClick={() => setShowAdd(true)}
              className="mt-4 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl transition-colors">
              + Log your first item
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {paginated.map(l => (
            <LogRow key={l._id} log={l} onDelete={setDeleteTarget} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="w-8 h-8 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors flex items-center justify-center text-sm">‹</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
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

      {showAdd && <LogModal onClose={() => setShowAdd(false)} onSave={handleAdd} />}
      {deleteTarget && (
        <DeleteModal log={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} busy={deleting} />
      )}
    </div>
  );
}