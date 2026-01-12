import Cookies from "js-cookie";
import { apiClient } from "../apiClient";

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
  accessToken: string;
  refreshToken: string;
}

export async function signup(data: SignupPayload, rememberMe: boolean = false): Promise<SignupResponse> {
  const signupRes: SignupResponse = await apiClient<SignupResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return signupRes;
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
  accessToken: string;
  refreshToken: string;
}

export async function login(data: LoginPayload, rememberMe: boolean = false): Promise<LoginResponse> {
  const loginRes: LoginResponse = await apiClient<LoginResponse>("/auth/signin", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const cookieOptions = { expires: rememberMe ? 30 : undefined, path: "/" };
  Cookies.set("token", loginRes.accessToken, cookieOptions);
  Cookies.set("refreshToken", loginRes.refreshToken, cookieOptions);

  return loginRes;
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
  const token = Cookies.get("token");

  if (token) {
    try {
      await apiClient("/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.warn("Ошибка при logout на сервере:", err);
    }
  }

  Cookies.remove("token");
  Cookies.remove("refreshToken");
}
