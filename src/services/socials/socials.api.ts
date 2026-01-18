import { apiClient } from "../apiClient";

export interface SocialNetwork {
  id: string;
  name: string;
  url: string;
  createdAt: string;
}

export const getSocialNetworks = async (): Promise<SocialNetwork[]> => {
  return apiClient<SocialNetwork[]>("/social-networks", {
    method: "GET",
  });
};
