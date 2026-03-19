import students from "../../data/student.json";

export const studentService = {
  findAll: () => students,

  findById: (id: number) => students.find((s) => s.id === id) ?? null,
};
