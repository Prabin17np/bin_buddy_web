import { z } from "zod";

const emailField = z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email");

export const loginSchema = z.object({
    email: emailField,
    password: z.string().min(6, { message: "Minimum 6 characters" }),
});
export type LoginData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    username: z.string().min(2, { message: "Enter your name" }),
    email: emailField,
    password: z.string().min(6, { message: "Minimum 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Minimum 6 characters" }),
    role: z.string().min(2, { message: "Input Role" }).optional(),
}).refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
});
export type RegisterData = z.infer<typeof registerSchema>;

export const forgetPasswordSchema = z.object({
    email: emailField,
});
export type ForgetPasswordData = z.infer<typeof forgetPasswordSchema>;

export const resetPasswordSchema = z.object({
    newPassword: z.string().min(6, { message: "Minimum 6 characters" }),
    confirmNewPassword: z.string().min(6, { message: "Minimum 6 characters" }),
}).refine((v) => v.newPassword === v.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match",
});
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;