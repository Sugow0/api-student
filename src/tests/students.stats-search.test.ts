import { beforeEach, describe, expect, it, vi } from "vitest";
import studentsData from "../data/student.json";

describe("GET /students/stats", () => {
  let get: (path: string) => Promise<Response>;

  beforeEach(async () => {
    vi.resetModules();
    const { Elysia } = await import("elysia");
    const { studentController } = await import(
      "../app/controllers/student.controller"
    );
    const app = new Elysia().use(studentController);
    get = (path) => app.handle(new Request(`http://localhost${path}`));
  });

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
  let get: (path: string) => Promise<Response>;

  beforeEach(async () => {
    vi.resetModules();
    const { Elysia } = await import("elysia");
    const { studentController } = await import(
      "../app/controllers/student.controller"
    );
    const app = new Elysia().use(studentController);
    get = (path) => app.handle(new Request(`http://localhost${path}`));
  });

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
