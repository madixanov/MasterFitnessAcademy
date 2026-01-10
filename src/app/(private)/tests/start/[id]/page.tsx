"use client";

import { useEffect, useState, useCallback } from "react";
import { useMyCoursesStore } from "@/store/myCourseStore";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";

import { getProfile } from "@/services/auth/user.api";
import {
  getTestById,
  submitUserTestResult,
  getUserTestResult,
  TestQuestion,
  UserTestResult,
} from "@/services/test/test.api";

export default function TestStartPage() {
  const router = useRouter();
  const { tests, fetchMyCourses, loading } = useMyCoursesStore();

  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>(""); // имя ученика
  const [selectedTest, setSelectedTest] = useState<any | null>(null);
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [loadingTest, setLoadingTest] = useState(false);
  const [result, setResult] = useState<UserTestResult | null>(null);

  const STORAGE_KEY = "test-progress";

  // Получаем userId и имя из токена
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return;

    getProfile(token)
      .then((data) => {
        setUserId(data.id);
        setUserName(`${data.name} ${data.surname || ""}`.trim());
      })
      .catch((err) => console.error("Ошибка при получении профиля:", err));
  }, []);

  useEffect(() => {
    const loadCourses = async () => {
      await fetchMyCourses();
    };
    loadCourses();
  }, [fetchMyCourses]);

  // Загружаем тест и восстанавливаем прогресс из localStorage
  useEffect(() => {
    if (!loading && tests.length > 0 && userId) {
      const test = tests[0];
      setSelectedTest(test);
      setLoadingTest(true);

      getTestById(test.id)
        .then((data) => {
          const saved = localStorage.getItem(`${STORAGE_KEY}-${test.id}-${userId}`);
          let selectedQuestions: TestQuestion[] = [];

          if (saved) {
            const parsed = JSON.parse(saved);
            selectedQuestions = parsed.questions;
            setCurrentIndex(parsed.currentIndex || 0);
            setAnswers(parsed.answers || {});
            setTimeLeft(parsed.timeLeft || data.duration * 60);
          } else {
            const shuffled = [...data.questions].sort(() => 0.5 - Math.random());
            selectedQuestions = shuffled.slice(0, 10);
            setTimeLeft(data.duration * 60);
          }

          setQuestions(selectedQuestions);
        })
        .catch((err) => console.error("Ошибка при загрузке теста:", err))
        .finally(() => setLoadingTest(false));
    }
  }, [loading, tests, userId]);

  // Таймер
  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => setTimeLeft((prev) => {
      const newTime = prev - 1;
      if (selectedTest && userId) {
        localStorage.setItem(
          `${STORAGE_KEY}-${selectedTest.id}-${userId}`,
          JSON.stringify({
            questions,
            currentIndex,
            answers,
            timeLeft: newTime
          })
        );
      }
      return newTime;
    }), 1000);

    return () => clearInterval(interval);
  }, [timeLeft, selectedTest, userId, questions, answers, currentIndex]);

  const handleAnswer = (questionId: string, answerId: string) => {
    const newAnswers = { ...answers, [questionId]: answerId };
    setAnswers(newAnswers);

    if (selectedTest && userId) {
      localStorage.setItem(
        `${STORAGE_KEY}-${selectedTest.id}-${userId}`,
        JSON.stringify({ questions, currentIndex, answers: newAnswers, timeLeft })
      );
    }
  };

  const handleNext = () => currentIndex < questions.length - 1 && setCurrentIndex((prev) => prev + 1);
  const handlePrev = () => currentIndex > 0 && setCurrentIndex((prev) => prev - 1);

  const handleFinish = useCallback(async () => {
    if (!selectedTest || !userId) return;

    const correctCount = questions.filter(
      (q) => answers[q.id] && q.answers.find((a) => a.id === answers[q.id])?.isRight
    ).length;

    try {
      await submitUserTestResult(selectedTest.id, userId);
      const res = await getUserTestResult(userId);
      setResult(res);

      localStorage.removeItem(`${STORAGE_KEY}-${selectedTest.id}-${userId}`);
    } catch (err) {
      console.error("Ошибка при сдаче теста:", err);
    }
  }, [answers, questions, selectedTest, userId]);

  useEffect(() => {
    if (timeLeft === 0 && questions.length > 0) handleFinish();
  }, [timeLeft, questions, handleFinish]);

  useEffect(() => {
  const handleUnload = (event: BeforeUnloadEvent) => {
    if (selectedTest && userId && questions.length > 0) {
      // Показываем стандартное предупреждение
      event.preventDefault();
      event.returnValue = ""; // важно для всех браузеров, чтобы сработало окно

      // После этого браузер покажет alert. sendBeacon отправится при закрытии вкладки
      const data = new FormData();
      data.append("testId", selectedTest.id);
      data.append("userId", userId);
      data.append("answers", JSON.stringify(answers));

      navigator.sendBeacon("/api/test/submit", data);

      // Удаляем прогресс
      localStorage.removeItem(`${STORAGE_KEY}-${selectedTest.id}-${userId}`);
    }
  };

  window.addEventListener("beforeunload", handleUnload);
  return () => window.removeEventListener("beforeunload", handleUnload);
}, [selectedTest, userId, answers, questions]);

  if (loading || loadingTest) return <p className="text-center mt-20 text-white">Загрузка теста...</p>;
  if (!questions.length) return <p className="text-center mt-20 text-white">Вопросы пока недоступны</p>;

  if (result) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-4xl font-bold mb-4">{selectedTest.name}</h1>
        <p className="text-2xl mb-6">
          Вы правильно ответили на <span className="text-green-400">{result.score}</span> из {result.total} вопросов
        </p>
        <button
          className="px-6 py-3 bg-green-500 text-black rounded-lg hover:bg-green-600 transition"
          onClick={() => router.push("/tests")}
        >
          Вернуться к тестам
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-900 text-white">
      <div className="absolute w-full h-full -z-10 overflow-hidden">
        <Image
          src="/bg-figure.svg"
          alt="background"
          fill
          className="object-contain opacity-80 rotate-90 md:rotate-0 scale-125 md:scale-110"
        />
      </div>

      {/* Таймер + курс + ученик */}
      <div className="bg-gray-800 p-4 text-center text-lg font-medium fixed top-0 left-0 w-full z-10 shadow-md flex flex-col md:flex-row justify-between items-center gap-2">
        <div>
          Таймер: {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
        </div>
        <div>
          Ученик: <span className="font-semibold">{userName || "—"}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-6 mt-24">
        <div className="w-full max-w-3xl bg-black/30 backdrop-blur-md p-8 rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.5)]">
          <h1 className="text-3xl font-bold mb-6">{selectedTest.name}</h1>
          <p className="mb-3 text-gray-300">Вопрос {currentIndex + 1} из {questions.length}</p>
          <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>

          <div className="flex flex-col gap-4">
            {currentQuestion.answers.map((ans) => (
              <button
                key={ans.id}
                className={`px-4 py-3 rounded-lg text-left border font-medium transition ${
                  answers[currentQuestion.id] === ans.id
                    ? "border-green-500 bg-green-600"
                    : "border-white/20 hover:bg-gray-700"
                }`}
                onClick={() => handleAnswer(currentQuestion.id, ans.id)}
              >
                {ans.text}
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <button
              className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              Назад
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition"
                onClick={handleNext}
              >
                Далее
              </button>
            ) : (
              <button
                className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition"
                onClick={handleFinish}
              >
                Завершить тест
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
