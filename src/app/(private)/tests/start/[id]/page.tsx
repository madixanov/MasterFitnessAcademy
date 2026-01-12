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

  /* ================= LOAD TEST ================= */
  useEffect(() => {
    if (loading || !tests.length || !userId) return;

    const test = tests[0];
    setSelectedTest(test);
    setLoadingTest(true);

    getUserTestResults(userId)
      .then(async (results) => {
        const filtered = results.filter((r) => r.testId === test.id);
        if (filtered.length) {
          const latest = filtered.reduce((a, b) =>
            new Date(b.date) > new Date(a.date) ? b : a
          );
          setResult(latest);
        }

        const data = await getTestById(test.id);

        const saved = localStorage.getItem(
          `${STORAGE_KEY}-${test.id}-${userId}`
        );

        if (saved) {
          const parsed = JSON.parse(saved);
          setQuestions(parsed.questions);
          setCurrentIndex(parsed.currentIndex || 0);
          setAnswers(parsed.answers || {});
          setTimeLeft(parsed.timeLeft || data.duration * 60);
        } else {
          const shuffled = [...data.questions].sort(
            () => 0.5 - Math.random()
          );

          const count = Math.min(
            data.quantity,
            data.questions.length
          );

          setQuestions(shuffled.slice(0, count));
          setTimeLeft(data.duration * 60);
        }
      })
      .finally(() => setLoadingTest(false));
  }, [loading, tests, userId]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (timeLeft <= 0) return;

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
  }, [timeLeft, selectedTest, userId, questions, answers, currentIndex]);

  /* ================= ANSWER ================= */
  const handleAnswer = (questionId: string, answerId: string) => {
    const updated = { ...answers, [questionId]: answerId };
    setAnswers(updated);

    if (selectedTest && userId) {
      localStorage.setItem(
        `${STORAGE_KEY}-${selectedTest.id}-${userId}`,
        JSON.stringify({
          questions,
          currentIndex,
          answers: updated,
          timeLeft,
        })
      );
    }
  };

  /* ================= FINISH ================= */
  const handleFinish = useCallback(async () => {
    if (!selectedTest || !userId || submittedRef.current) return;

    submittedRef.current = true;

    const formattedAnswers = Object.entries(answers).map(
      ([questionId, answerId]) => ({
        questionId,
        answerId,
      })
    );

    try {
      await submitUserTestResult({
        testId: selectedTest.id,
        userId,
        answers: formattedAnswers,
      });

      localStorage.removeItem(
        `${STORAGE_KEY}-${selectedTest.id}-${userId}`
      );

      router.push("/tests");
    } catch (e) {
      submittedRef.current = false;
      console.error("Ошибка сдачи теста:", e);
    }
  }, [answers, selectedTest, userId, router]);

  useEffect(() => {
    if (timeLeft === 0 && questions.length) handleFinish();
  }, [timeLeft, questions, handleFinish]);

  /* ================= UI ================= */
  if (loading || loadingTest) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="text-xl animate-pulse">Загрузка теста...</p>
      </div>
    );
  }

  /* ======= START SCREEN ======= */
  if (!questions.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-3xl mb-4">{selectedTest?.name}</h1>
        <p className="text-lg mb-2">
          Количество вопросов: {selectedTest?.quantity}
        </p>
        <p className="text-lg mb-4">
          Продолжительность: {selectedTest?.duration} минут
        </p>

        <button
          onClick={() => {
            const shuffled = [...selectedTest.questions].sort(
              () => 0.5 - Math.random()
            );
            setQuestions(
              shuffled.slice(0, selectedTest.quantity)
            );
          }}
          className="px-6 py-3 bg-green-500 rounded-lg hover:bg-green-600 transition"
        >
          Начать тест
        </button>
      </div>
    );
  }

  /* ======= QUESTIONS ======= */
  const q = questions[currentIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between mb-4">
        <span>Ученик: {userName}</span>
        <span>
          Таймер: {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
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
              className={`p-3 border rounded ${
                answers[q.id] === a.id
                  ? "bg-green-600 border-green-500"
                  : "border-white/20 hover:bg-gray-700"
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
            <button
              onClick={() => setCurrentIndex((i) => i + 1)}
              className="px-4 py-2 bg-blue-500 rounded"
            >
              Далее
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-4 py-2 bg-green-500 rounded"
            >
              Завершить тест
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
