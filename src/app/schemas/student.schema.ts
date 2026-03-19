import type { Static } from "@sinclair/typebox";
import { t } from "elysia";

export const ALLOWED_FIELDS = ["informatique", "mathématiques", "physique", "chimie"] as const;

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

export const ListStudentsSchema = t.Object({
	page: t.Optional(t.Numeric({ minimum: 1 })),
	limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
	sort: t.Optional(
		t.Union([
			t.Literal("id"),
			t.Literal("firstName"),
			t.Literal("lastName"),
			t.Literal("grade"),
			t.Literal("field"),
		]),
	),
	order: t.Optional(t.Union([t.Literal("asc"), t.Literal("desc")])),
});

export const PaginatedStudentsSchema = t.Object({
	data: t.Array(StudentSchema),
	total: t.Number(),
	page: t.Number(),
	limit: t.Number(),
	totalPages: t.Number(),
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
export type ListStudentsDto = Static<typeof ListStudentsSchema>;
export type PaginatedStudents = Static<typeof PaginatedStudentsSchema>;
export type Stats = Static<typeof StatsSchema>;
