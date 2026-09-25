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
      } catch (err) {
        console.error(err);
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
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
        <div className="mb-6 flex space-x-2">
          <div className="h-4 w-4 animate-bounce rounded-full bg-blue-500" />
          <div className="h-4 w-4 animate-bounce rounded-full bg-green-500 delay-150" />
          <div className="h-4 w-4 animate-bounce rounded-full bg-yellow-400 delay-300" />
        </div>

        <p className="animate-pulse text-xl font-semibold">
          Загрузка тестов...
        </p>
      </div>
    );
  }

  /* ======== Список тестов ======== */
  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Все тесты</h1>

        <button
          onClick={() => router.push("/profile")}
          className="rounded bg-gray-700 px-4 py-2 font-medium transition hover:bg-gray-600"
        >
          Назад в профиль
        </button>
      </div>

      <p className="mb-4 text-lg">Пользователь: {userName}</p>

      <div className="grid gap-4">
        {tests
          // Черновики вообще не показываем
          .filter((test) => test.status !== "DRAFT")
          .map((test) => {
            const userTestAttempts = results
              .filter((r) => r.testId === test.id)
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() -
                  new Date(a.date).getTime()
              );

            const latestResult = userTestAttempts[0];

            const isCompleted = test.status === "FINISHED";

            return (
              <div
                key={test.id}
                className="flex items-center justify-between rounded-xl bg-gray-800 p-4 shadow"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold">
                      {test.name}
                    </h2>

                    {isCompleted && (
                      <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-medium text-green-400">
                        Закончен
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-300">
                    {test.quantity} вопросов • {test.duration} минут
                  </p>

                  {latestResult ? (
                    <p className="mt-1 text-sm text-green-400">
                      Последний результат:{" "}
                      {latestResult.score.toFixed(1)} /{" "}
                      {latestResult.total} (
                      {new Date(latestResult.date).toLocaleString()})
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-yellow-300">
                      Тест доступен для сдачи
                    </p>
                  )}
                </div>

                <button
                  onClick={() =>
                    router.push(`/tests/start/${test.id}`)
                  }
                  className={`rounded px-4 py-2 font-medium transition ${
                    latestResult
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {latestResult
                    ? "Пересдать / Смотреть"
                    : "Начать тест"}
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
}