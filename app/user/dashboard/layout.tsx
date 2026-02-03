import { AuthProvider } from "@/context/AuthContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <main className="flex-1 px-2 sm:px-6 lg:px-8 p-2">{children}</main>
    </AuthProvider>
  );
}
