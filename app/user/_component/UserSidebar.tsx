"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/user/dashboard", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/explore", label: "Explore" },
  { href: "/contact", label: "Contact Us" },
];

export default function UserSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === href : pathname?.startsWith(href);

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
                flex flex-col
                justify-between
                fixed md:static 
                top-0 left-0 
                h-screen w-64 
                bg-white dark:bg-gray-900 
                border-r border-gray-200 dark:border-gray-800 
                z-40 overflow-y-auto`}
        style={{ paddingBottom: "32px" }}
      >
        <div>
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-gray-900 dark:bg-white dark:text-gray-900 flex items-center justify-center font-bold">
                <Image
                  src="/icons/logo.png"
                  height={20}
                  width={30}
                  alt="logo"
                />
              </div>
              <span className="font-semibold text-[#488563]">VedaVerse</span>
            </Link>
          </div>

          <nav className="p-2 space-y-1">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <Link
          className="m-6 border border-gray-200 dark:border-gray-800 flex justify-center"
          href={"/user/profile"}
        >
          Profile
        </Link>
      </aside>
    </>
  );
}
