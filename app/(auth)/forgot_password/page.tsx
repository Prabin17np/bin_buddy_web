"use client";

import { useRouter } from "next/navigation";
import ForgetPasswordForm from "../_components/ForgotPasswordForm";

export default function Page() {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <ForgetPasswordForm
        onOpenLogin={() => router.push("/login")} 
      />
    </div>
  );
}
