/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath } from "next/cache";
import axios from "@/lib/api/axios";
import { API } from "@/lib/api/endpoint";
import type { Task, Report, User } from "@/app/utils/types";
import {
  createUser  as apiCreateUser,
  getAllUsers  as apiGetAllUsers,
  getUserById as apiGetUserById,
  updateUser  as apiUpdateUser,
  deleteUser  as apiDeleteUser,
} from "@/lib/api/admin/admin";

export interface AdminResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export const adminGetUsers = async (
  page = 1,
  size = 10,
  search = ""
): Promise<AdminResponse<{ users: any[]; pagination: any }>> => {
  try {
    const data = await apiGetAllUsers(page, size, search || undefined);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

export const adminGetUser = async (id: string): Promise<AdminResponse<any>> => {
  try {
    const data = await apiGetUserById(id);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

export const adminCreateUser = async (formData: FormData): Promise<AdminResponse<any>> => {
  try {
    const data = await apiCreateUser(formData);
    revalidatePath("/admin/users");
    return { success: true, data, message: "User Created" };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};
export const adminUpdateUser = async (
  userId: string,
  formData: FormData
): Promise<AdminResponse<any>> => {
  try {
    const data = await apiUpdateUser(userId, formData);
    revalidatePath("/admin/users");
    return { success: true, data, message: "User Updated" };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};
export const adminDeleteUser = async (userId: string): Promise<AdminResponse> => {
  try {
    await apiDeleteUser(userId);
    revalidatePath("/admin/users");
    return { success: true, message: "User Deleted" };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};


// GET /admin/reports
// Response: { success: true, data: Report[] }
// Reports have userId populated as { username, email }
export const adminGetReports = async (): Promise<AdminResponse<Report[]>> => {
  try {
    const res = await axios.get(API.ADMIN.REPORT.GET_ALL);
    return { success: true, data: res.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

// PATCH /admin/reports/:id  body: { status }
// Response: { success: true, data: Report }
// Pass any valid status string e.g. "resolved", "pending", "in-progress"
export const adminUpdateReport = async (
  reportId: string,
  status: string
): Promise<AdminResponse<Report>> => {
  try {
    const res = await axios.patch(API.ADMIN.REPORT.UPDATE(reportId), { status });
    revalidatePath("/admin/reports");
    return { success: res.data.success, data: res.data.data, message: res.data.message };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};


// PUT /auth/update-profile
// Multer field: "profilePicture"
// Controller gets userId from req.user?._id (JWT) — not from params
// Response: { success: true, message: "User updated successfully", data: User }
export const adminUpdateProfile = async (formData: FormData): Promise<AdminResponse<User>> => {
  try {
    const res = await axios.put(API.AUTH.UPDATE_PROFILE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (res.data.success) revalidatePath("/admin/settings");
    return { success: res.data.success, data: res.data.data, message: res.data.message };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

// ─── Add these to your admin-action.ts ───────────────────────────────────────

// GET /admin/messages  → { success, data: Message[] } all messages across all users
export const adminGetMessages = async (): Promise<AdminResponse<any[]>> => {
  try {
    const res = await axios.get(API.ADMIN.MESSAGE.GET_ALL);
    return { success: true, data: res.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

// POST /admin/messages  body: { userId, title, body }
export const adminSendMessage = async (payload: {
  userId: string;
  title: string;
  body: string;
}): Promise<AdminResponse<any>> => {
  try {
    const res = await axios.post(API.ADMIN.MESSAGE.CREATE, payload);
    revalidatePath("/admin/messages");
    return { success: res.data.success, data: res.data.data, message: res.data.message };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

// PATCH /admin/messages/:id/reply  body: { reply }
export const adminReplyMessage = async (payload: {
  messageId: string;
  reply: string;
}): Promise<AdminResponse<any>> => {
  try {
    const res = await axios.patch(API.ADMIN.MESSAGE.REPLY(payload.messageId), { reply: payload.reply });
    revalidatePath("/admin/messages");
    return { success: res.data.success, data: res.data.data, message: res.data.message };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

// GET /admin/trash-logs → { success, data: TrashLog[] } (all users)
export const adminGetAllTrashLogs = async (): Promise<AdminResponse<any[]>> => {
  try {
    const res = await axios.get(API.ADMIN.TRASH_LOG.GET_ALL);
    return { success: true, data: res.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

// GET /admin/trash-logs/stats → { success, data: { totalLogs, totalWeight, byCategory, topUsers } }
export const adminGetTrashStats = async (): Promise<AdminResponse<any>> => {
  try {
    const res = await axios.get(API.ADMIN.TRASH_LOG.STATS);
    return { success: true, data: res.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

// DELETE /admin/trash-logs/:id
export const adminDeleteTrashLog = async (logId: string): Promise<AdminResponse> => {
  try {
    const res = await axios.delete(API.ADMIN.TRASH_LOG.DELETE(logId));
    revalidatePath("/admin/trash-logs");
    return { success: res.data.success, message: res.data.message };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};
