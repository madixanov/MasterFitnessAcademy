const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL не задан в .env");
}

export interface ApiOptions extends RequestInit {
  headers?: Record<string, string>;
}

export async function uploadApiClient<T>(
  endpoint: string,
  formData: FormData,
  options: ApiOptions = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    body: formData,
    ...options,
    headers: {
      ...options.headers, // ❌ НЕ ставим Content-Type
    },
  });

  const contentType = res.headers.get("content-type");
  let data: any = null;

  if (contentType?.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    throw new Error(data?.message || "Ошибка загрузки файла");
  }

  return data as T;
}
