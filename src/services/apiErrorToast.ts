export const API_ERROR_EVENT = "app:api-error";

export async function withApiErrorToast<T>(
  request: () => Promise<T>
): Promise<T> {
  try {
    return await request();
  } catch (error: unknown) {
    if (typeof window !== "undefined") {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Произошла ошибка при обращении к API";

      window.dispatchEvent(
        new CustomEvent(API_ERROR_EVENT, { detail: { message } })
      );
    }

    throw error;
  }
}
