import { create } from "zustand";
import { getMyCourses, MyCourse } from "@/services/mycourse/mycourse.api";

interface MyCoursesState {
  courses: MyCourse[];
  loading: boolean;
  error: string | null;

  fetchMyCourses: () => Promise<void>;
}

export const useMyCoursesStore = create<MyCoursesState>((set, get) => ({
  courses: [],
  loading: false,
  error: null,

  fetchMyCourses: async () => {
    const { loading, courses } = get();

    // ❗ защита от повторных запросов
    if (loading || courses.length > 0) return;

    set({ loading: true, error: null });

    try {
      const data = await getMyCourses();
      set({ courses: data, error: null });
    } catch (err) {
      console.error("fetchMyCourses error:", err);
      set({ error: "Не удалось загрузить курсы" });
    } finally {
      set({ loading: false });
    }
  },
}));
