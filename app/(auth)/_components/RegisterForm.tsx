/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { RegisterData, registerSchema } from "../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleRegister } from "@/lib/action/auth-action";
import { useState, useTransition } from "react";

// Props interface
interface RegisterFormProps {
  onOpenLogin: () => void;
}

export default function RegisterForm({ onOpenLogin }: RegisterFormProps) {
  const [pending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
     mode: "onSubmit",
  });

  const password = watch("password") || "";
  const confirmPassword = watch("confirmPassword") || "";
  const passwordsMatch = password === confirmPassword;

  const strength = [
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
    password.length > 6,
  ].filter(Boolean).length;
  const strengthColors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-500"];
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];

  const onSubmit = async (data: RegisterData) => {
    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    startTransition(async () => {
      try {
        const res = await handleRegister({
          username: data.username,
          email: data.email,
          password: data.password,
          role: "user",
        });
        if (!res.success) throw new Error(res.message || "Registration failed");

        toast.success("Account created successfully 🌿");
        reset();
        onOpenLogin();
      } catch (err: Error | any) {
        const message = err.message || "Registration failed";
        setError(message);
        toast.error(message);
      }
    });
  };

  return (
    <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-3xl p-8 border border-green-100 w-full max-w-md mx-auto">
      <div className="flex flex-col items-center mb-8 gap-2">
       <Image src="/assets/icons/logo.png" height={80} width={80}unoptimized alt="logo" />
        <h1 className="text-3xl font-serif font-bold text-[#2F7330]">Join BinBuddy</h1>
        <p className="text-gray-500 text-sm">Create your eco account 🌱</p>
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center mb-4 bg-red-50 rounded-xl py-2 px-3">{error}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Username */}
        <div className="flex flex-col gap-1">
          <input type="text" placeholder="Username" {...register("username")}
            className="w-full bg-transparent border-b-2 border-green-300 focus:outline-none focus:border-[#1F5E24] transition-all duration-300 py-2"
          />
          {errors.username && <span className="text-red-500 text-xs">{errors.username.message}</span>}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <input type="email" placeholder="Email" {...register("email")}
            className="w-full bg-transparent border-b-2 border-green-300 focus:outline-none focus:border-[#1F5E24] transition-all duration-300 py-2"
          />
          {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
        </div>

        {/* Password */}
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
          {password.length > 0 && (
            <div className="mt-1 space-y-1">
              <div className="h-1.5 rounded-full overflow-hidden bg-slate-200">
                <div className={`${strengthColors[strength - 1] || "bg-red-400"} h-1.5 transition-all duration-300`}
                  style={{ width: `${(strength / 4) * 100}%` }} />
              </div>
              <p className="text-xs text-gray-400">
                Strength: <span className="font-medium text-gray-600">{strengthLabels[strength - 1] || "Too weak"}</span>
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1">
          <input type="password" placeholder="Confirm Password" {...register("confirmPassword")}
            className="w-full bg-transparent border-b-2 border-green-300 focus:outline-none focus:border-[#1F5E24] transition-all duration-300 py-2"
          />
          {errors.confirmPassword && <span className="text-red-500 text-xs">{errors.confirmPassword.message}</span>}
          {!passwordsMatch && confirmPassword && (
            <span className="text-red-500 text-xs">Passwords do not match</span>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={isSubmitting || pending || !passwordsMatch}
          className="w-full bg-[#1F5E24] text-white py-3 rounded-full hover:bg-[#17491c] transition-all duration-300 shadow-md hover:shadow-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed">
          {isSubmitting || pending ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{" "}
        <button type="button" onClick={onOpenLogin} className="text-[#1F5E24] font-semibold hover:underline">
          Sign In
        </button>
      </p>
    </div>
  );
}