import { Elysia, t } from "elysia";
import { CreateStudentSchema, StudentSchema } from "../schemas/student.schema";
import { studentService } from "../services/student.service";

export const studentController = new Elysia({ prefix: "/students" })
  .onError(({ code, error, set }) => {
    if (code === "VALIDATION") {
      set.status = 400;
      const parsed = JSON.parse(error.message);
      return { message: parsed.errors?.[0]?.message ?? "Données invalides" };
    }
  })
  .post(
    "/",
    ({ body, set }) => {
      if (studentService.isEmailTaken(body.email)) {
        set.status = 409;
        return { message: "Cet email est déjà utilisé" };
      }
      const student = studentService.create(body);
      set.status = 201;
      return student;
    },
    {
      body: CreateStudentSchema,
      detail: {
        summary: "Créer un nouvel étudiant",
        description: "Crée un étudiant avec validation complète des champs",
        tags: ["students"],
        responses: {
          201: { description: "Étudiant créé avec succès" },
          400: { description: "Données invalides" },
          409: { description: "Email déjà utilisé" },
        },
      },
    },
  )
  .get(
    "/:id",
    ({ params: { id }, set }) => {
      const parsed = Number(id);

      if (!Number.isInteger(parsed) || isNaN(parsed)) {
        set.status = 400;
        return { message: "L'ID doit être un nombre valide" };
      }

      const student = studentService.findById(parsed);

      if (!student) {
        set.status = 404;
        return { message: `Aucun étudiant trouvé avec l'ID ${parsed}` };
      }

      return student;
    },
    {
      params: t.Object({ id: t.String() }),
      detail: {
        summary: "Récupérer un étudiant par son ID",
        description: "Retourne un étudiant selon son identifiant",
        tags: ["students"],
        responses: {
          200: { description: "Étudiant trouvé" },
          400: { description: "ID invalide (non numérique)" },
          404: { description: "Étudiant non trouvé" },
        },
      },
    },
  )
  .get(
    "/",
    () => studentService.findAll(),
    {
      response: t.Array(StudentSchema),
      detail: {
        summary: "Récupérer tous les étudiants",
        description: "Retourne la liste complète de tous les étudiants",
        tags: ["students"],
        responses: {
          200: { description: "Liste des étudiants" },
        },
      },
    },
  );
