import Cookies from "js-cookie";
import { apiClient } from "../apiClient";

export type SubmissionStatus = "PENDING" | "CHECKED" | "REJECTED";

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

export interface HomeworkSubmissionPayload {
  homeworkId: string;
  text: string;
  files: string[];
}

// ------------------------------------
// Homework entity
// ------------------------------------
export interface Homework extends HomeworkPayload {
  id: string;
  createdAt: string;
}

/**
 * Получить домашки по уроку
 */
export async function getHomeworkByLesson(lessonId: string): Promise<Homework[]> {
  try {
    const token = Cookies.get("accessToken");
    return await apiClient<Homework[]>(`/homework-tasks/lesson/${lessonId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
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
    const token = Cookies.get("accessToken");
    return await apiClient<HomeworkSubmission[]>("/homework-submissions/my", {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  } catch (err: any) {
    console.error("Ошибка при получении моих submissions:", err.message);
    return [];
  }
}

/**
 * Отправка домашнего задания
 */
export async function submitHomework(payload: HomeworkSubmissionPayload): Promise<HomeworkSubmission | null> {
  try {
    const token = Cookies.get("accessToken");
    return await apiClient<HomeworkSubmission>("/homework-submissions/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
  } catch (err: any) {
    console.error("Ошибка при отправке домашки:", err.message);
    return null;
  }
}
