import { apiClient } from "../apiClient";

// Полная структура диплома с вложенными объектами
export interface Diploma {
  id?: string;
  codeDiplom: string;
  courseId: string;
  teacherId: string;
  userId: string;
  img: string[]; // ссылки на pdf или картинки
  createdAt?: string;
  issuedAt?: string;
  courseFinishedAt?: string;

  // Вложенные данные
  course?: {
    id: string;
    name: string;
    price?: number;
    description?: string | null;
    image?: string[];
    level?: number;
    status?: string;
    trainerId?: string;
    Course_duration?: string;
    Number_of_lessons?: string;
    Training_format?: string;
    Course_Benefits_Sheet?: string;
    createdAt?: string;
    userId?: string | null;
  };

  teacher?: {
    id: string;
    name: string;
    email?: string;
    phoneNumber?: string;
    role?: string;
    experience?: number;
    img?: string | null;
    status?: string;
    description?: string | null;
    createdAt?: string;
  };

  user?: {
    id: string;
    name: string;
    email?: string;
    phoneNumber?: string;
    role?: string;
    img?: string | null;
    status?: string;
    createdAt?: string;
  };
}

// Получить все дипломы с вложенными данными
export const getDiplomas = async (): Promise<Diploma[]> => {
  return apiClient<Diploma[]>("/diploms");
};

// Получить диплом по id
export const getDiplomaById = async (id: string): Promise<Diploma> => {
  return apiClient<Diploma>(`/diploms/${id}`);
};

