"use client";
import ForgotPasswordForm from "../_components/ForgotPasswordForm";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return <ForgotPasswordForm onOpenLogin={() => router.push("/login")} />;
}