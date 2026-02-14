/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { forgetPasswordSchema, ForgetPasswordData } from "../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleRequestPasswordReset } from "@/lib/action/auth-action";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ForgotPasswordFormProps {
  onOpenLogin: () => void;
}

const ForgetPasswordForm = ({ onOpenLogin }: ForgotPasswordFormProps) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgetPasswordData>({
    mode: "onSubmit",
    resolver: zodResolver(forgetPasswordSchema),
  });
  const [error, setError] = useState<string | null>(null);
  const [pending, setTransition] = useTransition();
  const submit = (values: ForgetPasswordData) => {
    setError(null);
    setTransition(async () => {
      try {
        const result = await handleRequestPasswordReset(values.email);
        if (result.success) {
          toast.success(
            "If the email is registered, a reset link has been sent.",
          );
          return router.push("/");
        } else {
          throw new Error(result.message || "Failed to send reset link");
        }
      } catch (err: Error | any) {
        toast.error(err.message || "Failed to send reset link");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
          {...register("email")}
          placeholder="you@example.com"
        />
        {errors.email?.message && (
          <p className="text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="h-10 w-full rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting || pending ? "Sending..." : "Send Link"}
      </button>

      <div className="mt-1 text-center text-sm">
        Already have an account?{" "}
        <button onClick={onOpenLogin} className="font-semibold hover:underline">
          Log in
        </button>
      </div>
    </form>
  );
};

export default ForgetPasswordForm;