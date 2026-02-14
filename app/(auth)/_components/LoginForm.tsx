"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { LoginData, loginSchema } from "../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { handleLogin } from "@/lib/action/auth-action";

interface LoginFormProps {
  onOpenRegister?: () => void;      // optional now
  onForgotPassword?: () => void;    // optional
}

export default function LoginForm({
  onOpenRegister,
  onForgotPassword,
}: LoginFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

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
      if (res.data?.role === "admin") {
        router.replace("/admin");
      } else if (res.data?.role === "user") {
        router.replace("/user/dashboard");
      } else {
        router.replace("/");
      }
    });
  } catch (error: any) {
    toast.error(error.message);
  }
};


  return (
    <div className="flex flex-col items-center mx-auto max-w-md p-6 rounded-lg bg-gray-800">
      <p className="text-center text-3xl font-semibold text-white">
        Welcome Back
      </p>

      <form
        className="flex flex-col gap-4 w-full mt-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col">
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="px-5 py-2 bg-gray-700 text-white rounded-2xl outline-none focus:ring-2 focus:ring-[#BE9D68]"
          />
          {errors.email && (
            <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>
          )}
        </div>

        <div className="flex flex-col">
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="px-5 py-2 bg-gray-700 text-white rounded-2xl outline-none focus:ring-2 focus:ring-[#BE9D68]"
          />
          {errors.password && (
            <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || pending}
          className="bg-[#488563] rounded-3xl py-2 text-white disabled:opacity-60 transition"
        >
          {isSubmitting || pending ? "Logging in..." : "Log In"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-white">
        <span>Don't have an account? </span>
        <button
          type="button"
          className="text-[#BE9D68] font-semibold"
          onClick={onOpenRegister}
        >
          Register
        </button>

        <div className="mt-2">
          <button
            type="button"
            onClick={onForgotPassword}
            className="font-semibold hover:underline"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
}
