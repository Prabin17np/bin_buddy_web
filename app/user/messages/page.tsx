"use client";
import React, { useEffect, useState, useCallback } from "react";
import { getUserMessages, replyMessage, sendMessage } from "@/lib/action/user-action";

interface Message {
  _id: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  reply?: string;
  repliedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
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

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24">
      <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
      <p className="text-sm text-gray-400">Loading messages…</p>
    </div>
  );
}

// ─── Compose Modal (User → Admin) ─────────────────────────────────────────────
function ComposeModal({ onClose, onSent }: { onClose: () => void; onSent: () => void }) {
  const [form, setForm] = useState({ title: "", body: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

 const handleSend = async () => {
  if (!form.title.trim() || !form.body.trim()) {
    setError("Please fill in all fields.");
    return;
  }
  setSubmitting(true);
  setError(null);
  const res = await sendMessage({ title: form.title, body: form.body }); // ← fixed
  setSubmitting(false);
  if (res.success) {
    onSent();
    onClose();
  } else {
    setError(res.message ?? "Failed to send message.");
  }
};
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-800 text-lg">Contact Admin</h2>
            <p className="text-xs text-gray-400 mt-0.5">Send a message and we'll get back to you</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">⚠️ {error}</div>
        )}

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Subject *</label>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="What is your message about?"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Message *</label>
            <textarea
              value={form.body}
              onChange={e => setForm({ ...form, body: e.target.value })}
              rows={5}
              placeholder="Describe your issue or question…"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none transition-all"
            />
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
              : <><span>📤</span> Send Message</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── View Modal (Read-only: user message + admin reply) ───────────────────────
function ViewModal({ message, onClose }: { message: Message; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-bold text-gray-800 text-lg">{message.title}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{formatDate(message.createdAt)}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User's original message */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Your Message</p>
          <p className="text-sm text-gray-700 leading-relaxed">{message.body}</p>
        </div>

        {/* Admin reply — shown only if replied */}
        {message.reply ? (
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Admin Reply</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {message.repliedAt && (
                <span className="text-xs text-emerald-400">{formatDate(message.repliedAt)}</span>
              )}
            </div>
            <p className="text-sm text-emerald-800 leading-relaxed">{message.reply}</p>
          </div>
        ) : (
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex items-center gap-3">
            <span className="text-xl">⏳</span>
            <div>
              <p className="text-sm font-semibold text-amber-700">Awaiting Reply</p>
              <p className="text-xs text-amber-500 mt-0.5">Our team will get back to you soon.</p>
            </div>
          </div>
        )}

        <button onClick={onClose}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          Close
        </button>
      </div>
    </div>
  );
}

// ─── Message Card ─────────────────────────────────────────────────────────────
function MessageCard({ message, onOpen }: { message: Message; onOpen: (m: Message) => void }) {
  return (
    <div
      onClick={() => onOpen(message)}
      className={`group relative flex gap-4 p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-md
        ${message.read ? "bg-white border-gray-100" : "bg-emerald-50/60 border-emerald-200"}`}
    >
      {/* Unread dot */}
      {!message.read && (
        <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
      )}

      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0
        ${message.read ? "bg-gray-100" : "bg-emerald-100"}`}>
        {message.reply ? "💬" : "📩"}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate ${message.read ? "text-gray-700" : "text-gray-900"}`}>
          {message.title}
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

      {/* Arrow */}
      <div className="flex items-center text-gray-300 group-hover:text-gray-500 transition-colors shrink-0">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [selected, setSelected] = useState<Message | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [filter, setFilter]     = useState<"all" | "unread" | "replied">("all");

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await getUserMessages();
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

  useEffect(() => { loadMessages(); }, [loadMessages]);

  const filtered = messages.filter(m => {
    if (filter === "unread")  return !m.read;
    if (filter === "replied") return !!m.reply;
    return true;
  });

  const unreadCount  = messages.filter(m => !m.read).length;
  const repliedCount = messages.filter(m => !!m.reply).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4 sm:p-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadMessages}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500" title="Refresh">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button onClick={() => setShowCompose(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-sm transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Message
          </button>
        </div>
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
          <button onClick={loadMessages}
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
            {filter === "unread" ? "No unread messages" : filter === "replied" ? "No replied messages yet" : "No messages yet"}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {filter === "all"
              ? "Have a question? Send us a message."
              : `Switch to "All" to see everything.`}
          </p>
          {filter === "all" && (
            <button onClick={() => setShowCompose(true)}
              className="mt-4 px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-colors">
              Contact Admin
            </button>
          )}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map(message => (
            <MessageCard key={message._id} message={message} onOpen={setSelected} />
          ))}
        </div>
      )}

      {/* Modals */}
      {showCompose && (
        <ComposeModal onClose={() => setShowCompose(false)} onSent={loadMessages} />
      )}
      {selected && (
        <ViewModal message={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}