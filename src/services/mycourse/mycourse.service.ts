// services/mycourse/myCourses.service.ts
import { getMyCourses, MyCourse } from "./mycourse.api";
import { getCourseById, Course } from "../courses/courses.api";
import type { Test } from "../test/test.api";

export const fetchCoursesAndTests = async (): Promise<{ courses: MyCourse[]; tests: Test[] }> => {
  const courses = await getMyCourses();

  // Запросы к getCourse выполняем параллельно
  const fullCourses = await Promise.all(
    courses.map(async (course) => {
      if (!course.courseId) {
        throw new Error(`У курса ${course.id} отсутствует ID`);
      }

      try {
        const fullCourse: Course = await getCourseById(course.courseId);
        return fullCourse;
      } catch (err) {
        console.error(`Ошибка при загрузке курса ${course.courseId}:`, err);
        throw err;
      }
    })
  );

  // Собираем все тесты из курсов
  const tests = fullCourses
    .filter((c): c is Course => c !== null)
    .flatMap((c) => c.tests || []);

  return { courses, tests };
};
