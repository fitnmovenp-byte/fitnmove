import { z } from "zod";
import { asc, desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../trpc";
import { users, workoutPrograms } from "@/server/db/schema";

const exerciseSchema = z.object({
  label: z.string().min(1).max(120),
  exercise: z.string().max(40).optional(),
  clipSrc: z.string().max(500).optional(),
  sets: z.number().int().min(1).max(20),
  reps: z.number().int().min(1).max(1000).optional(),
  seconds: z.number().int().min(1).max(7200).optional(),
  restSeconds: z.number().int().min(0).max(1800).optional(),
  tracking: z.enum(["timer", "manual"]),
}).refine((exercise) => Boolean(exercise.reps || exercise.seconds), "Set reps or seconds.");

const programSchema = z.object({
  slug: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens."),
  name: z.string().min(2).max(160),
  tagline: z.string().min(2).max(500),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
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
    exercises: program.exercises.map((exercise) => ({ ...exercise, exercise: exercise.exercise as never })),
  };
}

export const workoutProgramsRouter = router({
  listPublished: protectedProcedure.query(async ({ ctx }) => {
    const programs = await ctx.db.select().from(workoutPrograms).where(eq(workoutPrograms.isPublished, true)).orderBy(asc(workoutPrograms.sortOrder), desc(workoutPrograms.createdAt));
    return programs.map(toClientProgram);
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
});
