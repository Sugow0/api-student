import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
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

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
