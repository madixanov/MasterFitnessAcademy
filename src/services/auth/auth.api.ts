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
  const signupRes: SignupResponse = await apiClient<SignupResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const token = signupRes.token;
  await apiClient("/auth/send-otp", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        to: data.email || data.phoneNumber,
        subject: "Verification Code",
      }),
  });

  return signupRes;
}


export async function sendOtp(contact: string): Promise<{ success: boolean }> {
  if (!contact) throw new Error("Email или телефон не указан");

  return apiClient<{ success: boolean }>("/auth/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: contact,
      subject: "Verification Code",
    }),
  });
}

export interface VerifyOtpPayload {
  otpCode: string;
  contact: string;
  type: string; 
}

export interface VerifyOtpResponse {
  message: string,
}

export async function verifyOtp(data: VerifyOtpPayload): Promise<VerifyOtpResponse> {
  return apiClient<VerifyOtpResponse>("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
}

export async function login(data: LoginPayload): Promise<LoginResponse> {
  return apiClient<LoginResponse>("/auth/signin", {
    method: "POST",
    body: JSON.stringify(data),
  });
}