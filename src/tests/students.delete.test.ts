import { describe, it, expect } from "vitest";
import { Elysia } from "elysia";
import { studentController } from "../app/controllers/student.controller";
import studentsData from "../data/student.json";

const app = new Elysia().use(studentController);

const del = (id: number) =>
  app.handle(
    new Request(`http://localhost/students/${id}`, { method: "DELETE" }),
  );

describe("DELETE /students/:id", () => {
  it("doit renvoyer 200 et un message de confirmation pour un ID valide", async () => {
    const target = studentsData[0];
    const response = await del(target.id);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toHaveProperty("message");
  });

  it("doit renvoyer 404 pour un ID inexistant", async () => {
    const response = await del(9999);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toHaveProperty("message");
  });
});
