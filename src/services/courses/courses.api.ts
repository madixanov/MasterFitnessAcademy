import { apiClient } from "../apiClient";
import type { Trainer } from "../coaches/coaches.api";
import type { Test } from "../test/test.api";
import type { Homework } from "../homework/homework.api";

export interface CourseLesson {
  id: string;
  name: string;
  title: string;
  desc: string;
  video: string;
  img: string[];
  duration: number;
  startsAt: string;
  subject?: string;
  task?: string;
  grade?: string;
  homeworks?: Homework[];
}

export interface CourseModule {
  id: string;
  name: string;
  desc: string;
  lessons?: CourseLesson[];
}

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
  modules?: CourseModule[];
  tests?: Test[]
}

/** Получить все курсы */
export const getCourses = async (): Promise<Course[]> => {
  return apiClient<Course[]>("/course");
};

/** Получить курс по id */
export const getCourseById = async (id: string): Promise<Course> => {
  return apiClient<Course>(`/course/${id}`);
};
