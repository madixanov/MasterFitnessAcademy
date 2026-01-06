// stores/useMyCoursesStore.ts
import { create } from "zustand";
import { MyCourse, getMyCourses } from "@/services/mycourse/mycourse.api";

interface MyCoursesState {
  courses: MyCourse[];
  loading: boolean;
  hasInactiveCourse: boolean;
  fetchCourses: () => Promise<void>;
}

export const useMyCoursesStore = create<MyCoursesState>((set) => ({
  courses: [],
  loading: true,
  hasInactiveCourse: false,
  fetchCourses: async () => {
    set({ loading: true });
    try {
      const courses = await getMyCourses();
      const hasInactiveCourse = courses.some((c) => c.status === "INACTIVE");
      set({ courses, hasInactiveCourse, loading: false });
    } catch (err) {
      console.error(err);
      set({ courses: [], hasInactiveCourse: false, loading: false });
    }
  },
}));
