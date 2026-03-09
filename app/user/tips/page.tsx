"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "@/lib/api/axios";

interface Message {
  role: "user" | "assistant";
  content: string;
  loading?: boolean;
}

const CATEGORIES = [
  { value: "plastic",  label: "Plastic",  emoji: "🧴" },
  { value: "paper",    label: "Paper",    emoji: "📄" },
  { value: "organic",  label: "Organic",  emoji: "🍂" },
  { value: "metal",    label: "Metal",    emoji: "🔩" },
  { value: "glass",    label: "Glass",    emoji: "🫙" },
  { value: "e-waste",  label: "E-Waste",  emoji: "📱" },
];

export default function UserTipsPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState("");
  const [busy, setBusy]         = useState(false);
  const bottomRef               = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const ask = async (question: string) => {
    if (!question.trim() || busy) return;
    setInput("");
    setBusy(true);

    const userMsg: Message = { role: "user", content: question.trim() };
    const history = [...messages, userMsg];
    setMessages([...history, { role: "assistant", content: "", loading: true }]);

    try {
      const res   = await axios.post("/user/tips/ask", {
        messages: history.map(m => ({ role: m.role, content: m.content })),
      });
      const reply = res.data.text ?? "Sorry, couldn't get a response.";
      setMessages([...history, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...history, { role: "assistant", content: "Something went wrong. Please try again." }]);
    } finally {
      setBusy(false);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-4" style={{ height: "calc(100vh - 72px)" }}>

      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-gray-900">♻️ Disposal Tips</h1>
          <p className="text-xs text-gray-400 mt-0.5">Ask AI anything about waste & recycling</p>
        </div>
        {!isEmpty && (
          <button onClick={() => setMessages([])}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium px-2 py-1 rounded-lg hover:bg-red-50">
            Clear
          </button>
        )}
      </div>

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap shrink-0">
        {CATEGORIES.map(cat => (
          <button key={cat.value}
            onClick={() => ask(`Give me 4 quick tips for recycling or disposing ${cat.label} waste.`)}
            disabled={busy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white
              text-xs font-semibold text-gray-600 hover:border-emerald-400 hover:text-emerald-700
              hover:bg-emerald-50 disabled:opacity-40 transition-all">
            <span>{cat.emoji}</span>{cat.label}
          </button>
        ))}
      </div>

      {/* Chat / Empty state */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="text-5xl">🌿</div>
            <p className="text-sm font-semibold text-gray-700">How can I help you today?</p>
            <p className="text-xs text-gray-400 max-w-xs">
              Pick a category above or type your question below — I'll give you quick, practical disposal tips.
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {["Can I recycle pizza boxes?", "How to compost at home?", "Where do batteries go?"].map(q => (
                <button key={q} onClick={() => ask(q)}
                  className="text-xs px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-600
                    hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-all">
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-sm shrink-0
                  ${msg.role === "user" ? "bg-emerald-500" : "bg-gray-100"}`}>
                  {msg.role === "user" ? "👤" : "🌿"}
                </div>
                <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed
                  ${msg.role === "user"
                    ? "bg-emerald-500 text-white rounded-tr-sm"
                    : "bg-gray-50 border border-gray-100 text-gray-700 rounded-tl-sm"}`}>
                  {msg.loading ? (
                    <div className="flex gap-1 items-center py-1">
                      {[0,1,2].map(j => (
                        <div key={j} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${j * 0.15}s` }} />
                      ))}
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 flex gap-2 items-center bg-white border border-gray-200 rounded-2xl px-3 py-2
        focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), ask(input))}
          placeholder="Ask about any waste disposal…"
          disabled={busy}
          className="flex-1 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none bg-transparent disabled:opacity-50"
        />
        <button onClick={() => ask(input)} disabled={busy || !input.trim()}
          className="w-8 h-8 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-30
            text-white flex items-center justify-center transition-all shrink-0">
          {busy
            ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
              </svg>}
        </button>
      </div>

    </div>
  );
}