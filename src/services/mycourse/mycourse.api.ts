import { apiClient } from "@/services/apiClient";
import Cookies from "js-cookie";

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

export async function getMyCourses(): Promise<MyCourse[]> {
  const token = Cookies.get("token");

  return await apiClient<MyCourse[]>("/mycourse/my", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
