"use client";
import React, { useEffect, useCallback, useState } from "react";
import { getMyTrashStats, getMyTrashLogs } from "@/lib/action/user-action";

const CATEGORIES = [
  { value: "plastic",  label: "Plastic",  emoji: "🧴", bar: "bg-blue-400"   },
  { value: "paper",    label: "Paper",    emoji: "📄", bar: "bg-yellow-400" },
  { value: "organic",  label: "Organic",  emoji: "🍂", bar: "bg-green-400"  },
  { value: "metal",    label: "Metal",    emoji: "🔩", bar: "bg-gray-400"   },
  { value: "glass",    label: "Glass",    emoji: "🫙", bar: "bg-cyan-400"   },
  { value: "e-waste",  label: "E-Waste",  emoji: "📱", bar: "bg-purple-400" },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function Spinner() {
  return (
    <div className="flex flex-col items-center gap-3 py-20">
      <div className="w-8 h-8 border-[3px] border-emerald-100 border-t-emerald-500 rounded-full animate-spin" />
      <p className="text-xs text-gray-400">Loading stats…</p>
    </div>
  );
}

function StatCard({ label, value, sub, bg, text, emoji }: {
  label: string; value: string | number; sub?: string;
  bg: string; text: string; emoji: string;
}) {
  return (
    <div className={`${bg} border border-gray-100 rounded-2xl p-4 shadow-sm`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
        <span className="text-lg">{emoji}</span>
      </div>
      <p className={`text-2xl font-black ${text}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// Build last 7 days activity from logs
function buildWeeklyData(logs: any[]) {
  const now = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const count = logs.filter(l => l.createdAt.startsWith(dateStr)).length;
    return { day: DAYS[d.getDay() === 0 ? 6 : d.getDay() - 1], count, dateStr };
  });
}

// Build last 30 days by category from logs
function buildCategoryData(logs: any[]) {
  const now = new Date();
  const cutoff = new Date(now); cutoff.setDate(cutoff.getDate() - 30);
  const recent = logs.filter(l => new Date(l.createdAt) >= cutoff);
  const total = recent.length || 1;
  return CATEGORIES.map(cat => ({
    ...cat,
    count: recent.filter(l => l.category === cat.value).length,
    pct: Math.round((recent.filter(l => l.category === cat.value).length / total) * 100),
  }));
}

// Calculate current streak from logs
function calcStreak(logs: any[]) {
  if (!logs.length) return 0;
  const dates = [...new Set(logs.map(l => l.createdAt.split("T")[0]))].sort().reverse();
  let streak = 0;
  const today = new Date().toISOString().split("T")[0];
  let cursor = today;
  for (const d of dates) {
    if (d === cursor) {
      streak++;
      const prev = new Date(cursor); prev.setDate(prev.getDate() - 1);
      cursor = prev.toISOString().split("T")[0];
    } else break;
  }
  return streak;
}

export default function RecyclingTrackerPage() {
  const [logs, setLogs]       = useState<any[]>([]);
  const [stats, setStats]     = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [view, setView]       = useState<"week" | "month">("week");

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    const [logsRes, statsRes] = await Promise.all([getMyTrashLogs(), getMyTrashStats()]);
    if (logsRes.success) setLogs(logsRes.data ?? []);
    if (statsRes.success) setStats(statsRes.data);
    if (!logsRes.success) setError(logsRes.message ?? "Failed to load data");
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const weeklyData    = buildWeeklyData(logs);
  const categoryData  = buildCategoryData(logs);
  const streak        = stats?.streak ?? calcStreak(logs);
  const totalLogs     = stats?.totalLogs ?? logs.length;
  const totalWeight   = stats?.totalWeight ?? logs.reduce((s: number, l: any) => s + (l.weight ?? 0), 0);

  // Monthly logs count
  const now30 = new Date(); now30.setDate(now30.getDate() - 30);
  const monthlyLogs = logs.filter(l => new Date(l.createdAt) >= now30).length;

  const weekMax = Math.max(...weeklyData.map(d => d.count), 1);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Recycling Tracker</h1>
          <p className="text-xs text-gray-400 mt-0.5">Your habit stats & progress</p>
        </div>
        <button onClick={load} className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400">
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

      {loading ? <Spinner /> : (
        <>
          {/* Streak + Summary cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">Current Streak</p>
                  <p className="text-4xl font-black mt-1">{streak} <span className="text-2xl">🔥</span></p>
                  <p className="text-sm text-emerald-100 mt-1">
                    {streak === 0 ? "Log today to start your streak!" :
                     streak === 1 ? "1 day — great start!" :
                     `${streak} days in a row — keep it up!`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-emerald-100">Total logged</p>
                  <p className="text-2xl font-black">{totalLogs}</p>
                  <p className="text-xs text-emerald-100">{totalWeight.toFixed(1)} kg recycled</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <StatCard label="This Week"  value={weeklyData.reduce((s,d)=>s+d.count,0)} sub="logs logged" bg="bg-white"       text="text-gray-800"    emoji="📅" />
            <StatCard label="This Month" value={monthlyLogs}                            sub="last 30 days" bg="bg-amber-50"   text="text-amber-700"   emoji="📆" />
            <StatCard label="Weight"     value={`${totalWeight.toFixed(1)} kg`}         sub="total recycled" bg="bg-emerald-50" text="text-emerald-700" emoji="⚖️" />
          </div>

          {/* Weekly / Monthly toggle */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-gray-800">Activity</p>
              <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                {(["week", "month"] as const).map(v => (
                  <button key={v} onClick={() => setView(v)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize
                      ${view === v ? "bg-white shadow-sm text-gray-800" : "text-gray-400 hover:text-gray-600"}`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {view === "week" ? (
              <div className="flex items-end gap-2 h-28">
                {weeklyData.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col justify-end" style={{ height: "80px" }}>
                      <div
                        className={`w-full rounded-t-lg transition-all ${d.count > 0 ? "bg-emerald-400" : "bg-gray-100"}`}
                        style={{ height: `${(d.count / weekMax) * 80}px`, minHeight: d.count > 0 ? "6px" : "4px" }}
                      />
                    </div>
                    {d.count > 0 && <span className="text-[10px] font-bold text-emerald-600">{d.count}</span>}
                    <span className="text-[10px] text-gray-400">{d.day}</span>
                  </div>
                ))}
              </div>
            ) : (
              // Monthly: last 30 days as dots
              <div className="space-y-2">
                <p className="text-xs text-gray-400">Last 30 days — each dot = 1 log</p>
                <div className="flex flex-wrap gap-1.5">
                  {Array.from({ length: 30 }, (_, i) => {
                    const d = new Date(); d.setDate(d.getDate() - (29 - i));
                    const dateStr = d.toISOString().split("T")[0];
                    const count = logs.filter(l => l.createdAt.startsWith(dateStr)).length;
                    return (
                      <div key={i} title={`${dateStr}: ${count} log${count !== 1 ? "s" : ""}`}
                        className={`w-6 h-6 rounded-lg transition-colors ${
                          count === 0 ? "bg-gray-100" :
                          count === 1 ? "bg-emerald-200" :
                          count <= 3  ? "bg-emerald-400" : "bg-emerald-600"
                        }`} />
                    );
                  })}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-gray-400">Less</span>
                  {["bg-gray-100","bg-emerald-200","bg-emerald-400","bg-emerald-600"].map(c => (
                    <div key={c} className={`w-4 h-4 rounded ${c}`} />
                  ))}
                  <span className="text-[10px] text-gray-400">More</span>
                </div>
              </div>
            )}
          </div>

          {/* Category breakdown */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
            <p className="text-sm font-bold text-gray-800">By Category <span className="text-xs text-gray-400 font-normal">(last 30 days)</span></p>
            <div className="space-y-3">
              {categoryData.sort((a, b) => b.count - a.count).map(cat => (
                <div key={cat.value} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-600">{cat.emoji} {cat.label}</span>
                    <span className="text-xs text-gray-400">{cat.count} logs · {cat.pct}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`${cat.bar} h-2 rounded-full transition-all`} style={{ width: `${cat.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Milestone badges */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
            <p className="text-sm font-bold text-gray-800">Milestones</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "First Log",    emoji: "🌱", unlocked: totalLogs >= 1   },
                { label: "10 Logs",      emoji: "🌿", unlocked: totalLogs >= 10  },
                { label: "50 Logs",      emoji: "🌳", unlocked: totalLogs >= 50  },
                { label: "3-Day Streak", emoji: "🔥", unlocked: streak >= 3      },
                { label: "Week Streak",  emoji: "⚡", unlocked: streak >= 7      },
                { label: "1 kg Recycled",emoji: "⚖️", unlocked: totalWeight >= 1 },
              ].map(m => (
                <div key={m.label}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border text-center transition-all
                    ${m.unlocked ? "border-emerald-200 bg-emerald-50" : "border-gray-100 bg-gray-50 opacity-50"}`}>
                  <span className={`text-2xl ${!m.unlocked && "grayscale"}`}>{m.emoji}</span>
                  <p className={`text-[10px] font-semibold leading-tight ${m.unlocked ? "text-emerald-700" : "text-gray-400"}`}>{m.label}</p>
                  {m.unlocked && <span className="text-[9px] text-emerald-500 font-bold">Unlocked!</span>}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}