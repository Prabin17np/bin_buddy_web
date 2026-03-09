"use client";
import { useRouter } from "next/navigation";
import { handleLogout } from "@/lib/action/auth-action";

export default function LogoutButton() {
  const router = useRouter();

  const onLogout = async () => {
    await handleLogout();
    router.replace("/");
  };

  return (
    <button
      onClick={onLogout}
      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
    >
      Logout
    </button>
  );
}