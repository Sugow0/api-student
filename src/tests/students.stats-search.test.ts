import { describe, it, expect } from "vitest";
import { Elysia } from "elysia";
import { studentController } from "../app/controllers/student.controller";
import studentsData from "../data/student.json";

const app = new Elysia().use(studentController);

const get = (path: string) =>
  app.handle(new Request(`http://localhost${path}`));

describe("GET /students/stats", () => {
  it("doit renvoyer 200 avec totalStudents, averageGrade, studentsByField et bestStudent", async () => {
    const response = await get("/students/stats");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toHaveProperty("totalStudents", studentsData.length);
    expect(body).toHaveProperty("averageGrade");
    expect(typeof body.averageGrade).toBe("number");
    expect(body).toHaveProperty("studentsByField");
    expect(typeof body.studentsByField).toBe("object");
    expect(body).toHaveProperty("bestStudent");
    expect(body.bestStudent).toMatchObject({
      id: expect.any(Number),
      firstName: expect.any(String),
      grade: Math.max(...studentsData.map((s) => s.grade)),
    });
  });
});

describe("GET /students/search", () => {
  it("doit renvoyer 200 et uniquement les étudiants dont le nom correspond", async () => {
    const target = studentsData[0];
    const response = await get(`/students/search?lastName=${target.lastName}`);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(
      body.every((s: { lastName: string }) =>
        s.lastName.toLowerCase().includes(target.lastName.toLowerCase()),
      ),
    ).toBe(true);
  });
});
