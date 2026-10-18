import { withApiErrorToast } from "./apiErrorToast";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) throw new Error("NEXT_PUBLIC_API_URL не задан");

async function uploadApiClientRequest<T>(
  endpoint: string,
  formData: FormData
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    body: formData,
  });

  const body = await res.text();
  let data: unknown = body;
  if (body && res.headers.get("content-type")?.includes("application/json")) {
    try {
      data = JSON.parse(body) as unknown;
    } catch {
      if (res.ok) {
        throw new Error("Сервер вернул некорректный JSON");
      }
    }
  }

  if (!res.ok) {
    const payload = data && typeof data === "object" ? data as Record<string, unknown> : null;
    const errorMessage =
      (typeof payload?.message === "string" && payload.message) ||
      (typeof payload?.error === "string" && payload.error) ||
      (typeof data === "string" && data) ||
      res.statusText ||
      "Ошибка загрузки";
    throw new Error(errorMessage);
  }

  return data as T;
}

export function uploadApiClient<T>(
  endpoint: string,
  formData: FormData
): Promise<T> {
  return withApiErrorToast(() => uploadApiClientRequest<T>(endpoint, formData));
}
