import { Elysia, t } from "elysia";
import { CreateStudentSchema, StatsSchema, StudentSchema } from "../schemas/student.schema";
import { studentService } from "../services/student.service";

const idParams = t.Object({ id: t.String() });

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
  .delete(
    "/:id",
    ({ params: { id }, set }) => {
      const parsed = Number(id);
      if (!Number.isInteger(parsed) || isNaN(parsed)) {
        set.status = 400;
        return { message: "L'ID doit être un nombre valide" };
      }

      const deleted = studentService.remove(parsed);
      if (!deleted) {
        set.status = 404;
        return { message: `Aucun étudiant trouvé avec l'ID ${parsed}` };
      }

      return { message: `L'étudiant avec l'ID ${parsed} a été supprimé` };
    },
    {
      params: idParams,
      detail: {
        summary: "Supprimer un étudiant",
        tags: ["students"],
        responses: {
          200: { description: "Étudiant supprimé" },
          404: { description: "Étudiant non trouvé" },
        },
      },
    },
  )
  .put(
    "/:id",
    ({ params: { id }, body, set }) => {
      const parsed = Number(id);
      if (!Number.isInteger(parsed) || isNaN(parsed)) {
        set.status = 400;
        return { message: "L'ID doit être un nombre valide" };
      }

      const result = studentService.update(parsed, body);
      if (result === "NOT_FOUND") {
        set.status = 404;
        return { message: `Aucun étudiant trouvé avec l'ID ${parsed}` };
      }
      if (result === "EMAIL_CONFLICT") {
        set.status = 409;
        return { message: "Cet email est déjà utilisé par un autre étudiant" };
      }

      return result;
    },
    {
      params: idParams,
      body: CreateStudentSchema,
      detail: {
        summary: "Modifier un étudiant",
        description: "Met à jour l'intégralité des champs d'un étudiant existant",
        tags: ["students"],
        responses: {
          200: { description: "Étudiant mis à jour" },
          400: { description: "ID invalide ou données invalides" },
          404: { description: "Étudiant non trouvé" },
          409: { description: "Email déjà utilisé par un autre étudiant" },
        },
      },
    },
  )
  .get(
    "/search",
    ({ query: { q }, set }) => {
      if (!q || q.trim() === "") {
        set.status = 400;
        return { message: "Le paramètre q est requis et ne peut pas être vide" };
      }
      return studentService.search(q.trim());
    },
    {
      query: t.Object({ q: t.Optional(t.String()) }),
      detail: {
        summary: "Rechercher des étudiants par nom/prénom",
        tags: ["students"],
        responses: {
          200: { description: "Liste des étudiants correspondants" },
          400: { description: "Paramètre q absent ou vide" },
        },
      },
    },
  )
  .get(
    "/stats",
    () => studentService.getStats(),
    {
      response: StatsSchema,
      detail: {
        summary: "Statistiques des étudiants",
        tags: ["students"],
        responses: {
          200: { description: "Statistiques globales" },
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
      params: idParams,
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
