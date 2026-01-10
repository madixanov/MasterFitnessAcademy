// store/myCoursesStore.ts
import { create } from "zustand";
import { MyCourse } from "@/services/mycourse/mycourse.api";
import { fetchCoursesAndTests } from "@/services/mycourse/mycourse.service";

interface MyCoursesState {
  courses: MyCourse[];
  tests: any[];
  loading: boolean;
  error: string | null;

  fetchMyCourses: () => Promise<void>;
}

export const useMyCoursesStore = create<MyCoursesState>((set, get) => ({
  courses: [],
  tests: [],
  loading: false,
  error: null,

  fetchMyCourses: async () => {
    const { loading, courses } = get();
    if (loading || courses.length > 0) return;

    set({ loading: true, error: null });

    try {
      const { courses: myCourses, tests } = await fetchCoursesAndTests();
      set({ courses: myCourses, tests });
    } catch (err) {
      console.error("fetchMyCourses error:", err);
      set({ error: "Не удалось загрузить курсы и тесты" });
    } finally {
      set({ loading: false });
    }
  },
}));
