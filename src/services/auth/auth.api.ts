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

    // 2. Сразу отправляем OTP
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
  otpCode: string;
  contact: string; // email или телефон
  type: "email" | "sms";
  token: string;
}

export async function verifyOtp({ otpCode, contact, type, token }: VerifyOtpPayload): Promise<{ success: boolean }> {
  return apiClient<{ success: boolean }>("/auth/verify-otp", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ otpCode, contact, type }),
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