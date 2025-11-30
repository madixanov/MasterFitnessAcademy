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

export async function signup(data: SignupPayload): Promise<SignupResponse> {
  const res = await apiClient<SignupResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return res;
}


export async function sendOtp(contact: string): Promise<{ success: boolean }> {
  return apiClient<{ success: boolean }>("/auth/send-otp", {
    method: "POST",
    body: JSON.stringify({
      to: contact,
      subject: "Verification Code",
    }),
  });
}

export async function verifyOtp(code: string, contact: string, type: "email" | "sms") {
  return apiClient<{ success: boolean }>("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ otpCode: code, contact, type }),
  });
}

export async function resendOtp(contact: string): Promise<{ success: boolean }> {
  return apiClient<{ success: boolean }>("/auth/send-otp", {
    method: "POST",
    body: JSON.stringify({
      to: contact,
      subject: "Verification Code",
    }),
  });
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export async function login(data: LoginPayload): Promise<LoginResponse> {
  return apiClient<LoginResponse>("/auth/signin", {
    method: "POST",
    body: JSON.stringify(data),
  });
}