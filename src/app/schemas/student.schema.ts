import { t } from "elysia";
import type { Static } from "@sinclair/typebox";

export const ALLOWED_FIELDS = [
  "informatique",
  "mathématiques",
  "physique",
  "chimie",
] as const;

export const StudentSchema = t.Object({
  id: t.Number(),
  firstName: t.String(),
  lastName: t.String(),
  email: t.String(),
  grade: t.Number(),
  field: t.Union([
    t.Literal("informatique"),
    t.Literal("mathématiques"),
    t.Literal("physique"),
    t.Literal("chimie"),
  ]),
});

export const CreateStudentSchema = t.Object({
  firstName: t.String({ minLength: 2 }),
  lastName: t.String({ minLength: 2 }),
  email: t.String({ format: "email" }),
  grade: t.Number({ minimum: 0, maximum: 20 }),
  field: t.Union([
    t.Literal("informatique"),
    t.Literal("mathématiques"),
    t.Literal("physique"),
    t.Literal("chimie"),
  ]),
});

export const SearchStudentSchema = t.Object({
  firstName: t.Optional(t.String()),
  lastName: t.Optional(t.String()),
  email: t.Optional(t.String()),
  grade: t.Optional(t.Numeric({ minimum: 0, maximum: 20 })),
  field: t.Optional(
    t.Union([
      t.Literal("informatique"),
      t.Literal("mathématiques"),
      t.Literal("physique"),
      t.Literal("chimie"),
    ]),
  ),
});

export const StatsSchema = t.Object({
  totalStudents: t.Number(),
  averageGrade: t.Number(),
  studentsByField: t.Record(t.String(), t.Number()),
  bestStudent: StudentSchema,
});

export type Student = Static<typeof StudentSchema>;
export type CreateStudentDto = Static<typeof CreateStudentSchema>;
export type SearchStudentDto = Static<typeof SearchStudentSchema>;
export type Stats = Static<typeof StatsSchema>;
