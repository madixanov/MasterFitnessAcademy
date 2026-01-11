"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useMyCoursesStore } from "@/store/myCourseStore";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import { getProfile } from "@/services/auth/user.api";
import {
  getTestById,
  submitUserTestResult,
  getUserTestResults,
  TestQuestion,
  UserTestResult,
} from "@/services/test/test.api";

export default function TestStartPage() {
  const router = useRouter();
  const { tests, fetchMyCourses, loading } = useMyCoursesStore();

  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [selectedTest, setSelectedTest] = useState<any | null>(null);

  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);

  const [loadingTest, setLoadingTest] = useState(false);
  const [result, setResult] = useState<UserTestResult | null>(null);
  const [alreadyPassed, setAlreadyPassed] = useState(false);

  const submittedRef = useRef(false);
  const STORAGE_KEY = "test-progress";

  /* ================= PROFILE ================= */
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return;

    getProfile(token).then((data) => {
      setUserId(data.id);
      setUserName(`${data.name} ${data.surname || ""}`.trim());
    });
  }, []);

  /* ================= COURSES ================= */
  useEffect(() => {
    fetchMyCourses();
  }, [fetchMyCourses]);

  /* ================= LOAD TEST + ONE TRY ================= */
  useEffect(() => {
    if (loading || !tests.length || !userId) return;

    const test = tests[0];
    setSelectedTest(test);
    setLoadingTest(true);

    getUserTestResults(userId)
      .then((results) => {
        // Отбираем только результаты по текущему тесту
        const filtered = results.filter((r) => r.testId === test.id);

        if (filtered.length > 0) {
          // Берем последнюю попытку по дате
          const latest = filtered.reduce((latest, cur) =>
            new Date(cur.date) > new Date(latest.date) ? cur : latest
          );
          setResult(latest);

          // ⚡ разрешаем пересдачу только через 1 день
          const lastDate = new Date(latest.date);
          const now = new Date();
          const diff = now.getTime() - lastDate.getTime();
          const oneDayMs = 24 * 60 * 60 * 1000;

          if (diff >= oneDayMs) {
            setAlreadyPassed(false); // можно пересдать
          } else {
            setAlreadyPassed(true); // ещё нельзя пересдать
          }

          return;
        }

        // Если результатов нет — стандартная подготовка теста
        return getTestById(test.id).then((data) => {
          const saved = localStorage.getItem(`${STORAGE_KEY}-${test.id}-${userId}`);
          if (saved) {
            const parsed = JSON.parse(saved);
            setQuestions(parsed.questions);
            setCurrentIndex(parsed.currentIndex || 0);
            setAnswers(parsed.answers || {});
            setTimeLeft(parsed.timeLeft || data.duration * 60);
          } else {
            const shuffled = [...data.questions].sort(() => 0.5 - Math.random());
            setQuestions(shuffled.slice(0, 10));
            setTimeLeft(data.duration * 60);
          }
        });
      })
      .finally(() => setLoadingTest(false));
  }, [loading, tests, userId]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (timeLeft <= 0 || alreadyPassed) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = Math.max(prev - 1, 0);
        if (selectedTest && userId) {
          localStorage.setItem(
            `${STORAGE_KEY}-${selectedTest.id}-${userId}`,
            JSON.stringify({
              questions,
              currentIndex,
              answers,
              timeLeft: next,
            })
          );
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, selectedTest, userId, questions, answers, currentIndex, alreadyPassed]);

  /* ================= ANSWER ================= */
  const handleAnswer = (questionId: string, answerId: string) => {
    const updated = { ...answers, [questionId]: answerId };
    setAnswers(updated);

    if (selectedTest && userId) {
      localStorage.setItem(
        `${STORAGE_KEY}-${selectedTest.id}-${userId}`,
        JSON.stringify({ questions, currentIndex, answers: updated, timeLeft })
      );
    }
  };

  /* ================= FINISH ================= */
  const handleFinish = useCallback(async () => {
    if (!selectedTest || !userId || submittedRef.current) return;

    submittedRef.current = true;

    const formattedAnswers = Object.entries(answers).map(([questionId, answerId]) => ({
      questionId,
      answerId,
    }));

    try {
      await submitUserTestResult({
        testId: selectedTest.id,
        userId,
        answers: formattedAnswers,
      });

      const results = await getUserTestResults(userId);
      const latest = results
        .filter((r) => r.testId === selectedTest.id)
        .reduce((latest, cur) =>
          new Date(cur.date) > new Date(latest.date) ? cur : latest
        );

      setResult(latest);
      setAlreadyPassed(true);

      localStorage.removeItem(`${STORAGE_KEY}-${selectedTest.id}-${userId}`);
    } catch (e) {
      submittedRef.current = false;
      console.error("Ошибка сдачи теста:", e);
    }
  }, [answers, selectedTest, userId]);

  useEffect(() => {
    if (timeLeft === 0 && questions.length) handleFinish();
  }, [timeLeft, questions, handleFinish]);

  /* ================= UNLOAD ================= */
  useEffect(() => {
    const handleUnload = () => {
      if (!selectedTest || !userId || alreadyPassed || submittedRef.current) return;

      const payload = {
        testId: selectedTest.id,
        userId,
        answers: Object.entries(answers).map(([questionId, answerId]) => ({
          questionId,
          answerId,
        })),
      };

      navigator.sendBeacon(
        "/user-test-result/submit",
        new Blob([JSON.stringify(payload)], { type: "application/json" })
      );

      localStorage.removeItem(`${STORAGE_KEY}-${selectedTest.id}-${userId}`);
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [selectedTest, userId, answers, alreadyPassed]);

  /* ================= UI ================= */
  if (loading || loadingTest) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="flex space-x-2 mb-6">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-0"></div>
          <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce delay-150"></div>
          <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce delay-300"></div>
        </div>

        <p className="text-xl font-semibold animate-pulse">Загрузка теста...</p>
      </div>
    );
  }

  // ======= Результат уже сдан (ещё нельзя пересдать) =======
  if (alreadyPassed && result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-3xl mb-4">{selectedTest.name}</h1>
        <p className="text-xl mb-2">Тест уже сдан</p>
        <p className="text-xl mb-4">
          Результат: <span className="text-green-400">{result.score}</span> / {result.total}
        </p>
        <p className="text-yellow-300 mb-4">
          Пересдача будет доступна через 24 часа.
        </p>
        <button
          onClick={() => router.push("/tests")}
          className="px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition"
        >
          Назад к тестам
        </button>
      </div>
    );
  }

  // ======= Приветственный экран =======
  if (!questions.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-3xl mb-4">{selectedTest?.name}</h1>
        <p className="text-lg mb-2">
          Количество вопросов: {selectedTest?.questions.length || "—"}
        </p>
        <p className="text-lg mb-2">Продолжительность: {selectedTest?.duration} минут</p>
        <p className="text-lg mb-4 text-yellow-300">
          Внимание! Тест можно пройти один раз за день.
        </p>
        <button
          onClick={() => setQuestions(selectedTest.questions.slice(0, 10))}
          className="px-6 py-3 bg-green-500 rounded-lg hover:bg-green-600 transition"
        >
          Начать тест
        </button>
      </div>
    );
  }

  // ======= Вопросы =======
  const q = questions[currentIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 mt-6">
      <div className="flex justify-between mb-4 text-lg">
        <span>Ученик: {userName}</span>
        <span>
          Таймер: {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </span>
      </div>

      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-xl shadow">
        <p className="mb-2">
          Вопрос {currentIndex + 1} / {questions.length}
        </p>
        <h2 className="text-xl mb-6">{q.question}</h2>

        <div className="grid gap-3">
          {q.answers.map((a) => (
            <button
              key={a.id}
              onClick={() => handleAnswer(q.id, a.id)}
              className={`p-3 border rounded font-medium transition ${
                answers[q.id] === a.id
                  ? "bg-green-600 border-green-500"
                  : "hover:bg-gray-700 border-white/20"
              }`}
            >
              {a.text}
            </button>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => i - 1)}
            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 transition disabled:opacity-50"
          >
            Назад
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex((i) => i + 1)}
              className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition"
            >
              Далее
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 transition"
            >
              Завершить тест
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
