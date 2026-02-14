"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterData, registerSchema } from "../../schema";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { handleRegister } from "@/lib/action/auth-action";

interface RegisterFormProps {
  onOpenLogin?: () => void; // optional
}

export default function RegisterForm({ onOpenLogin }: RegisterFormProps) {
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

      startTransition(() => {
        router.replace("/login");
      });

    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center mx-auto max-w-md p-6 rounded-lg bg-gray-800">
      <p className="text-center text-3xl font-semibold text-white">
        Create Account
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full mt-6"
      >
        <div className="flex flex-col">
          <input
            type="text"
            placeholder="Full Name"
            {...register("username")}
            className="px-5 py-2 bg-gray-700 text-white rounded-2xl outline-none focus:ring-2 focus:ring-[#BE9D68]"
          />
          {errors.username && (
            <span className="text-red-500 text-sm mt-1">
              {errors.username.message}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="px-5 py-2 bg-gray-700 text-white rounded-2xl outline-none focus:ring-2 focus:ring-[#BE9D68]"
          />
          {errors.email && (
            <span className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </span>
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
            <span className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <input
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword")}
            className="px-5 py-2 bg-gray-700 text-white rounded-2xl outline-none focus:ring-2 focus:ring-[#BE9D68]"
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || pending}
          className="bg-[#488563] rounded-3xl py-2 text-white disabled:opacity-60 transition"
        >
          {isSubmitting || pending ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-white">
        <span>Already have an account? </span>
        <button
          type="button"
          className="text-[#BE9D68] font-semibold"
          onClick={() => onOpenLogin?.()}
        >
          Log In
        </button>
      </div>
    </div>
  );
}
