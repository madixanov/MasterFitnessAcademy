import Cookies from "js-cookie";
import { apiClient } from "../apiClient";

/** ======= Интерфейсы ======= */
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
  quantity: number;
}

export interface UserTestResult {
  testId: string;
  userId: string;
  score: number; // количество правильных
  total: number; // всего вопросов
  date: string; // дата прохождения
  status: string; // например "COMPLETED"
  test: Test; // сам тест
}

export interface UserTestAnswerPayload {
  questionId: string;
  answerId: string;
}

export interface UserTestSubmitPayload {
  testId: string;
  userId: string;
  answers: UserTestAnswerPayload[];
}

/** ======= API Функции ======= */

/** Отправка результата пользователя (защищённый) */
export async function submitUserTestResult(
  payload: UserTestSubmitPayload
): Promise<UserTestResult> {
  const token = Cookies.get("accessToken");

  return apiClient<UserTestResult>("/user-test-result/submit", {
    method: "POST",
    headers: token
      ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      : { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/** Получить все тесты (защищённый) */
export const getTests = async (): Promise<Test[]> => {
  const token = Cookies.get("accessToken");

  return apiClient<Test[]>("/tests", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};

/** Получить тест по id (защищённый) */
export const getTestById = async (id: string): Promise<Test> => {
  const token = Cookies.get("accessToken");

  return apiClient<Test>(`/tests/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};

/** Получить все результаты пользователя (защищённый) */
export async function getUserTestResults(userId: string): Promise<UserTestResult[]> {
  const token = Cookies.get("accessToken");

  return apiClient<UserTestResult[]>(`/user-test-result/user/${userId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

/** Получить последний результат пользователя по конкретному тесту */
export async function getLastUserTestResult(
  userId: string,
  testId: string
): Promise<UserTestResult | null> {
  const results = await getUserTestResults(userId);
  const filtered = results.filter((r) => r.testId === testId);
  if (filtered.length === 0) return null;

  // Берем последнюю попытку по дате
  return filtered.reduce((latest, cur) =>
    new Date(cur.date) > new Date(latest.date) ? cur : latest
  );
}
