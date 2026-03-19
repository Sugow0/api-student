import studentsData from "../../data/student.json";

export const ALLOWED_FIELDS = [
  "informatique",
  "mathématiques",
  "physique",
  "chimie",
] as const;

export type Field = (typeof ALLOWED_FIELDS)[number];

export interface CreateStudentDto {
  firstName: string;
  lastName: string;
  email: string;
  grade: number;
  field: Field;
}

const students = [...studentsData];

export const studentService = {
  findAll: () => students,

  findById: (id: number) => students.find((s) => s.id === id) ?? null,

  isEmailTaken: (email: string) => students.some((s) => s.email === email),

  create: (data: CreateStudentDto) => {
    const id =
      students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1;
    const newStudent = { id, ...data };
    students.push(newStudent);
    return newStudent;
  },
};
