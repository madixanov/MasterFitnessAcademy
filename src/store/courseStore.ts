// store/courseStore.ts
import { create } from "zustand";
import { Course } from "@/services/courses/courses.api";

interface CourseState {
  course: Course | null;
  setCourse: (course: Course) => void;
  clearCourse: () => void;
}

export const useCourseStore = create<CourseState>((set) => ({
  course: null,
  setCourse: (course) => set({ course }),
  clearCourse: () => set({ course: null }),
}));
