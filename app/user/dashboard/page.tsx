"use client";
import { useAuth } from "@/context/AuthContext";

export default function Page() {
  const { logout } = useAuth();

  return (
    <div>
      User Dashboard
      <span className="text-sm font-medium sm:inline">
        <button
          onClick={() => {
            logout();
          }}
          className="w-full border flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-foreground/5 transition-colors text-left"
        >
          Logout
        </button>
      </span>
    </div>
  );
}
