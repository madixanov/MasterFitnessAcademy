// services/mycourse/myCourses.service.ts
import { getMyCourses, MyCourse } from "./mycourse.api";
import { getCourseById, Course } from "../courses/courses.api";

export const fetchCoursesAndTests = async (): Promise<{ courses: MyCourse[]; tests: any[] }> => {
  const courses = await getMyCourses();

  // Запросы к getCourse выполняем параллельно
  const fullCourses = await Promise.all(
    courses.map(async (course) => {
      if (!course.courseId) return null;

      try {
        const fullCourse: Course = await getCourseById(course.courseId);
        return fullCourse;
      } catch (err) {
        console.error(`Ошибка при загрузке курса ${course.courseId}:`, err);
        return null;
      }
    })
  );

  // Собираем все тесты из курсов
  const tests = fullCourses
    .filter((c): c is Course => c !== null)
    .flatMap((c) => c.tests || []);

  return { courses, tests };
};
