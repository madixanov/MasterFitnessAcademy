import { apiClient } from "../apiClient";

// --- временное хранилище данных перед подтверждением OTP ---
let tempUser: {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
} | null = null;

export interface SignupPayload {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface SignupResponse {
  token: string;
}

// Сохраняем данные пользователя временно и отправляем OTP
export async function signupStep1(data: SignupPayload): Promise<{ success: boolean }> {
  tempUser = data;

  await apiClient("/auth/send-otp", {
    method: "POST",
    body: JSON.stringify({
      to: data.email || data.phoneNumber,
      subject: "Verification Code",
    }),
  });

  return { success: true };
}

// После подтверждения OTP создаём аккаунт
export async function signupStep2(otpCode: string, contact: string, type: "email" | "sms"): Promise<SignupResponse> {
  if (!tempUser) throw new Error("Нет данных пользователя для регистрации");

  // Отправляем проверку OTP
  const otpRes = await apiClient<{ success: boolean }>("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ otpCode, contact, type }),
  });

  if (!otpRes.success) throw new Error("OTP не подтверждён");

  // Создаём аккаунт уже на сервере
  const signupRes: SignupResponse = await apiClient<SignupResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(tempUser),
  });

  // Очищаем временное хранилище
  tempUser = null;

  return signupRes;
}

// --- Вход в систему ---
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

// --- Повторная отправка OTP ---
export async function resendOtp(contact: string): Promise<{ success: boolean }> {
  return apiClient<{ success: boolean }>("/auth/send-otp", {
    method: "POST",
    body: JSON.stringify({
      to: contact,
      subject: "Verification Code",
    }),
  });
}
