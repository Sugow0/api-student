import { beforeEach, describe, expect, it } from "bun:test";
import { Elysia } from "elysia";
import { studentController } from "../app/controllers/student.controller";
import { resetStudents } from "../app/services/student.service";
import studentsData from "../data/student.json";

const app = new Elysia().use(studentController);

beforeEach(() => resetStudents());
const put = (id: number, body: unknown) =>
	app.handle(
		new Request(`http://localhost/students/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		}),
	);

const updatedPayload = {
	firstName: "Lucas",
	lastName: "Martin",
	email: "lucas.updated@test.com",
	grade: 18,
	field: "informatique",
};

describe("PUT /students/:id", () => {
	it("doit renvoyer 200 et l'étudiant mis à jour en conservant son ID", async () => {
		const target = studentsData[0];
		const response = await put(target.id, updatedPayload);
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body).toMatchObject({ id: target.id, ...updatedPayload });
	});

	it("doit renvoyer 404 et un message d'erreur pour un ID inexistant", async () => {
		const response = await put(9999, updatedPayload);
		const body = await response.json();

		expect(response.status).toBe(404);
		expect(body).toHaveProperty("message");
		expect(typeof body.message).toBe("string");
	});
});
