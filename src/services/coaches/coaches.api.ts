import { apiClient } from "../apiClient";

export interface Trainer {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: "TEACHER" | string;
  individualId: string | null;
  img: string | null;
  experience: number;
  status: "ACTIVE" | "INACTIVE" | string;
  description: string;
  createdAt: string;
}

/** Получить всех тренеров */
export const getTrainers = async (): Promise<Trainer[]> => {
  return apiClient<Trainer[]>("/trainers");
};

/** Получить тренера по id */
export const getTrainerById = async (id: string): Promise<Trainer> => {
  return apiClient<Trainer>(`/trainers/${id}`);
};
