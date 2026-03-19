import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { studentController } from "./app/controllers/student.controller";

const app = new Elysia()
	.use(
		swagger({
			documentation: {
				info: {
					title: "API Student",
					version: "1.0.0",
					description: "API de gestion des étudiants",
				},
			},
		}),
	)
	.use(studentController)
	.listen(3000);

// biome-ignore lint/suspicious/noConsole: message de démarrage intentionnel
console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
