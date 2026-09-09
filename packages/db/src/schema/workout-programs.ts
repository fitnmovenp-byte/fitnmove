import { boolean, integer, jsonb, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export type WorkoutProgramExercise = {
  label: string;
  exercise?: string;
  clipSrc?: string;
  sets: number;
  reps?: number;
  seconds?: number;
  restSeconds?: number;
  tracking: "timer" | "manual";
};

export const workoutPrograms = pgTable("workout_programs", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  name: varchar("name", { length: 160 }).notNull(),
  tagline: text("tagline").notNull(),
  difficulty: varchar("difficulty", { length: 20 }).notNull().default("Beginner"),
  durationMin: integer("duration_min").notNull(),
  goal: varchar("goal", { length: 120 }).notNull(),
  equipment: varchar("equipment", { length: 120 }).notNull().default("No Equipment"),
  muscles: jsonb("muscles").$type<string[]>().notNull().default([]),
  calories: integer("calories").notNull().default(0),
  compatibility: varchar("compatibility", { length: 160 }).notNull().default("Manual or audio cue"),
  bannerImage: text("banner_image"),
  pointsReward: integer("points_reward").notNull().default(0),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  exercises: jsonb("exercises").$type<WorkoutProgramExercise[]>().notNull().default([]),
  isPublished: boolean("is_published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
