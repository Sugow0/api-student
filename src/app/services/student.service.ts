import studentsData from "../../data/student.json";
import type { CreateStudentDto, Stats, Student } from "../schemas/student.schema";

export type UpdateResult = "NOT_FOUND" | "EMAIL_CONFLICT" | Student;

const students: Student[] = [...studentsData];

export const studentService = {
  findAll: (): Student[] => students,

  findById: (id: number): Student | null =>
    students.find((s) => s.id === id) ?? null,

  isEmailTaken: (email: string): boolean =>
    students.some((s) => s.email === email),

  create: (data: CreateStudentDto): Student => {
    const id =
      students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1;
    const newStudent: Student = { id, ...data };
    students.push(newStudent);
    return newStudent;
  },

  search: (q: string): Student[] => {
    const term = q.toLowerCase();
    return students.filter(
      (s) =>
        s.firstName.toLowerCase().includes(term) ||
        s.lastName.toLowerCase().includes(term),
    );
  },

  getStats: (): Stats => {
    const total = students.length;
    const averageGrade =
      Math.round((students.reduce((sum, s) => sum + s.grade, 0) / total) * 100) / 100;
    const studentsByField = students.reduce<Record<string, number>>((acc, s) => {
      acc[s.field] = (acc[s.field] ?? 0) + 1;
      return acc;
    }, {});
    const bestStudent = students.reduce((best, s) => (s.grade > best.grade ? s : best));
    return { totalStudents: total, averageGrade, studentsByField, bestStudent };
  },

  remove: (id: number): boolean => {
    const index = students.findIndex((s) => s.id === id);
    if (index === -1) return false;
    students.splice(index, 1);
    return true;
  },

  update: (id: number, data: CreateStudentDto): UpdateResult => {
    const index = students.findIndex((s) => s.id === id);
    if (index === -1) return "NOT_FOUND";

    const emailTakenByOther = students.some(
      (s) => s.email === data.email && s.id !== id,
    );
    if (emailTakenByOther) return "EMAIL_CONFLICT";

    students[index] = { id, ...data };
    return students[index];
  },
};
