/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ResetPasswordData, resetPasswordSchema } from "../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleResetPassword } from "@/lib/action/auth-action";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Password strength
  const password = watch("newPassword") || "";
  const strength = [
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
    password.length > 6,
  ].filter(Boolean).length;
  const strengthColors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-500"];
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];

  const onSubmit = async (data: ResetPasswordData) => {
    setError("");
    startTransition(async () => {
      try {
        const res = await handleResetPassword(token, data.newPassword);
        if (!res.success) throw new Error(res.message || "Reset failed");

        toast.success("Password reset successfully 🌿");
        reset();
        router.replace("/login");
      } catch (err: Error | any) {
        const message = err.message || "Something went wrong";
        setError(message);
        toast.error(message);
      }
    });
  };

  return (
    <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-3xl p-8 border border-green-100 w-full max-w-md mx-auto">

      {/* Logo + Heading */}
      <div className="flex flex-col items-center mb-8 gap-2">
        <Image src="/assets/icons/logo.png" height={80} width={80}unoptimized alt="logo" />
        <h1 className="text-3xl font-serif font-bold text-[#2F7330]">Reset Password</h1>
        <p className="text-gray-500 text-sm">Choose a strong new password 🔒</p>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-500 text-sm text-center mb-4 bg-red-50 rounded-xl py-2 px-3">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* New Password */}
        <div className="flex flex-col gap-1">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              {...register("newPassword")}
              className="w-full bg-transparent border-b-2 border-green-300 focus:outline-none focus:border-[#1F5E24] transition-all duration-300 py-2 pr-14"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-2 text-sm text-[#1F5E24] font-medium"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.newPassword && (
            <span className="text-red-500 text-xs">{errors.newPassword.message}</span>
          )}

          {/* Strength bar */}
          {password.length > 0 && (
            <div className="mt-1 space-y-1">
              <div className="h-1.5 rounded-full overflow-hidden bg-slate-200">
                <div
                  className={`${strengthColors[strength - 1] || "bg-red-400"} h-1.5 transition-all duration-300`}
                  style={{ width: `${(strength / 4) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-400">
                Strength:{" "}
                <span className="font-medium text-gray-600">
                  {strengthLabels[strength - 1] || "Too weak"}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1">
          <input
            type="password"
            placeholder="Confirm New Password"
            {...register("confirmNewPassword")}
            className="w-full bg-transparent border-b-2 border-green-300 focus:outline-none focus:border-[#1F5E24] transition-all duration-300 py-2"
          />
          {errors.confirmNewPassword && (
            <span className="text-red-500 text-xs">{errors.confirmNewPassword.message}</span>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || pending}
          className="w-full bg-[#1F5E24] text-white py-3 rounded-full hover:bg-[#17491c] transition-all duration-300 shadow-md hover:shadow-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting || pending ? "Resetting..." : "Reset Password"}
        </button>

      </form>

      {/* Back to login */}
      <p className="text-center text-sm text-gray-600 mt-6">
        Remember your password?{" "}
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="text-[#1F5E24] font-semibold hover:underline"
        >
          Back to Login
        </button>
      </p>

    </div>
  );
}