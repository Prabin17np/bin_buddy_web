"use client";

import LoginForm from "@/app/_components/LoginForm";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Log in to your account
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
