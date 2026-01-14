"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getProfile } from "@/services/auth/user.api";
import {
  getTests,
  getUserTestResults,
  Test,
  UserTestResult,
} from "@/services/test/test.api";

export default function TestsPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [tests, setTests] = useState<Test[]>([]);
  const [results, setResults] = useState<UserTestResult[]>([]);
  const [loading, setLoading] = useState(true);

  /* ======== Загрузка профиля ======== */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile(); // 🔹 token берется автоматически через HTTP-only cookie
        setUserId(data.id);
        setUserName(`${data.name} ${data.surname || ""}`.trim());
      } catch (err) {
        console.error(err);
        router.push("/auth"); // не авторизован
      }
    };

    fetchProfile();
  }, [router]);

  /* ======== Загрузка тестов и результатов ======== */
  useEffect(() => {
    if (!userId) return;

    setLoading(true);

    const fetchData = async () => {
      try {
        const [allTests, userResults] = await Promise.all([
          getTests(),
          getUserTestResults(userId),
        ]);
        setTests(allTests);
        setResults(userResults);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  /* ======== Загрузка ======== */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="flex space-x-2 mb-6">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-0"></div>
          <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce delay-150"></div>
          <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce delay-300"></div>
        </div>
        <p className="text-xl font-semibold animate-pulse">Загрузка тестов...</p>
      </div>
    );
  }

  /* ======== Список тестов ======== */
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Все тесты</h1>
        <button
          onClick={() => router.push("/profile")}
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition font-medium"
        >
          Назад в профиль
        </button>
      </div>

      <p className="mb-4 text-lg">Пользователь: {userName}</p>

      <div className="grid gap-4">
        {tests.map((test) => {
          const userTestAttempts = results
            .filter((r) => r.testId === test.id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          const latestResult = userTestAttempts[0];

          return (
            <div
              key={test.id}
              className="p-4 bg-gray-800 rounded-xl shadow flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold">{test.name}</h2>
                <p className="text-sm text-gray-300">
                  {test.quantity} вопросов • {test.duration} минут
                </p>

                {latestResult ? (
                  <p className="text-sm mt-1 text-green-400">
                    Последний результат: {latestResult.score} / {latestResult.total} (
                    {new Date(latestResult.date).toLocaleString()})
                  </p>
                ) : (
                  <p className="text-sm mt-1 text-yellow-300">Тест доступен для сдачи</p>
                )}
              </div>

              <button
                onClick={() => router.push(`/tests/start/${test.id}`)}
                className={`px-4 py-2 rounded font-medium transition ${
                  latestResult
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {latestResult ? "Пересдать / Смотреть" : "Начать тест"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
