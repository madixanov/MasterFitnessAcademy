import { apiClient } from "../apiClient";

export interface Photo {
  id: string;
  imageUrl: string;
  createdAt: string;
}

export const getPhotos = async (): Promise<Photo[]> => {
  return apiClient<Photo[]>("/photos", {
    method: "GET",
  });
};
