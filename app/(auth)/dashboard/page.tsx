"use client";

import Link from "next/link";
import DashboardCard from "../_components/DashboardCard";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

        <Link
          href="/"
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Go Home
        </Link>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard title="Total Users" value="120" />
        <DashboardCard title="Active Sessions" value="45" />
        <DashboardCard title="New Registrations" value="18" />
      </div>

      {/* Section */}
      <div className="mt-8 rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>

        <ul className="space-y-3 text-sm text-gray-700">
          <li>✅ User registered</li>
          <li>🔐 User logged in</li>
          <li>📝 Profile updated</li>
        </ul>
      </div>
    </div>
  );
}
