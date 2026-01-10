import { apiClient } from "../apiClient";
import Cookies from "js-cookie";

export type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface HomeworkSubmission {
  id: string;
  homeworkId: string;
  userId: string;
  text: string;
  files: string[];
  status: SubmissionStatus;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    img: string;
    role: string;
    status: string;
    createdAt: string;
  };
}

export interface HomeworkPayload {
  lessonId: string;
  title: string;
  description: string;
  files: string[];
  deadline: string; // ISO
}

// ------------------------------------
// Homework entity
// ------------------------------------
export interface Homework extends HomeworkPayload {
  id: string;
  createdAt: string;
}

export async function getHomeworkByLesson(
  lessonId: string
): Promise<Homework[]> {
  try {
    return await apiClient<Homework[]>(`/homework-tasks/lesson/${lessonId}`);
  } catch (err: any) {
    console.error("Ошибка при получении homework:", err.message);
    return [];
  }
}

/**
 * Получить все мои отправки домашних заданий
 */
export async function getMyHomeworkSubmissions(): Promise<HomeworkSubmission[]> {
  try {
    // Берём токен из cookies (или другого хранилища)
    const token = Cookies.get("token") || "";

    return await apiClient<HomeworkSubmission[]>("/homework-submissions/my", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err: any) {
    console.error("Ошибка при получении моих submissions:", err.message);
    return [];
  }
}
