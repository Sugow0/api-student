import { Elysia } from "elysia";
import students from "../../data/student.json";

export const studentController = new Elysia({ prefix: "/students" }).get(
  "/",
  () => students,
  {
    detail: {
      summary: "Récupérer tous les étudiants",
      description: "Retourne la liste complète de tous les étudiants",
      tags: ["students"],
      responses: {
        200: {
          description: "Liste des étudiants",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "number" },
                    firstName: { type: "string" },
                    lastName: { type: "string" },
                    email: { type: "string" },
                    grade: { type: "number" },
                    field: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
);
