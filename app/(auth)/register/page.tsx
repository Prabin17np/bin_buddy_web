"use client";
import RegisterForm from "../_components/RegisterForm";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return <RegisterForm onOpenLogin={() => router.push("/login")} />;
}