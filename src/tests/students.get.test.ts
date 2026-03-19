import { describe, it, expect, beforeAll } from "vitest";
import { Elysia } from "elysia";
import { studentController } from "../app/controllers/student.controller";
import studentsData from "../data/student.json";

const app = new Elysia().use(studentController);

const get = (path: string) =>
  app.handle(new Request(`http://localhost${path}`));

describe("GET /students", () => {
  describe("liste complète", () => {
    it("doit renvoyer le statut 200", async () => {
      const response = await get("/students");
      expect(response.status).toBe(200);
    });

    it("doit renvoyer un tableau JSON", async () => {
      const response = await get("/students");
      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
    });

    it("doit renvoyer tous les étudiants initiaux", async () => {
      const response = await get("/students");
      const body = await response.json();
      expect(body).toHaveLength(studentsData.length);
    });
  });

  describe("par ID", () => {
    it("doit renvoyer 200 et l'étudiant correspondant pour un ID valide", async () => {
      const expected = studentsData[0];
      const response = await get(`/students/${expected.id}`);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toMatchObject({
        id: expected.id,
        firstName: expected.firstName,
        lastName: expected.lastName,
        email: expected.email,
        grade: expected.grade,
        field: expected.field,
      });
    });

    it("doit renvoyer 404 pour un ID inexistant", async () => {
      const response = await get("/students/9999");
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body).toHaveProperty("message");
    });

    it("doit renvoyer 400 pour un ID non numérique", async () => {
      const response = await get("/students/abc");
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body).toHaveProperty("message");
    });
  });
});
