/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { register, login, requestPasswordReset, resetPassword } from "@/lib/api/auth";
import { setAuthToken, setUserData, clearAuthCookies } from "@/lib/cookie";
import { jwtDecode } from "jwt-decode";

export interface AuthResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  token?: string;
  role?: string;
}

// ─── Register ───────────────────────────────────────────────────────────────
// POST /api/auth/register
export const handleRegister = async (data: {
  username: string;
  email: string;
  password: string;
  name?: string;
  role?: "user" | "admin"; 
}): Promise<AuthResponse> => {
  try {
    const res = await register({
      username:data.username,
      email: data.email,
      password: data.password,
        role: data.role,
    }); 

    if (res.success) {
      return { success: true, data: res.data, message: "Registration successful" };
    }
    return { success: false, message: res.message || "Registration failed" };
  } catch (error: any) {
    return { success: false, message: error?.message || "Registration failed" };
  }
};

// ─── Login ──────────────────────────────────────────────────────────────────
// POST /api/auth/login → returns { success, token, data: { user } }
export const handleLogin = async (formData: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  try {
    const res = await login(formData);

    if (res.success) {
      const token = res.token;

      // Persist token + raw user data in cookies
      await setAuthToken(token);
      await setUserData(res.data);

      // Decode role from JWT (avoids extra /me round-trip)
      const decoded: any = jwtDecode(token);

      return {
        success: true,
        token,
        role: decoded.role ?? "user",
        data: {
          ...res.data,
          role: decoded.role ?? "user",
        },
        message: "Login successful",
      };
    }

    return { success: false, message: res.message || "Login failed" };
  } catch (error: any) {
    return { success: false, message: error?.message || "Login failed" };
  }
};

// ─── Request Password Reset ──────────────────────────────────────────────────
// POST /api/auth/request-password-reset  { email }
export const handleRequestPasswordReset = async (email: string): Promise<AuthResponse> => {
  try {
    const res = await requestPasswordReset(email);
    return res.success
      ? { success: true, message: "Password reset email sent successfully" }
      : { success: false, message: res.message || "Failed to send reset email" };
  } catch (error: any) {
    return { success: false, message: error?.message || "Request password reset failed" };
  }
};

// ─── Reset Password ──────────────────────────────────────────────────────────
// POST /api/auth/reset-password/:token  { newPassword }
export const handleResetPassword = async (
  token: string,
  newPassword: string
): Promise<AuthResponse> => {
  try {
    const res = await resetPassword(token, newPassword);
    return res.success
      ? { success: true, message: "Password has been reset successfully" }
      : { success: false, message: res.message || "Password reset failed" };
  } catch (error: any) {
    return { success: false, message: error?.message || "Reset password action failed" };
  }
};

// ─── Logout ──────────────────────────────────────────────────────────────────
export const handleLogout = async (): Promise<void> => {
  await clearAuthCookies();
};