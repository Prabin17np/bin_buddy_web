"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { getUserReports, submitReport, updateReport, deleteReport } from "@/lib/action/user-action";
import type { Report } from "@/app/utils/types";

const PAGE_SIZE = 8;

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  pending:    { label: "Pending",     bg: "bg-amber-50",   text: "text-amber-700"   },
  resolved:   { label: "Resolved",    bg: "bg-emerald-50", text: "text-emerald-700" },
  open:       { label: "Open",        bg: "bg-sky-50",     text: "text-sky-700"     },
  rejected:   { label: "Rejected",    bg: "bg-red-50",     text: "text-red-700"     },
  inprogress: { label: "In Progress", bg: "bg-blue-50",    text: "text-blue-700"    },
};

const REPORT_TYPES = [
  { value: "illegal_dumping", label: "Illegal Dumping" },
  { value: "overflowing_bin", label: "Overflowing Bin" },
  { value: "hazardous_waste", label: "Hazardous Waste" },
  { value: "other",           label: "Other"           },
];

const SEVERITY = [
  { value: "low",    label: "🟢 Low"    },
  { value: "medium", label: "🟡 Medium" },
  { value: "high",   label: "🔴 High"   },
];

interface FormState {
  title: string; description: string; location: string;
  type: string;  severity: string;
}
const EMPTY_FORM: FormState = { title: "", description: "", location: "", type: "illegal_dumping", severity: "medium" };

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_CONFIG[status?.toLowerCase()] ?? { label: status, bg: "bg-gray-50", text: "text-gray-600" };
  return <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>{s.label}</span>;
}

function Spinner() {
  return (
    <div className="flex flex-col items-center gap-3 py-20">
      <div className="w-8 h-8 border-[3px] border-emerald-100 border-t-emerald-500 rounded-full animate-spin" />
      <p className="text-xs text-gray-400">Loading reports…</p>
    </div>
  );
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function ReportModal({
  initial, onClose, onSave, title: modalTitle,
}: {
  initial?: FormState; onClose: () => void;
  onSave: (form: FormState, file?: File | null) => Promise<void>;
  title: string;
}) {
  const [form, setForm]       = useState<FormState>(initial ?? EMPTY_FORM);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy]       = useState(false);
  const [err, setErr]         = useState<string | null>(null);
  const fileRef               = useRef<HTMLInputElement>(null);
  const fileRef2              = useRef<File | null>(null);

  const set = (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { fileRef2.current = file; setPreview(URL.createObjectURL(file)); }
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.location.trim() || !form.description.trim()) {
      setErr("Please fill in all required fields."); return;
    }
    setBusy(true); setErr(null);
    try { await onSave(form, fileRef2.current); }
    catch (e: any) { setErr(e?.message ?? "Something went wrong."); setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-800">{modalTitle}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Help keep your community clean</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100 transition-colors text-gray-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {err && <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-medium rounded-xl px-3 py-2">⚠️ {err}</div>}

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Title *</label>
            <input value={form.title} onChange={set("title")} placeholder="e.g., Illegal dumping near river"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Type</label>
              <select value={form.type} onChange={set("type")}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white">
                {REPORT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Severity</label>
              <select value={form.severity} onChange={set("severity")}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white">
                {SEVERITY.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Location *</label>
            <input value={form.location} onChange={set("location")} placeholder="e.g., Near Bagmati River, Kathmandu"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description *</label>
            <textarea value={form.description} onChange={set("description")} rows={3}
              placeholder="Describe the waste issue in detail…"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none transition-all" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Photo (optional)</label>
            {preview ? (
              <div className="relative">
                <img src={preview} alt="preview" className="w-full h-36 object-cover rounded-2xl" />
                <button onClick={() => { setPreview(null); fileRef2.current = null; if (fileRef.current) fileRef.current.value = ""; }}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/50 text-white rounded-full flex items-center justify-center text-xs hover:bg-black/70 transition-colors">✕</button>
              </div>
            ) : (
              <button onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-200 hover:border-emerald-400 rounded-2xl py-6 flex flex-col items-center gap-2 text-gray-400 hover:text-emerald-600 transition-all">
                <span className="text-2xl">📷</span>
                <span className="text-xs font-medium">Click to attach a photo</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>
        </div>

        <div className="px-5 py-4 border-t border-gray-50 flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={busy}
            className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2">
            {busy ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</> : modalTitle}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ report, onConfirm, onCancel, busy }: {
  report: any; onConfirm: () => void; onCancel: () => void; busy: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onCancel}>
      <div className="w-full max-w-xs bg-white rounded-3xl shadow-2xl p-6 space-y-4" onClick={e => e.stopPropagation()}>
        <div className="text-center">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3">🗑️</div>
          <h3 className="font-bold text-gray-800">Delete Report?</h3>
          <p className="text-sm text-gray-500 mt-1">"<span className="font-medium">{report.title}</span>" will be permanently deleted.</p>
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

function ReportRow({ report, onEdit, onDelete }: {
  report: any; onEdit: (r: any) => void; onDelete: (r: any) => void;
}) {
  const canEdit = report.status === "pending" || report.status === "open";
  return (
    <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group">
      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xl shrink-0 mt-0.5">⚠️</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-gray-800 leading-tight">{report.title}</p>
          <StatusBadge status={report.status} />
        </div>
        <p className="text-xs text-gray-400 mt-1 line-clamp-1">{report.description}</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-gray-400">📍 {report.location}</span>
          <span className="text-gray-200">·</span>
          <span className="text-xs text-gray-400">{formatDate(report.createdAt)}</span>
          {report.severity && (
            <><span className="text-gray-200">·</span>
            <span className="text-xs text-gray-400 capitalize">{report.severity} severity</span></>
          )}
        </div>
      </div>
      <div className="flex gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {canEdit && (
          <button onClick={() => onEdit(report)} title="Edit"
            className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-emerald-100 hover:text-emerald-700 text-gray-400 flex items-center justify-center transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}
        {canEdit && (
          <button onClick={() => onDelete(report)} title="Delete"
            className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-red-100 hover:text-red-600 text-gray-400 flex items-center justify-center transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default function UserReportsPage() {
  const [reports, setReports]           = useState<any[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [toast, setToast]               = useState<{ ok: boolean; msg: string } | null>(null);
  const [page, setPage]                 = useState(1);
  const [filter, setFilter]             = useState<"all" | "pending" | "resolved">("all");
  const [showSubmit, setShowSubmit]     = useState(false);
  const [editTarget, setEditTarget]     = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleting, setDeleting]         = useState(false);

  const flash = (ok: boolean, msg: string) => {
    setToast({ ok, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    const res = await getUserReports();
    if (res.success) {
      const sorted = (res.data ?? []).sort((a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setReports(sorted);
    } else {
      setError(res.message ?? "Failed to load reports");
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (form: FormState, file?: File | null) => {
    const fd = new FormData();
    (Object.entries(form) as [string, string][]).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append("photo", file);
    const res = await submitReport(fd);
    if (res.success && res.data) {
      setReports(prev => [res.data!, ...prev]);
      setShowSubmit(false);
      flash(true, "Report submitted! We'll look into it shortly. 🙏");
    } else {
      throw new Error(res.message ?? "Submission failed");
    }
  };

  const handleEdit = async (form: FormState, file?: File | null) => {
    if (!editTarget) return;
    const fd = new FormData();
    (Object.entries(form) as [string, string][]).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append("photo", file);
    const res = await updateReport(editTarget._id ?? editTarget.id, fd);
    if (res.success) {
      setReports(prev => prev.map(r =>
        (r._id ?? r.id) === (editTarget._id ?? editTarget.id) ? { ...r, ...form } : r
      ));
      setEditTarget(null);
      flash(true, "Report updated successfully.");
    } else {
      throw new Error(res.message ?? "Update failed");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await deleteReport(deleteTarget._id ?? deleteTarget.id);
    if (res.success) {
      setReports(prev => prev.filter(r =>
        (r._id ?? r.id) !== (deleteTarget._id ?? deleteTarget.id)
      ));
      flash(true, "Report deleted.");
    } else {
      flash(false, res.message ?? "Failed to delete report.");
    }
    setDeleting(false);
    setDeleteTarget(null);
  };

  const pending  = reports.filter(r => r.status === "pending").length;
  const resolved = reports.filter(r => r.status === "resolved").length;
  const filtered = filter === "all" ? reports : reports.filter(r => r.status === filter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const changeFilter = (f: typeof filter) => { setFilter(f); setPage(1); };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold
          ${toast.ok ? "bg-emerald-500" : "bg-red-500"} text-white`}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">My Reports</h1>
          <p className="text-xs text-gray-400 mt-0.5">Report waste issues in your community</p>
        </div>
        <button onClick={() => setShowSubmit(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-sm transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Report
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total",    value: reports.length, bg: "bg-white",      text: "text-gray-700"    },
          { label: "Pending",  value: pending,        bg: "bg-amber-50",   text: "text-amber-700"   },
          { label: "Resolved", value: resolved,       bg: "bg-emerald-50", text: "text-emerald-700" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border border-gray-100 rounded-2xl p-4 text-center shadow-sm`}>
            <p className={`text-2xl font-black ${s.text}`}>{s.value}</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {(["all", "pending", "resolved"] as const).map(f => (
          <button key={f} onClick={() => changeFilter(f)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold capitalize transition-all
              ${filter === f ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-gray-400"}`}>
            {f}
          </button>
        ))}
        <button onClick={load} title="Refresh" className="ml-auto p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3">
          <span>⚠️</span>
          <p className="text-sm text-red-600 flex-1">{error}</p>
          <button onClick={load} className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg font-medium">Retry</button>
        </div>
      )}

      {loading ? <Spinner /> : paginated.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-gray-500 font-medium">{filter === "all" ? "No reports yet" : `No ${filter} reports`}</p>
          <p className="text-xs text-gray-400 mt-1">
            {filter === "all"
              ? "Found a waste issue? Report it and help your community!"
              : <button onClick={() => changeFilter("all")} className="text-emerald-600 hover:underline">View all reports</button>}
          </p>
          {filter === "all" && (
            <button onClick={() => setShowSubmit(true)}
              className="mt-4 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl transition-colors">
              + Submit your first report
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {paginated.map(r => (
            <ReportRow key={r._id ?? r.id} report={r} onEdit={setEditTarget} onDelete={setDeleteTarget} />
          ))}
        </div>
      )}

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

      {showSubmit && <ReportModal title="Submit Report" onClose={() => setShowSubmit(false)} onSave={handleSubmit} />}
      {editTarget && (
        <ReportModal
          title="Edit Report"
          initial={{ title: editTarget.title, description: editTarget.description, location: editTarget.location, type: editTarget.type ?? "other", severity: editTarget.severity ?? "medium" }}
          onClose={() => setEditTarget(null)}
          onSave={handleEdit}
        />
      )}
      {deleteTarget && (
        <DeleteModal report={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} busy={deleting} />
      )}
    </div>
  );
}