import { apiClient } from "../apiClient";

export interface TestAnswer {
  id: string;
  text: string;
  isRight: boolean;
  questionId: string;
}

export interface TestQuestion {
  id: string;
  questionNumber: number;
  question: string;
  testId: string;
  img: string[];
  answers: TestAnswer[];
}

export interface Test {
  id: string;
  name: string;
  courseId: string;
  duration: number; // минуты
  startDate: string;
  status: "DRAFT" | "PUBLISHED" | string;
  createdAt: string;
  questions: TestQuestion[];
}

export interface UserTestResult {
  testId: string;
  userId: string;
  score: number; // количество правильных
  total: number; // всего вопросов
}

export interface UserTestSubmit {
  testId: string;
  userId: string;
}

/** Получить все тесты */
export const getTests = async (): Promise<Test[]> => {
  return apiClient<Test[]>("/tests");
};

/** Получить тест по id */
export const getTestById = async (id: string): Promise<Test> => {
  return apiClient<Test>(`/tests/${id}`);
};

export async function submitUserTestResult(testId: string, userId: string): Promise<UserTestResult> {
  return apiClient<UserTestResult>("/user-test-result/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ testId, userId }),
  });
}

/** Получить результат пользователя по id */
export async function getUserTestResult(userId: string): Promise<UserTestResult> {
  return apiClient<UserTestResult>(`/user-test-result/user/${userId}`);
}