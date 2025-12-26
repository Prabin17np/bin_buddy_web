"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoginData, loginSchema } from "../schema";

export default function LoginForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  const submit = async (values: LoginData) => {
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Uncomment to navigate after login
      // router.push("/");
    });
    console.log("login", values);
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      {/* Email */}
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
          placeholder="you@example.com"
        />
        {errors.email?.message && <p>{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
          placeholder="••••••"
        />
        {errors.password?.message && <p>{errors.password.message}</p>}
      </div>

      {/* Submit */}
      <button type="submit" disabled={isSubmitting || pending}>
        {isSubmitting || pending ? "Logging in..." : "Log in"}
      </button>

      {/* Footer */}
      <div>
        Don't have an account? <Link href="/register">Sign up</Link>
      </div>
    </form>
  );
}
