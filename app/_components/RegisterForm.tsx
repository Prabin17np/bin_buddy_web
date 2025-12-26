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
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push("/login");
      });
      console.log("register", values);
    };

    return (
      <form onSubmit={handleSubmit(submit)}>
        {/* Full Name */}
        <div>
          <label htmlFor="name">Full Name</label>
          <input id="name" type="text" {...register("name")} placeholder="Abharam Benjamin Devilliers" />
          {errors.name?.message && <p>{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" {...register("email")} placeholder="abd17@example.com" />
          {errors.email?.message && <p>{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" {...register("password")} placeholder="••••••" />
          {errors.password?.message && <p>{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input id="confirmPassword" type="password" {...register("confirmPassword")} placeholder="••••••" />
          {errors.confirmPassword?.message && <p>{errors.confirmPassword.message}</p>}
        </div>

        {/* Submit */}
        <button type="submit" disabled={isSubmitting || pending}>
          {isSubmitting || pending ? "Creating account..." : "Create account"}
        </button>

        {/* Footer */}
        <div>
          Already have an account? <Link href="/login">Log in</Link>
        </div>
      </form>
    );
  }
