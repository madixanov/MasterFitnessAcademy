"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";

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
  const params = useParams();
  const testIdFromUrl = params.id as string;

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
    if (!userId || !testIdFromUrl) return;

    const loadTest = async () => {
      setLoadingTest(true);
      try {
        const test = await getTestById(testIdFromUrl);
        setSelectedTest(test);

        const results = await getUserTestResults(userId);
        const filtered = results.filter((r) => r.testId === test.id);

        if (filtered.length > 0) {
          const latest = filtered.reduce((prev, cur) =>
            new Date(cur.date) > new Date(prev.date) ? cur : prev
          );
          
          const diff = Date.now() - new Date(latest.date).getTime();
          // Если прошло меньше 24 часов (или вашего лимита), считаем сданным
          if (diff < 24 * 60 * 60 * 1000) {
             setResult(latest);
             setAlreadyPassed(true);
             return;
          }
        }

        const saved = localStorage.getItem(`${STORAGE_KEY}-${test.id}-${userId}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          setQuestions(parsed.questions);
          setCurrentIndex(parsed.currentIndex || 0);
          setAnswers(parsed.answers || {});
          setTimeLeft(parsed.timeLeft || test.duration * 60);
        } else {
          // Важно: устанавливаем время сразу, чтобы при старте timeLeft не был 0
          setTimeLeft(test.duration * 60);
        }
      } catch (err) {
        console.error("Ошибка загрузки теста:", err);
      } finally {
        setLoading(false);
        setLoadingTest(false);
      }
    };

    loadTest();
  }, [userId, testIdFromUrl]);

  /* ================= TIMER ================= */
  useEffect(() => {
    // Таймер работает только если вопросы загружены (тест начат)
    if (timeLeft <= 0 || alreadyPassed || !selectedTest || !userId || questions.length === 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = Math.max(prev - 1, 0);
        localStorage.setItem(
          `${STORAGE_KEY}-${selectedTest.id}-${userId}`,
          JSON.stringify({ questions, currentIndex, answers, timeLeft: next })
        );
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, selectedTest, userId, questions, answers, currentIndex, alreadyPassed]);

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
      console.error("Ошибка при отправке теста:", err);
      submittedRef.current = false;
    }
  }, [answers, selectedTest, userId]);

  // Автозавершение по таймеру
  useEffect(() => {
    // Добавлена проверка timeLeft > 0 в логику старта, чтобы это не срабатывало мгновенно
    if (questions.length > 0 && timeLeft === 0 && !submittedRef.current && !alreadyPassed) {
      handleFinish();
    }
  }, [timeLeft, questions.length, handleFinish, alreadyPassed]);

  /* ================= START TEST HANDLER ================= */
  const startTest = () => {
    if (!selectedTest) return;
    
    // Сбрасываем флаг отправки для возможности пересдачи
    submittedRef.current = false;
    
    const shuffled = [...selectedTest.questions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, selectedTest.quantity);
    
    setAnswers({});
    setCurrentIndex(0);
    setQuestions(selectedQuestions);
    setTimeLeft(selectedTest.duration * 60); // Установка времени ДО срабатывания эффектов
  };

  /* ================= UNLOAD ================= */
  useEffect(() => {
    const handleUnload = () => {
      if (!selectedTest || !userId || alreadyPassed || submittedRef.current || !questions.length) return;
      
      const payload = JSON.stringify({
        testId: selectedTest.id,
        userId,
        answers: Object.entries(answers).map(([qId, aId]) => ({ questionId: qId, answerId: aId })),
      });
      
      navigator.sendBeacon("/user-test-result/submit", new Blob([payload], { type: "application/json" }));
      localStorage.removeItem(`${STORAGE_KEY}-${selectedTest.id}-${userId}`);
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [selectedTest, userId, answers, alreadyPassed, questions.length]);

  /* ================= UI RENDERING ================= */
  if (loading || loadingTest) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="text-xl animate-pulse">Загрузка данных...</p>
      </div>
    );
  }

  if (alreadyPassed && result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-3xl mb-4">{selectedTest?.name}</h1>
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl text-center border border-gray-700">
          <p className="text-xl mb-2">Тест уже сдан</p>
          <p className="text-4xl font-bold mb-4 text-green-400">
            {result.score.toFixed(1)}%
          </p>
          <p className="text-yellow-300 mb-6">Следующая попытка будет доступна позже.</p>
          <button
            onClick={() => router.push("/tests")}
            className="px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition"
          >
            Назад к списку
          </button>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-4xl font-bold mb-6">{selectedTest?.name}</h1>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 w-full max-w-md">
          <p className="text-lg mb-2">Вопросов: <span className="text-blue-400">{selectedTest?.quantity}</span></p>
          <p className="text-lg mb-4">Время: <span className="text-blue-400">{selectedTest?.duration} мин.</span></p>
          <button
            onClick={startTest}
            className="w-full px-6 py-4 bg-green-600 rounded-xl font-bold text-xl hover:bg-green-500 transition-all shadow-lg active:scale-95"
          >
            Начать тест
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentIndex];
  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="max-w-3xl mx-auto flex justify-between items-center mb-8 bg-gray-800 p-4 rounded-lg border border-gray-700">
        <div className="flex flex-col">
          <span className="text-gray-400 text-xs uppercase tracking-wider">Студент</span>
          <span className="font-medium">{userName}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-gray-400 text-xs uppercase tracking-wider">Осталось времени</span>
          <span className={`font-mono text-xl ${timeLeft < 60 ? "text-red-500 animate-pulse" : "text-green-400"}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <span className="bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full text-sm border border-blue-700">
              Вопрос {currentIndex + 1} из {questions.length}
            </span>
            <div className="w-1/2 bg-gray-700 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-500 h-full transition-all duration-300" 
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-8 leading-tight">{q.question}</h2>

          <div className="grid gap-4">
            {q.answers.map((a) => (
              <button
                key={a.id}
                onClick={() => setAnswers(prev => ({ ...prev, [q.id]: a.id }))}
                className={`group p-4 text-left border-2 rounded-xl transition-all duration-200 flex justify-between items-center ${
                  answers[q.id] === a.id 
                    ? "bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/20" 
                    : "border-gray-700 hover:border-gray-500 hover:bg-gray-700/50"
                }`}
              >
                <span className="text-lg">{a.text}</span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  answers[q.id] === a.id ? "border-white bg-white" : "border-gray-600"
                }`}>
                  {answers[q.id] === a.id && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                </div>
              </button>
            ))}
          </div>

          <footer className="flex justify-between mt-10 pt-6 border-t border-gray-700">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => i - 1)}
              className="px-6 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-30 transition"
            >
              Назад
            </button>

            {currentIndex < questions.length - 1 ? (
              <button 
                onClick={() => setCurrentIndex((i) => i + 1)} 
                className="px-8 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 font-semibold transition"
              >
                Далее
              </button>
            ) : (
              <button 
                onClick={handleFinish} 
                className="px-8 py-2 bg-green-600 rounded-lg hover:bg-green-500 font-semibold transition shadow-lg shadow-green-900/20"
              >
                Завершить
              </button>
            )}
          </footer>
        </div>
      </main>
    </div>
  );
}