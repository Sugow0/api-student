import studentsData from "../../data/student.json";
import type { CreateStudentDto, Student } from "../schemas/student.schema";

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
