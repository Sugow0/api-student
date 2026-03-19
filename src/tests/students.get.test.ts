import { beforeEach, describe, expect, it } from "bun:test";
import { Elysia } from "elysia";
import { studentController } from "../app/controllers/student.controller";
import { resetStudents } from "../app/services/student.service";
import studentsData from "../data/student.json";

const app = new Elysia().use(studentController);

beforeEach(() => resetStudents());
const get = (path: string) => app.handle(new Request(`http://localhost${path}`));

describe("GET /students", () => {
	describe("liste paginée", () => {
		it("doit renvoyer 200 avec la structure paginée", async () => {
			const response = await get("/students");
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(body).toHaveProperty("data");
			expect(body).toHaveProperty("total");
			expect(body).toHaveProperty("page");
			expect(body).toHaveProperty("limit");
			expect(body).toHaveProperty("totalPages");
			expect(Array.isArray(body.data)).toBe(true);
		});

		it("doit renvoyer le total de tous les étudiants initiaux", async () => {
			const response = await get("/students");
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(body.total).toBe(studentsData.length);
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
