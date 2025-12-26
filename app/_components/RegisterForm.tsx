"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { RegisterData, registerSchema } from "../schema";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

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

  const submit = async (values: RegisterData) => {
    startTransition(async () => {
      router.push("/login");
    });
    console.log("register", values);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      {/* Full Name */}
      <div>
        <input
          type="text"
          {...register("name")}
          placeholder="Abraham Benjamin Devilliers"
          className="w-full rounded-lg border border-gray-300 px-3 py-3 text-black 
          placeholder:text-gray-500 placeholder:font-medium placeholder:text-base
          focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
        {errors.name?.message && (
          <p className="mt-1 text-xs text-red-500">
            {errors.name.message}
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
