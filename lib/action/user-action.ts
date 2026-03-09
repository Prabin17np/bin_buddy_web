/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath } from "next/cache";
import axios from "@/lib/api/axios";
import { API } from "@/lib/api/endpoint";
import type { Report, User } from "@/app/utils/types";

export interface UserResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface RewardWithEarned {
  _id: string;
  name: string;
  description: string;
  points: number;
  earned: boolean;
  [key: string]: any;
}

export interface RewardsData {
  user: User;
  rewards: RewardWithEarned[];
}

// GET /user/me → { success, data: { user } }
export const getCurrentUser = async (): Promise<UserResponse<User>> => {
  try {
    const res = await axios.get(API.USER.CURRENT);
    return { success: true, data: res.data.data?.user ?? res.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

// GET /user/reports → { success, data: Report[] }
export const getUserReports = async (): Promise<UserResponse<Report[]>> => {
  try {
    const res = await axios.get(API.USER.REPORTS);
    return { success: true, data: res.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

// POST /user/reports  multer: "photo"  body: { location, type, description, severity? }
export const submitReport = async (formData: FormData): Promise<UserResponse<Report>> => {
  try {
    const res = await axios.post(API.USER.REPORTS, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (res.data.success) revalidatePath("/user/reports");
    return { success: res.data.success, data: res.data.data, message: res.data.message };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

// Only allowed while status is "pending" or "open"
export const updateReport = async (reportId: string, formData: FormData): Promise<UserResponse<Report>> => {
  try {
    const res = await axios.patch(`${API.USER.REPORTS}/${reportId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (res.data.success) revalidatePath("/user/reports");
    return { success: res.data.success, data: res.data.data, message: res.data.message };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

// DELETE /user/reports/:id
// Only allowed while status is "pending" or "open"
export const deleteReport = async (reportId: string): Promise<UserResponse> => {
  try {
    const res = await axios.delete(`${API.USER.REPORTS}/${reportId}`);
    if (res.data.success) revalidatePath("/user/reports");
    return { success: res.data.success, message: res.data.message };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};
// GET /user/messages → { success, data: Message[] }
export const getUserMessages = async (): Promise<UserResponse<any[]>> => {
  try {
    const res = await axios.get(API.USER.MESSAGES);
    return { success: true, data: res.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

// POST /user/messages/reply  { messageId, reply }
export const replyMessage = async (payload: {
  messageId: string;
  reply: string;
}): Promise<UserResponse> => {
  try {
    const res = await axios.post(API.USER.REPLY, payload);
    revalidatePath("/user/messages");
    return { success: res.data.success, data: res.data.data, message: res.data.message };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};
// POST /user/messages  { title, body }
export const sendMessage = async (payload: {
  title: string;
  body: string;
}): Promise<UserResponse> => {
  try {
    const res = await axios.post(API.USER.MESSAGES, payload);
    revalidatePath("/user/messages");
    return { success: res.data.success, data: res.data.data, message: res.data.message };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};
// PUT /auth/update-profile  multer: "profilePicture"
export const handleUpdateUser = async (formData: FormData): Promise<UserResponse<User>> => {
  try {
    const res = await axios.put(API.AUTH.UPDATE_PROFILE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (res.data.success) revalidatePath("/user/settings");
    return { success: res.data.success, data: res.data.data, message: res.data.message };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

// PUT /auth/change-password  { currentPassword, newPassword }
export const handleChangePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<UserResponse> => {
  try {
    const res = await axios.put(API.AUTH.CHANGE_PASSWORD, data);
    return { success: res.data.success, message: res.data.message };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

// POST /auth/upload-image  multer: "profilePicture"
export const uploadProfilePicture = async (file: File): Promise<UserResponse<string>> => {
  try {
    const formData = new FormData();
    formData.append("profilePicture", file);
    const res = await axios.post(API.AUTH.UPLOAD_IMAGE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { success: res.data.success, data: res.data.data, message: res.data.message };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

// GET /user/trash-logs → { success, data: TrashLog[] }
export const getMyTrashLogs = async (): Promise<UserResponse<any[]>> => {
  try {
    const res = await axios.get(API.USER.TRASH_LOG.GET_ALL);
    return { success: true, data: res.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

// GET /user/trash-logs/stats → { success, data: { totalLogs, totalWeight, byCategory, streak } }
export const getMyTrashStats = async (): Promise<UserResponse<any>> => {
  try {
    const res = await axios.get(API.USER.TRASH_LOG.STATS);
    return { success: true, data: res.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

// POST /user/trash-logs  body: { category, weight?, notes? }
export const submitTrashLog = async (payload: {
  category: string;
  weightKg  ?: number;
  notes?: string;
}): Promise<UserResponse<any>> => {
  try {
    const res = await axios.post(API.USER.TRASH_LOG.CREATE, payload);
    revalidatePath("/user/trash-log");
    revalidatePath("/user/recycling-tracker");
    return { success: res.data.success, data: res.data.data, message: res.data.message };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};
  
// DELETE /user/trash-logs/:id
export const deleteTrashLog = async (logId: string): Promise<UserResponse> => {
  try {
    const res = await axios.delete(API.USER.TRASH_LOG.DELETE(logId));
    revalidatePath("/user/trash-log");
    revalidatePath("/user/recycling-tracker");
    return { success: res.data.success, message: res.data.message };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

// GET /user/tips?category=plastic → { success, data: Tip[] }
export const getTips = async (category?: string): Promise<UserResponse<any[]>> => {
  try {
    const params = category ? { category } : {};
    const res = await axios.get(API.USER.TIP.GET_ALL, { params });
    return { success: true, data: res.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};