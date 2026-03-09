/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ForgetPasswordData, forgetPasswordSchema } from "../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleRequestPasswordReset } from "@/lib/action/auth-action";
import { useState, useTransition } from "react";

// 
interface ForgotPasswordFormProps {
  onOpenLogin: () => void;
}

export default function ForgotPasswordForm({ onOpenLogin }: ForgotPasswordFormProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ForgetPasswordData>({
    resolver: zodResolver(forgetPasswordSchema),
  });

  const onSubmit = async (data: ForgetPasswordData) => {
    setError("");
    startTransition(async () => {
      try {
        const res = await handleRequestPasswordReset(data.email);
        if (!res.success) throw new Error(res.message || "Request failed");

        toast.success("Reset link sent! Check your inbox 📬");
        reset();
        setSent(true);
      } catch (err: Error | any) {
        const message = err.message || "Something went wrong";
        setError(message);
        toast.error(message);
      }
    });
  };

  return (
    <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-3xl p-8 border border-green-100 w-full max-w-md mx-auto">
      <div className="flex flex-col items-center mb-8 gap-2">
        <Image src="/assets/icons/logo.png" height={80} width={80}unoptimized alt="logo" />
        <h1 className="text-3xl font-serif font-bold text-[#2F7330]">Forgot Password</h1>
        <p className="text-gray-500 text-sm text-center">
          Enter your email and we&apos;ll send you a reset link 📧
        </p>
      </div>

      {sent ? (
        <div className="text-center space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-2xl py-6 px-4">
            <p className="text-3xl mb-2">📬</p>
            <p className="text-[#1F5E24] font-semibold">Reset link sent!</p>
            <p className="text-gray-500 text-sm mt-1">Check your inbox and follow the instructions.</p>
          </div>
          {/* Use prop instead of router.push */}
          <button type="button" onClick={onOpenLogin}
            className="w-full bg-[#1F5E24] text-white py-3 rounded-full hover:bg-[#17491c] transition-all duration-300 shadow-md font-semibold">
            Back to Login
          </button>
        </div>
      ) : (
        <>
          {error && (
            <p className="text-red-500 text-sm text-center mb-4 bg-red-50 rounded-xl py-2 px-3">{error}</p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex flex-col gap-1">
              <input type="email" placeholder="Email" {...register("email")}
                className="w-full bg-transparent border-b-2 border-green-300 focus:outline-none focus:border-[#1F5E24] transition-all duration-300 py-2"
              />
              {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
            </div>

            <button type="submit" disabled={isSubmitting || pending}
              className="w-full bg-[#1F5E24] text-white py-3 rounded-full hover:bg-[#17491c] transition-all duration-300 shadow-md hover:shadow-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed">
              {isSubmitting || pending ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Remember your password?{" "}
            {/*  Use prop instead of router.push */}
            <button type="button" onClick={onOpenLogin}
              className="text-[#1F5E24] font-semibold hover:underline">
              Back to Login
            </button>
          </p>
        </>
      )}
    </div>
  );
} 