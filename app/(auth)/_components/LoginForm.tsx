/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { LoginData, loginSchema } from "../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleLogin } from "@/lib/action/auth-action";
import { useState, useTransition } from "react";

//Add props interface
interface LoginFormProps {
  onOpenRegister: () => void;
  onForgotPassword: () => void;
}

export default function LoginForm({ onOpenRegister, onForgotPassword }: LoginFormProps) {
  const [pending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    setError("");
    startTransition(async () => {
      try {
        const res = await handleLogin({ email: data.email, password: data.password });
        console.log("RES DATA:", JSON.stringify(res));
        if (!res.success) throw new Error(res.message || "Login failed");
        toast.success("Login successful 🌿");
        if (res.data?.role === "admin") return window.location.replace("/admin/dashboard");
        if (res.data?.role === "user") return window.location.replace("/user/dashboard");
      } catch (err: Error | any) {
        const message = err.message || "Login failed";
        setError(message);
        toast.error(message);
      }
    });
  };

  return (
    <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-3xl p-8 border border-green-100 w-full max-w-md mx-auto">
      <div className="flex flex-col items-center mb-8 gap-2">
       <Image src="/assets/icons/logo.png" height={80} width={80}unoptimized alt="logo" />
        <h1 className="text-3xl font-serif font-bold text-[#2F7330]">Welcome Back</h1>
        <p className="text-gray-500 text-sm">Login to your BinBuddy account 🌿</p>
      </div>

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

        <div className="flex flex-col gap-1">
          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Password" {...register("password")}
              className="w-full bg-transparent border-b-2 border-green-300 focus:outline-none focus:border-[#1F5E24] transition-all duration-300 py-2 pr-14"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-2 text-sm text-[#1F5E24] font-medium">
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
        </div>

        {/* Use prop instead of router.push */}
        <div className="text-right">
          <button type="button" onClick={onForgotPassword}
            className="text-sm text-[#1F5E24] hover:underline font-medium">
            Forgot Password?
          </button>
        </div>

        <button type="submit" disabled={isSubmitting || pending}
          className="w-full bg-[#1F5E24] text-white py-3 rounded-full hover:bg-[#17491c] transition-all duration-300 shadow-md hover:shadow-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed">
          {isSubmitting || pending ? "Logging in..." : "Log In"}
        </button>
      </form>

      {/* Use prop instead of router.push */}
      <p className="text-center text-sm text-gray-600 mt-6">
        Don&apos;t have an account?{" "}
        <button type="button" onClick={onOpenRegister}
          className="text-[#1F5E24] font-semibold hover:underline">
          Register
        </button>
      </p>
    </div>
  );
}