/* eslint-disable @typescript-eslint/no-explicit-any */
// Note: Actual backend API calls
import axios from "./axios"; // info: axios instance with base URL
import { API } from "./endpoint";

export const register = async(registerData: any) => {
  try {
    const response = await axios.post(API.AUTH.REGISTER, registerData);
    return response.data; // response ko body (what backend returns)
  } catch (error: Error | any) {
    // info: if 4xx/5xx error, axios throws error
    throw new Error(
      error.response?.data?.message // backend error message
      || error.message // general axios error message
      || "Registration Failed" // fallback message
    )
  }
}

export const login = async(registerData: any) => {
  try {
    const response = await axios.post(API.AUTH.LOGIN, registerData);
    return response.data; // response ko body (what backend returns)
  } catch (error: Error | any) {
    // info: if 4xx/5xx error, axios throws error
    throw new Error(
      error.response?.data?.message // backend error message
      || error.message // general axios error message
      || "Login Failed" // fallback message
    )
  }
}

export const updateUser = async (userData: any) => {
  try {
    const response = await axios.put(API.AUTH.UPDATEPROFILE, userData, {
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
