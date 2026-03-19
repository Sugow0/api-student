import studentsData from "../../data/student.json";
import type { CreateStudentDto, Student } from "../schemas/student.schema";

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
};
