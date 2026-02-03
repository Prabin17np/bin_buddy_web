/* eslint-disable @typescript-eslint/no-explicit-any */
// note: server side processing

"use server";

import { revalidatePath } from "next/cache";
import { register, login, updateUser } from "../api/auth";
import { setAuthToken, setUserData } from "../cookie";

export const handleRegister = async (formData: any) => {
  try {
    // info: how data sent from component to backend api
    const res = await register(formData);
    // component return logic
    if(res.success) {
      return {
        success: true,
        data: res.data,
        message: "Registration successful"
      };
    }
    return {success: false, message: res.message || "Registration failed"};
  } catch (error: Error | any ) {
    // console.log("Auth action ko error bitra aayo");

    return {success: false, message: error.message || "Registration failed"};
  }
}

export const handleLogin = async (formData: any) => {
  try {
    // info: how data sent from component to backend api
    const res = await login(formData);
    // component return logic
    if(res.success) {
      const token = res.token;
      await setAuthToken(token);
      await setUserData(res.data);
      return {
        success: true,
        data: res.data,
        message: "Login successful"
      };
    }
    return {success: false, message: res.message || "Login failed"};
  } catch (error: Error | any ) {
    return {success: false, message: error.message || "Login failed"};
  }
}

export const handleUpdateUser = async (data: FormData) => {
  try {
    const response = await updateUser(data);
    if (response.success) {
      revalidatePath("/user/profile");
      return {
        success: true,
        message: "Update successful",
        data: response.data,
      };
    }
    return {
      success: false,
      message: response.message || "Update failed",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Update action failed",
    };
  }
};