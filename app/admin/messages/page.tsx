"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { adminGetMessages, adminSendMessage, adminReplyMessage } from "@/lib/action/admin/admin-action";

interface Message {
  _id: string;
   userId: { _id: string; name?: string; email: string; username?: string } | string | null; 
  title: string;
  body: string;
  read: boolean;
  reply?: string;
  repliedAt?: string;
  createdAt: string;
  updatedAt: string;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getUserLabel(userId: Message["userId"]) {
  if (!userId) return "Unknown User";  
  if (typeof userId === "string") return userId;
  return userId.name ?? userId.username ?? userId.email;
}

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24">
      <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
      <p className="text-sm text-gray-400">Loading messages…</p>
    </div>
  );
}

// ─── Send Message Modal ───────────────────────────────────────────────────────
function SendModal({ onClose, onSent }: { onClose: () => void; onSent: () => void }) {
  const [form, setForm] = useState({ userId: "", title: "", body: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!form.userId.trim() || !form.title.trim() || !form.body.trim()) {
      setError("All fields are required."); return;
    }
    setSubmitting(true); setError(null);
    const res = await adminSendMessage(form);
    setSubmitting(false);
    if (res.success) { onSent(); onClose(); }
    else setError(res.message ?? "Failed to send message.");
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-800 text-lg">Send Message</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">⚠️ {error}</div>}

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">User ID *</label>
            <input value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })}
              placeholder="MongoDB ObjectId of the user"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Title *</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Message subject"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Body *</label>
            <textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })}
              rows={4} placeholder="Write your message…"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none transition-all" />
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSend} disabled={submitting}
            className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2">
            {submitting
              ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Sending…</>
              : <><span>📤</span> Send</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── View / Reply Modal ───────────────────────────────────────────────────────
function ViewModal({ message, onClose, onReplied }: {
  message: Message; onClose: () => void;
  onReplied: (id: string, reply: string) => void;
}) {
  const [reply, setReply] = useState(message.reply ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { textareaRef.current?.focus(); }, []);

  const handleReply = async () => {
    if (!reply.trim()) return;
    setSubmitting(true); setError(null);
    const res = await adminReplyMessage({ messageId: message._id, reply: reply.trim() });
    setSubmitting(false);
    if (res.success) { onReplied(message._id, reply.trim()); onClose(); }
    else setError(res.message ?? "Failed to send reply.");
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-bold text-gray-800 text-lg">{message.title}</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              From: <span className="font-medium text-gray-600">{getUserLabel(message.userId)}</span>
              {" · "}{formatDate(message.createdAt)}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Message</p>
          <p className="text-sm text-gray-700 leading-relaxed">{message.body}</p>
        </div>

        {message.reply && (
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
            <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-2">Previous Reply</p>
            <p className="text-sm text-emerald-800 leading-relaxed">{message.reply}</p>
            {message.repliedAt && <p className="text-xs text-emerald-400 mt-1">{formatDate(message.repliedAt)}</p>}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            {message.reply ? "Update Reply" : "Write a Reply"}
          </label>
          <textarea ref={textareaRef} value={reply} onChange={e => setReply(e.target.value)}
            rows={4} placeholder="Type your reply…"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all placeholder:text-gray-300" />
          <p className="text-xs text-gray-400 mt-1 text-right">{reply.length} characters</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">⚠️ {error}</div>}

        <div className="flex gap-3 pt-1">
          <button onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleReply} disabled={submitting || !reply.trim()}
            className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2">
            {submitting
              ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Sending…</>
              : <><span>📤</span> Send Reply</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Message Row ──────────────────────────────────────────────────────────────
function MessageRow({ message, onOpen }: { message: Message; onOpen: (m: Message) => void }) {
  return (
    <div onClick={() => onOpen(message)}
      className={`group flex gap-4 p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-md relative
        ${message.read ? "bg-white border-gray-100" : "bg-emerald-50/60 border-emerald-200"}`}>

      {!message.read && <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-emerald-500 rounded-full" />}

      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0
        ${message.read ? "bg-gray-100" : "bg-emerald-100"}`}>
        {message.reply ? "💬" : "📩"}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className={`text-sm font-semibold truncate ${message.read ? "text-gray-700" : "text-gray-900"}`}>
            {message.title}
          </p>
        </div>
        <p className="text-xs text-gray-500 truncate">
          👤 {getUserLabel(message.userId)}
        </p>
        <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{message.body}</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-gray-400">{formatDate(message.createdAt)}</span>
          {message.reply ? (
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">✓ Replied</span>
          ) : (
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Awaiting reply</span>
          )}
        </div>
      </div>

      <div className="flex items-center text-gray-300 group-hover:text-gray-500 transition-colors shrink-0">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminMessagesPage() {
  const [messages, setMessages]   = useState<Message[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [selected, setSelected]   = useState<Message | null>(null);
  const [showSend, setShowSend]   = useState(false);
  const [filter, setFilter]       = useState<"all" | "unread" | "replied">("all");
  const [search, setSearch]       = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    const res = await adminGetMessages();
    if (res.success) {
      const sorted = (res.data ?? []).sort((a: Message, b: Message) => {
        if (a.read !== b.read) return a.read ? 1 : -1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setMessages(sorted);
    } else {
      setError(res.message ?? "Failed to load messages");
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleReplied = (id: string, reply: string) => {
    setMessages(prev => prev.map(m =>
      m._id === id ? { ...m, reply, repliedAt: new Date().toISOString(), read: true } : m
    ));
  };

  const unreadCount  = messages.filter(m => !m.read).length;
  const repliedCount = messages.filter(m => !!m.reply).length;

  const filtered = messages
    .filter(m => filter === "all" ? true : filter === "unread" ? !m.read : !!m.reply)
    .filter(m => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.body.toLowerCase().includes(q) ||
        getUserLabel(m.userId).toLowerCase().includes(q)
      );
    });

  return (
    <div className="max-w-3xl mx-auto space-y-5 p-4 sm:p-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={load}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500" title="Refresh">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button onClick={() => setShowSend(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-sm transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Message
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by title, body or user…"
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
        {(["all", "unread", "replied"] as const).map(f => {
          const counts = { all: messages.length, unread: unreadCount, replied: repliedCount };
          return (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize
                ${filter === f ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {f}
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full
                ${filter === f ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-500"}`}>
                {counts[f]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading && <Spinner />}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <div className="flex-1">
            <p className="font-semibold text-red-700">Failed to load messages</p>
            <p className="text-sm text-red-500">{error}</p>
          </div>
          <button onClick={load}
            className="text-sm bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-colors font-medium text-red-700">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">
            {filter === "unread" ? "✅" : filter === "replied" ? "💬" : "📭"}
          </div>
          <p className="text-gray-500 font-medium">
            {search ? "No messages match your search" : filter === "unread" ? "No unread messages" : filter === "replied" ? "No replied messages yet" : "No messages yet"}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {!search && filter !== "all" ? `Switch to "All" to see everything.` : ""}
          </p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map(message => (
            <MessageRow key={message._id} message={message} onOpen={setSelected} />
          ))}
        </div>
      )}

      {/* Modals */}
      {showSend && <SendModal onClose={() => setShowSend(false)} onSent={load} />}
      {selected && <ViewModal message={selected} onClose={() => setSelected(null)} onReplied={handleReplied} />}
    </div>
  );
}