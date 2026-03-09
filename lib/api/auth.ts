/* eslint-disable @typescript-eslint/no-explicit-any */
// Note: Actual backend API calls
import axios from "./axios"; 
import { API } from "./endpoint";

export const register = async (registerData: any) => {
  try {
    const response = await axios.post(API.AUTH.REGISTER, registerData);
    return response.data; // response ko body (what backend returns)
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message || // backend error message
        error.message || // general axios error message
        "Registration Failed", // fallback message
    );
  }
};

export const login = async (registerData: any) => {
  try {
    const response = await axios.post(API.AUTH.LOGIN, registerData);
     console.log("Backend response:", JSON.stringify(response.data)); 
    return response.data; // response ko body (what backend returns)

  } catch (error: Error | any) {
    // info: if 4xx/5xx error, axios throws error
    throw new Error(
      error.response?.data?.message || // backend error message
        error.message || // general axios error message
        "Login Failed", // fallback message
    );
  }
};

export const updateUser = async (userData: any) => {
  try {
    const response = await axios.put(API.AUTH.UPDATE_PROFILE, userData, {
      headers: {
        "Content-Type": "multipart/form-data", // for file upload/multer
      },
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message || error.message || "Update user failed",
    );
  }
};

export const requestPasswordReset = async (email: string) => {
  try {
    const response = await axios.post(API.AUTH.REQUEST_PASSWORD_RESET, {
      email,
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Request password reset failed",
    );
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await axios.post(API.AUTH.RESET_PASSWORD(token), {
      newPassword: newPassword,
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message || error.message || "Reset password failed",
    );
  }
};