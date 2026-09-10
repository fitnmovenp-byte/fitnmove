import { z } from "zod";
import { asc, desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../trpc";
import { healthTaskCompletions, users, workoutPrograms, workouts } from "@/server/db/schema";

const exerciseSchema = z.object({
  exercise_id: z.string().max(120).optional(),
  name: z.string().max(120).optional(),
  order: z.number().int().min(0).optional(),
  label: z.string().min(1).max(120).optional(),
  exercise: z.string().max(40).optional(),
  clipSrc: z.string().max(500).optional(),
  sets: z.number().int().min(1).max(20),
  reps: z.number().int().min(1).max(1000).nullable().optional(),
  duration_seconds: z.number().int().min(1).max(7200).nullable().optional(),
  seconds: z.number().int().min(1).max(7200).optional(),
  rest_seconds: z.number().int().min(0).max(1800).optional(),
  restSeconds: z.number().int().min(0).max(1800).optional(),
  reps_per_side: z.boolean().optional(),
  tracking: z.enum(["timer", "manual"]).optional(),
}).refine((exercise) => Boolean(exercise.reps || exercise.seconds || exercise.duration_seconds), "Set reps or duration.");

const programSchema = z.object({
  slug: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens."),
  name: z.string().min(2).max(160),
  tagline: z.string().min(2).max(500),
  programType: z.enum(["Calisthenics", "Dumbbell"]).default("Calisthenics"),
  difficulty: z.enum(["Easy", "Medium", "Hard", "Elite", "Beginner", "Intermediate", "Advanced"]),
  durationMin: z.number().int().min(1).max(600),
  goal: z.string().min(2).max(120),
  equipment: z.string().min(1).max(120),
  muscles: z.array(z.string().min(1).max(60)).max(12),
  calories: z.number().int().min(0).max(10000),
  bannerImage: z.string().max(500).nullable().optional(),
  pointsReward: z.number().int().min(0).max(10000),
  tags: z.array(z.string().min(1).max(40)).max(12),
  exercises: z.array(exerciseSchema).min(1).max(30),
  isPublished: z.boolean(),
  sortOrder: z.number().int().min(0).max(10000),
});

async function assertAdmin(ctx: { db: typeof import("@/server/db").db; user: { id: string } }) {
  const admin = await ctx.db.select({ isAdmin: users.isAdmin }).from(users).where(eq(users.id, ctx.user.id)).then((rows) => rows[0]);
  if (!admin?.isAdmin) throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required." });
}

function toClientProgram(program: typeof workoutPrograms.$inferSelect) {
  return {
    ...program,
    programId: program.id,
    id: program.slug,
    displayName: program.name,
    thumbnail: program.bannerImage ?? "",
    compatibility: program.compatibility,
    exercises: program.exercises.map((exercise, index) => ({
      ...exercise,
      exercise_id: exercise.exercise_id ?? exercise.exercise,
      name: exercise.name ?? exercise.label ?? "Exercise",
      order: exercise.order ?? index + 1,
      duration_seconds: exercise.duration_seconds ?? exercise.seconds ?? null,
      rest_seconds: exercise.rest_seconds ?? exercise.restSeconds ?? 0,
      reps_per_side: exercise.reps_per_side ?? false,
    })),
  };
}

export const workoutProgramsRouter = router({
  listPublished: protectedProcedure.query(async ({ ctx }) => {
    const programs = await ctx.db.select().from(workoutPrograms).where(eq(workoutPrograms.isPublished, true)).orderBy(asc(workoutPrograms.sortOrder), desc(workoutPrograms.createdAt));
    return programs.map(toClientProgram);
  }),
  getBySlug: protectedProcedure.input(z.object({ slug: z.string().min(1) })).query(async ({ ctx, input }) => {
    const program = await ctx.db.select().from(workoutPrograms).where(eq(workoutPrograms.slug, input.slug)).limit(1).then((rows) => rows[0]);
    return program ? toClientProgram(program) : null;
  }),
  listAdmin: protectedProcedure.query(async ({ ctx }) => {
    await assertAdmin(ctx);
    const programs = await ctx.db.select().from(workoutPrograms).orderBy(asc(workoutPrograms.sortOrder), desc(workoutPrograms.createdAt));
    return programs.map(toClientProgram);
  }),
  create: protectedProcedure.input(programSchema).mutation(async ({ ctx, input }) => {
    await assertAdmin(ctx);
    const [program] = await ctx.db.insert(workoutPrograms).values({ ...input, bannerImage: input.bannerImage || null }).returning();
    return toClientProgram(program);
  }),
  update: protectedProcedure.input(programSchema.extend({ id: z.string().uuid() })).mutation(async ({ ctx, input }) => {
    await assertAdmin(ctx);
    const { id, ...values } = input;
    const [program] = await ctx.db.update(workoutPrograms).set({ ...values, bannerImage: values.bannerImage || null, updatedAt: new Date() }).where(eq(workoutPrograms.id, id)).returning();
    if (!program) throw new TRPCError({ code: "NOT_FOUND", message: "Program not found." });
    return toClientProgram(program);
  }),
  delete: protectedProcedure.input(z.object({ id: z.string().uuid() })).mutation(async ({ ctx, input }) => {
    await assertAdmin(ctx);
    await ctx.db.delete(workoutPrograms).where(eq(workoutPrograms.id, input.id));
    return { success: true };
  }),
  complete: protectedProcedure.input(z.object({
    programId: z.string().uuid(),
    programName: z.string().min(1),
    programSlug: z.string().min(1),
    durationSeconds: z.number().int().min(0),
    pointsEarned: z.number().int().min(0),
    totalSets: z.number().int().min(0),
  })).mutation(async ({ ctx, input }) => {
    const completedAt = new Date();
    const [workout] = await ctx.db.insert(workouts).values({
      userId: ctx.user.id,
      name: input.programName,
      programId: input.programId,
      programSlug: input.programSlug,
      pointsEarned: input.pointsEarned,
      startedAt: new Date(completedAt.getTime() - input.durationSeconds * 1000),
      completedAt,
      durationSec: input.durationSeconds,
      note: JSON.stringify({ totalSets: input.totalSets }),
    }).returning({ id: workouts.id });
    if (input.pointsEarned > 0) {
      await ctx.db.insert(healthTaskCompletions).values({
        userId: ctx.user.id,
        taskDate: completedAt.toISOString().slice(0, 10),
        taskKey: `program-${input.programId}-${completedAt.getTime()}`,
        title: input.programName,
        category: "Workout",
        status: "completed",
        medalCode: "workout-program-complete",
        medalName: "Program Complete",
        medalTier: "training",
        medalPoints: input.pointsEarned,
        proof: { programId: input.programId, programSlug: input.programSlug, totalSets: input.totalSets },
        completedAt,
      });
    }
    return { success: true, workoutId: workout?.id ?? null };
  }),
});
