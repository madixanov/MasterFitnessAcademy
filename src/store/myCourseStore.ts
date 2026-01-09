import { create } from "zustand";
import { getMyCourses, MyCourse } from "@/services/mycourse/mycourse.api";

interface MyCoursesState {
  courses: MyCourse[];
  loading: boolean;
  error: string | null;

  fetchMyCourses: () => Promise<void>;
}

export const useMyCoursesStore = create<MyCoursesState>((set) => ({
  courses: [],
  loading: false,
  error: null,

  fetchMyCourses: async () => {
    set({ loading: true, error: null });

    try {
      const data = await getMyCourses();
      set({ courses: data });
    } catch (e) {
      set({ error: "Не удалось загрузить курсы" });
    } finally {
      set({ loading: false });
    }
  },
}));
