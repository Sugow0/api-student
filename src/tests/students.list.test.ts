import { beforeEach, describe, expect, it, vi } from "vitest";
import studentsData from "../data/student.json";

describe("GET /students — pagination & tri", () => {
	let get: (path: string) => Promise<Response>;

	beforeEach(async () => {
		vi.resetModules();
		const { Elysia } = await import("elysia");
		const { studentController } = await import("../app/controllers/student.controller");
		const app = new Elysia().use(studentController);
		get = (path) => app.handle(new Request(`http://localhost${path}`));
	});

	describe("pagination", () => {
		it("doit renvoyer 10 étudiants par défaut (limit=10)", async () => {
			const response = await get("/students");
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(body.data).toHaveLength(10);
			expect(body.page).toBe(1);
			expect(body.limit).toBe(10);
		});

		it("doit renvoyer la page 2 avec les bons étudiants", async () => {
			const response = await get("/students?page=2&limit=10");
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(body.page).toBe(2);
			expect(body.data[0].id).toBe(studentsData[10].id);
		});

		it("doit respecter un limit personnalisé", async () => {
			const response = await get("/students?limit=5");
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(body.data).toHaveLength(5);
			expect(body.limit).toBe(5);
			expect(body.totalPages).toBe(Math.ceil(studentsData.length / 5));
		});

		it("doit renvoyer une page vide si page > totalPages", async () => {
			const response = await get("/students?page=999&limit=10");
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(body.data).toHaveLength(0);
			expect(body.total).toBe(studentsData.length);
		});

		it("doit calculer correctement totalPages", async () => {
			const response = await get("/students?limit=10");
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(body.totalPages).toBe(Math.ceil(studentsData.length / 10));
		});
	});

	describe("tri", () => {
		it("doit trier par grade ascendant", async () => {
			const response = await get("/students?sort=grade&order=asc&limit=40");
			const body = await response.json();

			expect(response.status).toBe(200);
			const grades: number[] = body.data.map((s: { grade: number }) => s.grade);
			expect(grades).toEqual([...grades].sort((a, b) => a - b));
		});

		it("doit trier par grade descendant", async () => {
			const response = await get("/students?sort=grade&order=desc&limit=40");
			const body = await response.json();

			expect(response.status).toBe(200);
			const grades: number[] = body.data.map((s: { grade: number }) => s.grade);
			expect(grades).toEqual([...grades].sort((a, b) => b - a));
		});

		it("doit trier par lastName alphabétique", async () => {
			const response = await get("/students?sort=lastName&order=asc&limit=40");
			const body = await response.json();

			expect(response.status).toBe(200);
			const names: string[] = body.data.map((s: { lastName: string }) => s.lastName);
			expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
		});

		it("doit combiner tri et pagination", async () => {
			const allSorted = await get("/students?sort=grade&order=desc&limit=40");
			const allBody = await allSorted.json();

			const page1 = await get("/students?sort=grade&order=desc&limit=5&page=1");
			const page1Body = await page1.json();

			expect(page1Body.data[0].grade).toBe(allBody.data[0].grade);
		});
	});
});
