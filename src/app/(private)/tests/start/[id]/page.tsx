"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

import { getProfile } from "@/services/auth/user.api";
import {
  getTestById,
  submitUserTestResult,
  getUserTestResults,
  TestQuestion,
  UserTestResult,
} from "@/services/test/test.api";

const STORAGE_KEY = "test-progress";

export default function TestStartPage() {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [selectedTest, setSelectedTest] = useState<any | null>(null);

  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadingTest, setLoadingTest] = useState(false);

  const [result, setResult] = useState<UserTestResult | null>(null);
  const [alreadyPassed, setAlreadyPassed] = useState(false);

  const submittedRef = useRef(false);

  /* ================= PROFILE ================= */
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

  /* ================= LOAD TEST ================= */
  useEffect(() => {
    if (!userId) return;

    const loadTest = async () => {
      setLoadingTest(true);
      try {
        const test = await getTestById("first-test"); // 🔹 замените на реальный id или логику выбора теста
        setSelectedTest(test);

        // Проверка, сдавал ли пользователь тест за последние 24 часа
        const results = await getUserTestResults(userId);
        const filtered = results.filter((r) => r.testId === test.id);
        if (filtered.length > 0) {
          const latest = filtered.reduce((prev, cur) =>
            new Date(cur.date) > new Date(prev.date) ? cur : prev
          );
          setResult(latest);
          const diff = Date.now() - new Date(latest.date).getTime();
          setAlreadyPassed(diff < 24 * 60 * 60 * 1000);
          return;
        }

        // Проверка прогресса в localStorage
        const saved = localStorage.getItem(`${STORAGE_KEY}-${test.id}-${userId}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          setQuestions(parsed.questions);
          setCurrentIndex(parsed.currentIndex || 0);
          setAnswers(parsed.answers || {});
          setTimeLeft(parsed.timeLeft || test.duration * 60);
        } else {
          const shuffled = [...test.questions].sort(() => 0.5 - Math.random());
          const count = Math.min(test.quantity, test.questions.length);
          setQuestions(shuffled.slice(0, count));
          setTimeLeft(test.duration * 60);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setLoadingTest(false);
      }
    };

    loadTest();
  }, [userId]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (timeLeft <= 0 || alreadyPassed) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = Math.max(prev - 1, 0);
        if (selectedTest && userId) {
          localStorage.setItem(
            `${STORAGE_KEY}-${selectedTest.id}-${userId}`,
            JSON.stringify({ questions, currentIndex, answers, timeLeft: next })
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
  };

  /* ================= FINISH ================= */
  const handleFinish = useCallback(async () => {
    if (!selectedTest || !userId || submittedRef.current) return;

    submittedRef.current = true;

    const payload = Object.entries(answers).map(([questionId, answerId]) => ({
      questionId,
      answerId,
    }));

    try {
      await submitUserTestResult({ testId: selectedTest.id, userId, answers: payload });

      const results = await getUserTestResults(userId);
      const latest = results.filter((r) => r.testId === selectedTest.id)
        .reduce((prev, cur) => new Date(cur.date) > new Date(prev.date) ? cur : prev);
      setResult(latest);
      setAlreadyPassed(true);
      localStorage.removeItem(`${STORAGE_KEY}-${selectedTest.id}-${userId}`);
    } catch (err) {
      console.error(err);
      submittedRef.current = false;
    }
  }, [answers, selectedTest, userId]);

  useEffect(() => {
    if (timeLeft === 0 && questions.length) handleFinish();
  }, [timeLeft, questions, handleFinish]);

  /* ================= UNLOAD ================= */
  useEffect(() => {
    const handleUnload = () => {
      if (!selectedTest || !userId || alreadyPassed || submittedRef.current) return;
      navigator.sendBeacon(
        "/user-test-result/submit",
        new Blob(
          [
            JSON.stringify({
              testId: selectedTest.id,
              userId,
              answers: Object.entries(answers).map(([qId, aId]) => ({ questionId: qId, answerId: aId })),
            }),
          ],
          { type: "application/json" }
        )
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
        <p className="text-xl animate-pulse">Загрузка теста...</p>
      </div>
    );
  }

  if (alreadyPassed && result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-3xl mb-4">{selectedTest.name}</h1>
        <p className="text-xl mb-2">Тест уже сдан</p>
        <p className="text-xl mb-4">
          Результат: <span className="text-green-400">{result.score}</span>
        </p>
        <p className="text-yellow-300 mb-4">Пересдача будет доступна через 24 часа.</p>
        <button
          onClick={() => router.push("/tests")}
          className="px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition"
        >
          Назад к тестам
        </button>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-3xl mb-4">{selectedTest?.name}</h1>
        <p className="text-lg mb-2">Количество вопросов: {selectedTest?.quantity}</p>
        <p className="text-lg mb-2">Продолжительность: {selectedTest?.duration} минут</p>
        <p className="text-lg mb-4 text-yellow-300">Тест можно пройти один раз в день</p>
        <button
          onClick={() => {
            const shuffled = [...selectedTest.questions].sort(() => 0.5 - Math.random());
            setQuestions(shuffled.slice(0, selectedTest.quantity));
          }}
          className="px-6 py-3 bg-green-500 rounded-lg hover:bg-green-600 transition"
        >
          Начать тест
        </button>
      </div>
    );
  }

  const q = questions[currentIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 mt-6">
      <div className="flex justify-between mb-4">
        <span>Ученик: {userName}</span>
        <span>
          Таймер: {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>

      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-xl">
        <p className="mb-2">
          Вопрос {currentIndex + 1} / {questions.length}
        </p>
        <h2 className="text-xl mb-6">{q.question}</h2>

        <div className="grid gap-3">
          {q.answers.map((a) => (
            <button
              key={a.id}
              onClick={() => handleAnswer(q.id, a.id)}
              className={`p-3 border rounded transition ${
                answers[q.id] === a.id ? "bg-green-600 border-green-500" : "border-white/20 hover:bg-gray-700"
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
            className="px-4 py-2 bg-gray-600 rounded disabled:opacity-50"
          >
            Назад
          </button>

          {currentIndex < questions.length - 1 ? (
            <button onClick={() => setCurrentIndex((i) => i + 1)} className="px-4 py-2 bg-blue-500 rounded">
              Далее
            </button>
          ) : (
            <button onClick={handleFinish} className="px-4 py-2 bg-green-500 rounded">
              Завершить тест
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
