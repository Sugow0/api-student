import { beforeEach, describe, expect, it } from "bun:test";
import { Elysia } from "elysia";
import { studentController } from "../app/controllers/student.controller";
import { resetStudents } from "../app/services/student.service";

const app = new Elysia().use(studentController);
const get = (path: string) => app.handle(new Request(`http://localhost${path}`));

beforeEach(() => resetStudents());
const post = (body: unknown) =>
	app.handle(
		new Request("http://localhost/students", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		}),
	);

describe("Cas limites", () => {
	describe("valeurs limites de grade", () => {
		it("doit accepter grade = 0 (valeur minimale)", async () => {
			const response = await post({
				firstName: "Test",
				lastName: "Zero",
				email: "zero@test.com",
				grade: 0,
				field: "chimie",
			});
			const body = await response.json();

			expect(response.status).toBe(201);
			expect(body.grade).toBe(0);
		});

		it("doit accepter grade = 20 (valeur maximale)", async () => {
			const response = await post({
				firstName: "Test",
				lastName: "Max",
				email: "max@test.com",
				grade: 20,
				field: "chimie",
			});
			const body = await response.json();

			expect(response.status).toBe(201);
			expect(body.grade).toBe(20);
		});

		it("doit rejeter grade = -1 (en dessous du minimum)", async () => {
			const response = await post({
				firstName: "Test",
				lastName: "Neg",
				email: "neg@test.com",
				grade: -1,
				field: "chimie",
			});
			const body = await response.json();

			expect(response.status).toBe(400);
			expect(body).toHaveProperty("message");
		});
	});

	describe("recherche sans résultats", () => {
		it("doit renvoyer un tableau vide si aucun étudiant ne correspond", async () => {
			const response = await get("/students/search?firstName=zzznomatch");
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(Array.isArray(body)).toBe(true);
			expect(body).toHaveLength(0);
		});
	});

	describe("caractères spéciaux", () => {
		it("doit gérer les accents dans la recherche", async () => {
			const response = await get("/students/search?field=math%C3%A9matiques");
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(body.length).toBeGreaterThan(0);
			expect(body.every((s: { field: string }) => s.field === "mathématiques")).toBe(true);
		});

		it("doit rejeter un email avec des caractères invalides", async () => {
			const response = await post({
				firstName: "Test",
				lastName: "Char",
				email: "not-an-email",
				grade: 10,
				field: "physique",
			});
			const body = await response.json();

			expect(response.status).toBe(400);
			expect(body).toHaveProperty("message");
		});
	});

	describe("search sans paramètres", () => {
		it("doit renvoyer 400 si aucun filtre n'est fourni", async () => {
			const response = await get("/students/search");
			const body = await response.json();

			expect(response.status).toBe(400);
			expect(body).toHaveProperty("message");
			expect(typeof body.message).toBe("string");
		});
	});
});
