import { apiClient } from "../apiClient";
import Cookies from "js-cookie";

// ------------------------
// SIGNUP
// ------------------------
export interface SignupPayload {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface SignupResponse {
  message: string;
}

export async function signup(data: SignupPayload): Promise<SignupResponse> {
  return apiClient<SignupResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ------------------------
// SEND OTP
// ------------------------
export interface sendOtpPayload {
  to: string;
  subject: string;
}

export async function sendOtp(data: sendOtpPayload): Promise<{ success: boolean }> {
  if (!data) throw new Error("Email или телефон не указан");

  return apiClient<{ success: boolean }>("/auth/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function sendResetOtp(data: sendOtpPayload): Promise<{ success: boolean }> {
  if (!data) throw new Error("Email или телефон не указан");

  return apiClient<{ success: boolean }>("/auth/send-otp-reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// ------------------------
// VERIFY OTP
// ------------------------
export interface VerifyOtpPayload {
  otpCode: string;
  contact: string;
  type: string;
}

export interface VerifyOtpResponse {
  message: string;
}

export async function verifyOtp(data: VerifyOtpPayload): Promise<VerifyOtpResponse> {
  return apiClient<VerifyOtpResponse>("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export interface VerifyResetOtpPayload {
  contact: string;
  otpCode: string;
}

export interface VerifyResetOtpResponse {
  message: string;
}

export async function verifyResetOtp(data: VerifyResetOtpPayload): Promise<VerifyResetOtpResponse> {
  return apiClient<VerifyResetOtpResponse>("/auth/verify-otp-reset", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ------------------------
// LOGIN
// ------------------------
export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
}

export async function login(data: LoginPayload): Promise<LoginResponse> {
  const res = await apiClient<LoginResponse & { accessToken: string }>("/auth/signin", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (res.accessToken) {
    // сохраняем токен в cookie на 7 дней
    Cookies.set("accessToken", res.accessToken, { expires: 1, secure: true, sameSite: "strict" });
  }

  return res;
}

// ------------------------
// NEW PASSWORD
// ------------------------
export interface NewPasswordPayload {
  email: string;
  newPassword: string;
}

export interface NewPasswordResponse {
  message: string;
}

export async function newPassword(data: NewPasswordPayload): Promise<NewPasswordResponse> {
  return apiClient<NewPasswordResponse>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ------------------------
// LOGOUT
// ------------------------
export async function logout() {
  // 1. Извлекаем токен из кук
  const token = Cookies.get("accessToken");

  try {
    await apiClient("/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 2. Добавляем токен в заголовки, если он существует
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch (err) {
    console.warn("Ошибка при logout на сервере:", err);
  }
}
