import { apiClient } from "../apiClient";

export interface Branch {
  id: string;
  city: string;
  phone: string;
  email: string;
  address: string;
  mapLink: string;
  createdAt?: string;
}

export const getBranches = async (): Promise<Branch[]> => {
  return apiClient<Branch[]>("/branches");
};
