import { apiClient } from "../apiClient";
import type { Trainer } from "../coaches/coaches.api";

export interface Course {
  id: string;
  name: string;
  price: number;
  text: string | null;
  date: string;
  description: string;
  image: string[];
  level: number;
  status: "ACTIVE" | "INACTIVE" | string;
  trainerId: string;
  Course_duration: string;
  Number_of_lessons: string;
  Training_format: "OFFLINE" | "ONLINE" | string;
  Course_Benefits_Sheet: string;
  createdAt: string;
  userId: string | null;

  /** relations */
  trainer?: Trainer;
  modules?: any[];
}

/** Получить все курсы */
export const getCourses = async (): Promise<Course[]> => {
  return apiClient<Course[]>("/course");
};

/** Получить курс по id */
export const getCourseById = async (id: string): Promise<Course> => {
  return apiClient<Course>(`/course/${id}`);
};
