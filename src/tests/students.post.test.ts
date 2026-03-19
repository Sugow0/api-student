import { beforeEach, describe, expect, it, vi } from "vitest";
import studentsData from "../data/student.json";

const validPayload = {
	firstName: "Alice",
	lastName: "Dupont",
	email: "alice.dupont@test.com",
	grade: 15,
	field: "informatique",
};

describe("POST /students", () => {
	let post: (body: unknown) => Promise<Response>;

	beforeEach(async () => {
		vi.resetModules();
		const { Elysia } = await import("elysia");
		const { studentController } = await import("../app/controllers/student.controller");
		const app = new Elysia().use(studentController);
		post = (body) =>
			app.handle(
				new Request("http://localhost/students", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(body),
				}),
			);
	});

	it("doit renvoyer 201 et l'étudiant créé avec un ID auto-généré", async () => {
		const response = await post(validPayload);
		const body = await response.json();

		expect(response.status).toBe(201);
		expect(body).toMatchObject(validPayload);
		expect(body.id).toBeDefined();
		expect(typeof body.id).toBe("number");
	});

	it("doit renvoyer 400 et un message d'erreur si un champ obligatoire est manquant", async () => {
		const { email: _omitted, ...withoutEmail } = validPayload;
		const response = await post(withoutEmail);
		const body = await response.json();

		expect(response.status).toBe(400);
		expect(body).toHaveProperty("message");
		expect(typeof body.message).toBe("string");
	});

	it("doit renvoyer 400 et un message d'erreur si la note est hors plage (0-20)", async () => {
		const response = await post({ ...validPayload, grade: 25 });
		const body = await response.json();

		expect(response.status).toBe(400);
		expect(body).toHaveProperty("message");
		expect(typeof body.message).toBe("string");
	});

	it("doit renvoyer 409 et un message d'erreur si l'email est déjà utilisé", async () => {
		const existingEmail = studentsData[0].email;
		const response = await post({ ...validPayload, email: existingEmail });
		const body = await response.json();

		expect(response.status).toBe(409);
		expect(body).toHaveProperty("message");
		expect(typeof body.message).toBe("string");
	});
});
