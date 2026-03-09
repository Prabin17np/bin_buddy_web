"use client";
import Link from "next/link";

export default function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-100">
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-green-400 rounded-xl flex items-center justify-center text-lg shadow-md shadow-green-200">
            ♻️
          </div>
          <span className="text-xl font-bold text-green-900 tracking-tight">
            BinBuddy
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-8">
          
          <Link
            href="/recycling-guide"
            className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors no-underline"
          >
            Recycling Guide
          </Link>
         
          <Link
            href="/community"
            className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors no-underline"
          >
            Community
          </Link>

          <div className="w-px h-5 bg-green-100" />

          <Link
            href="/login"
            className="text-sm font-medium text-green-700 hover:text-green-900 transition-colors no-underline"
          >
            Sign In
          </Link>

          <Link
            href="/register"
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-200 no-underline"
          >
            Get Started →
          </Link>
        </nav>

      </div>
    </header>
  );
}