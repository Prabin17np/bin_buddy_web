import axios from "axios";
import { API } from "./endpoint";

// REGISTER
export const register = async (data: any) => {
  const response = await axios.post(API.AUTH.REGISTER, data);
  return response.data;
};

// LOGIN
export const login = async (data: any) => {
  const response = await axios.post(API.AUTH.LOGIN, data);
  return response.data;
};

// UPDATE USER (with file upload)
export const updateUser = async (data: any) => {
  const response = await axios.put(API.AUTH.UPDATE_PROFILE, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// REQUEST PASSWORD RESET
export const requestPasswordReset = async (email: string) => {
  const response = await axios.post(API.AUTH.REQUEST_PASSWORD_RESET, { email });
  return response.data;
};

// RESET PASSWORD
export const resetPassword = async (token: string, newPassword: string) => {
  const response = await axios.post(`${API.AUTH.RESET_PASSWORD}/${token}`, { newPassword });
  return response.data;
};
