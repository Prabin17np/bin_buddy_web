/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "../axios";
import { API } from "../endpoint";

// ─── Types ─────────────────────────────────────────────
export interface Pagination {
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
  [key: string]: any;
}

export interface GetAllUsersResponse {
  users: User[];
  pagination: Pagination;
}

// ─── Admin API Functions ──────────────────────────────

export const createUser = async (userData: any): Promise<User> => {
  const res = await axios.post(API.ADMIN.USER.GET_ALL, userData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getAllUsers = async (
  page: number,
  size: number,
  search?: string
): Promise<GetAllUsersResponse> => {
  const res = await axios.get(API.ADMIN.USER.GET_ALL, {
    params: { page, size, search },
  });
  return res.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const res = await axios.get(API.ADMIN.USER.GET_ONE(id));
  return res.data;
};

export const updateUser = async (
  id: string,
  updateData: any
): Promise<User> => {
  const res = await axios.put(API.ADMIN.USER.UPDATE(id), updateData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteUser = async (id: string): Promise<User> => {
  const res = await axios.delete(API.ADMIN.USER.DELETE(id));
  return res.data;
};
