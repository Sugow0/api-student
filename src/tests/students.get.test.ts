import { beforeEach, describe, expect, it, vi } from "vitest";
import studentsData from "../data/student.json";

describe("GET /students", () => {
	let get: (path: string) => Promise<Response>;

	beforeEach(async () => {
		vi.resetModules();
		const { Elysia } = await import("elysia");
		const { studentController } = await import("../app/controllers/student.controller");
		const app = new Elysia().use(studentController);
		get = (path) => app.handle(new Request(`http://localhost${path}`));
	});

	describe("liste complète", () => {
		it("doit renvoyer 200 et un tableau JSON", async () => {
			const response = await get("/students");
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(Array.isArray(body)).toBe(true);
		});

		it("doit renvoyer tous les étudiants initiaux", async () => {
			const response = await get("/students");
			const body = await response.json();

			expect(response.status).toBe(200);
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

		it("doit renvoyer 404 et un message d'erreur pour un ID inexistant", async () => {
			const response = await get("/students/9999");
			const body = await response.json();

			expect(response.status).toBe(404);
			expect(body).toHaveProperty("message");
			expect(typeof body.message).toBe("string");
		});

		it("doit renvoyer 400 et un message d'erreur pour un ID non numérique", async () => {
			const response = await get("/students/abc");
			const body = await response.json();

			expect(response.status).toBe(400);
			expect(body).toHaveProperty("message");
			expect(typeof body.message).toBe("string");
		});
	});
});
