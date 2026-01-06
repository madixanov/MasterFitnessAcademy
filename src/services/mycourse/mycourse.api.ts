import { apiClient } from "@/services/apiClient";
import Cookies from "js-cookie";

export interface MyCourse {
  id: string; // id связи user-course
  courseId: string;
  moduleId: string;
  userId: string;
  status: "ACTIVE" | "INACTIVE"; // статус пользователя в курсе
  createdAt: string;
  course: {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string[];
    Course_Benefits_Sheet: string;
    Course_duration: string;
    Number_of_lessons: string;
    Training_format: string;
    level: number;
    trainerId: string;
    text: string | null;
    status: "ACTIVE" | "INACTIVE"; // сам курс
  };
}

export async function getMyCourses(): Promise<MyCourse[]> {
  const token = Cookies.get("token");

  return await apiClient<MyCourse[]>("/mycourse/my", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
