import { Elysia, t } from "elysia";
import { studentService } from "../services/student.service";

export const studentController = new Elysia({ prefix: "/students" })
  .get("/:id", ({ params: { id }, set, error }) => {
    const parsed = Number(id);

    if (!Number.isInteger(parsed) || isNaN(parsed)) {
      set.status = 400;
      return error(400, { message: "L'ID doit être un nombre valide" });
    }

    const student = studentService.findById(parsed);

    if (!student) {
      set.status = 404;
      return error(404, { message: `Aucun étudiant trouvé avec l'ID ${parsed}` });
    }

    return student;
  }, {
    params: t.Object({ id: t.String() }),
    detail: {
      summary: "Récupérer un étudiant par son ID",
      description: "Retourne un étudiant selon son identifiant",
      tags: ["students"],
      responses: {
        200: {
          description: "Étudiant trouvé",
          content: {
            "application/json": {
              schema: {
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
        400: { description: "ID invalide (non numérique)" },
        404: { description: "Étudiant non trouvé" },
      },
    },
  })
  .get(
  "/",
  () => studentService.findAll(),
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
