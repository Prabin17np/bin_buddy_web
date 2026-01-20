"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoginData, loginSchema } from "../../schema";
import { handleLogin } from "@/lib/action/auth-action";
import toast from "react-hot-toast";

export default function LoginForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

   const onSubmit = async (data: LoginData) => {
    try {
      const res = await handleLogin(data);
      if (!res.success) {
        throw new Error(res.message || "Login Failed");
      }

      toast.success("Login success");

      startTransition(() => {
        router.push("/(auth)/dashboard");
      });
    } catch (error: Error | any) {
      setError(error.message || "Login Failed");
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <input
        type="email"
        placeholder="Email"
        {...register("email")}
        className="w-full rounded-lg border px-3 py-3 text-black"
      />
      {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}

      <input
        type="password"
        placeholder="Password"
        {...register("password")}
        className="w-full rounded-lg border px-3 py-3 text-black"
      />
      {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}

      <button
        type="submit"
        disabled={pending || isSubmitting}
        className="w-full rounded-lg bg-black py-2.5 text-white"
      >
        {pending ? "Logging in..." : "Log in"}
      </button>

      <p className="text-center text-sm text-black">
        Don't have an account?{" "}
        <Link href="/register" className="font-medium text-black hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
