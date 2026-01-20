"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { RegisterData, registerSchema } from "../schema";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { handleRegister } from "@/lib/action/auth-action";

export default function RegisterForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
  });

const onSubmit = async (data: RegisterData) => {
    try {
      const res = await handleRegister(data);
      if (!res.success) {
        throw new Error(res.message || "Registration failed");
      }
      toast.success("Registration successful");
      // handle redirect (optional)
      startTransition(() => {
        router.push("/login");
      });
    } catch (err: Error | any) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Full Name */}
      <div>
        <input
          type="text"
          {...register("username")}
          placeholder="Abraham Benjamin Devilliers"
          className="w-full rounded-lg border border-gray-300 px-3 py-3 text-black 
          placeholder:text-gray-500 placeholder:font-medium placeholder:text-base
          focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
        {errors.username?.message && (
          <p className="mt-1 text-xs text-red-500">
            {errors.username.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <input
          type="email"
          {...register("email")}
          placeholder="abd17@example.com"
          className="w-full rounded-lg border border-gray-300 px-3 py-3 text-black 
          placeholder:text-gray-500 placeholder:font-medium placeholder:text-base
          focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
        {errors.email?.message && (
          <p className="mt-1 text-xs text-red-500">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className="w-full rounded-lg border border-gray-300 px-3 py-3 text-black 
          placeholder:text-gray-500 placeholder:font-medium placeholder:text-base
          focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
        {errors.password?.message && (
          <p className="mt-1 text-xs text-red-500">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <input
          type="password"
          {...register("confirmPassword")}
          placeholder="Confirm Password"
          className="w-full rounded-lg border border-gray-300 px-3 py-3 text-black 
          placeholder:text-gray-500 placeholder:font-medium placeholder:text-base
          focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
        {errors.confirmPassword?.message && (
          <p className="mt-1 text-xs text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="w-full rounded-lg bg-black py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60"
      >
        {isSubmitting || pending
          ? "Creating account..."
          : "Create account"}
      </button>

      {/* Footer */}
      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-black hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
