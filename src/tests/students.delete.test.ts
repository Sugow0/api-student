import { beforeEach, describe, expect, it, vi } from "vitest";
import studentsData from "../data/student.json";

describe("DELETE /students/:id", () => {
  let del: (id: number) => Promise<Response>;

  beforeEach(async () => {
    vi.resetModules();
    const { Elysia } = await import("elysia");
    const { studentController } = await import(
      "../app/controllers/student.controller"
    );
    const app = new Elysia().use(studentController);
    del = (id) =>
      app.handle(
        new Request(`http://localhost/students/${id}`, { method: "DELETE" }),
      );
  });

  it("doit renvoyer 200 et un message de confirmation pour un ID valide", async () => {
    const target = studentsData[0];
    const response = await del(target.id);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toHaveProperty("message");
    expect(typeof body.message).toBe("string");
  });

  it("doit renvoyer 404 et un message d'erreur pour un ID inexistant", async () => {
    const response = await del(9999);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toHaveProperty("message");
    expect(typeof body.message).toBe("string");
  });
});
