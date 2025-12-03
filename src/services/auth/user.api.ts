import { apiClient } from "@/services/apiClient";

export const getProfile = async (accessToken: string): Promise<any> => {
  return apiClient<any>("/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};