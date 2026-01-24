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
        const data = await getProfile();
        setUserId(data.id);
        setUserName(`${data.name} ${data.surname || ""}`.trim());
      } catch {
        router.push("/auth");
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-xl animate-pulse">Загрузка тестов...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Все тесты</h1>
        <button
          onClick={() => router.push("/profile")}
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
        >
          Назад в профиль
        </button>
      </div>

      <p className="mb-4 text-lg">Пользователь: {userName}</p>

      <div className="grid gap-4">
        {tests.map((test) => {
          // Находим результаты пользователя для этого теста
          const attempts = results
            .filter((r) => r.testId === test.id)
            .sort(
              (a, b) =>
                new Date(b.date).getTime() -
                new Date(a.date).getTime()
            );

          const latestResult = attempts[0];
          const hasResult = Boolean(latestResult);

          // 🔑 Статус теста берём только из Test
          const isActive = test.status === "ACTIVE";

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

                {hasResult ? (
                  <p className="text-sm mt-1 text-green-400">
                    Последний результат:{" "}
                    {Math.round(latestResult.score)} / {latestResult.total} (
                    {new Date(latestResult.date).toLocaleString()})
                  </p>
                ) : (
                  <p className="text-sm mt-1 text-yellow-300">
                    Нет попыток
                  </p>
                )}

                {!isActive && (
                  <p className="text-sm mt-1 text-red-400">Тест неактивен</p>
                )}
              </div>

              {/* ======== КНОПКА ======== */}
              {isActive && (
                <button
                  onClick={() =>
                    router.push(`/tests/start/${test.id}`)
                  }
                  className={`px-4 py-2 rounded font-medium transition ${
                    hasResult
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {hasResult ? "Пересдать / Смотреть" : "Начать тест"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
