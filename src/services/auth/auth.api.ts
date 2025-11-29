import { apiClient } from "../apiClient";

export interface SignupPayload {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface SignupResponse {
  token: string;
}

export function signup(data: SignupPayload): Promise<SignupResponse> {
  return apiClient<SignupResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export function login(data: LoginPayload): Promise<LoginResponse> {
  return apiClient<LoginResponse>("/auth/signin", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export interface VerifyOtpPayload {
  otp: string;
  token: string;
}

export async function verifyOtp({ otp, token }: VerifyOtpPayload): Promise<{ success: boolean }> {
  return apiClient<{ success: boolean }>("/auth/verify-otp", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ otp })
  });
}

export async function resendOtp(token: string): Promise<{ success: boolean }> {
  return apiClient<{ success: boolean }>("/auth/send-otp", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}