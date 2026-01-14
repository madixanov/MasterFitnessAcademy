import Cookies from "js-cookie";
import { apiClient } from "@/services/apiClient";

export interface MyCourse {
  id: string;
  userId: string;
  courseId: string;
  status: "ACTIVE" | "INACTIVE" | "COMPLETED";
  createdAt: string;

  name: string;
  description: string;
  price: number;
  image: string[];
  Course_Benefits_Sheet: string;
  Course_duration: string;
  Number_of_lessons: string;
  Training_format: "OFFLINE" | "ONLINE";
  level: number;
  trainerId: string;
  text: string | null;
}

/**
 * Получение моих курсов
 */
export async function getMyCourses(): Promise<MyCourse[]> {
  const token = Cookies.get("accessToken");

  try {
    return await apiClient<MyCourse[]>("/mycourse/my", {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  } catch (err: any) {
    console.error("Ошибка при получении моих курсов:", err.message);
    return [];
  }
}
