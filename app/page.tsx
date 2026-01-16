// src/app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-green-600 text-white">
        {/* Left side */}
        <div className="flex gap-6 font-semibold">
          <Link href="/" className="hover:text-black">Home</Link>
          <Link href="/about" className="hover:text-black">About</Link>
        </div>

        {/* Right side */}
        <div className="flex gap-6 font-semibold">
          <Link href="/login" className="hover:text-black">Login</Link>
          <Link href="/register" className="hover:text-black">Sign Up</Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center mt-16 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4 text-black">Welcome to Web API Sprint 1</h1>
        <p className="text-lg text-black/70">
          This is the Home page. Use the navigation bar to explore Login and Register pages.
        </p>
      </main>
    </div>
  );
}
