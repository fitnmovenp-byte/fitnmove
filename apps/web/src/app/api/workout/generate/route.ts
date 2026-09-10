import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { userProfiles, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { WORKOUT_CLIPS } from "@/lib/workout-clips";
import { checkAndIncrementAiUsage, resolveEffectivePlan } from "@/server/services/plan";

const planSchema = z.object({
  exercises: z.array(z.object({ clipId: z.string(), sets: z.number().int().min(1).max(5), reps: z.number().int().min(1).max(100), seconds: z.number().int().min(1).max(300).optional(), restSeconds: z.number().int().min(0).max(180).default(30) })).min(2).max(8),
  rationale: z.string().max(500).default("A balanced plan built around your selected focus.")
});

function jsonFrom(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  return JSON.parse(start >= 0 && end > start ? text.slice(start, end + 1) : text);
}

function buildFallbackPlan(focus: string) {
  const preferred = WORKOUT_CLIPS.filter((clip) => focus.toLowerCase() === "full body" || clip.muscle.toLowerCase() === focus.toLowerCase());
  const source = (preferred.length >= 2 ? preferred : WORKOUT_CLIPS).slice(0, 4);
  return {
    exercises: source.map((clip, index) => ({
      clipId: clip.id,
      sets: index === 0 ? 3 : 2,
      reps: /\bhold\b|plank|carry/i.test(clip.name) ? 30 : 10,
      ...(/\bhold\b|plank|carry/i.test(clip.name) ? { seconds: 30 } : {}),
      restSeconds: index === source.length - 1 ? 0 : 30,
    })),
    rationale: "Your plan is ready using FitNMove's available clips. Ollama was unavailable, so a balanced starter routine was prepared locally.",
  };
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return NextResponse.json({ error: "Sign in to generate a plan." }, { status: 401 });
  const user = await db.select({ plan: users.plan, planExpiresAt: users.planExpiresAt, trialExpiresAt: users.trialExpiresAt }).from(users).where(eq(users.id, session.user.id)).then((rows) => rows[0]);
  const usage = await checkAndIncrementAiUsage(session.user.id, "workout", resolveEffectivePlan(user ?? { plan: "free", planExpiresAt: null, trialExpiresAt: null }));
  if (!usage.allowed) return NextResponse.json({ error: `You have used all ${usage.limit} workout generations for today. Try again tomorrow.` }, { status: 429, headers: { "X-AI-Workout-Used": String(usage.used), "X-AI-Workout-Limit": String(usage.limit) } });
  const body = await request.json().catch(() => null) as { focus?: string } | null;
  const focus = body?.focus?.trim() || "Full body";
  const profile = await db.select({ sex: userProfiles.sex, heightCm: userProfiles.heightCm, weightKg: userProfiles.currentWeightKg, activityLevel: userProfiles.activityLevel, primaryGoal: userProfiles.primaryGoal }).from(userProfiles).where(eq(userProfiles.userId, session.user.id)).then((rows) => rows[0]).catch(() => null);
  const catalog = WORKOUT_CLIPS.map((clip) => ({ id: clip.id, name: clip.name, muscle: clip.muscle, equipment: clip.equipment ?? "bodyweight", exerciseKey: clip.exerciseKey ?? null }));
  const prompt = `Create a safe, realistic workout for a general wellness app. Focus area: ${focus}. User profile: gender=${profile?.sex ?? "not provided"}, heightCm=${profile?.heightCm ?? "not provided"}, weightKg=${profile?.weightKg ?? "not provided"}, activity=${profile?.activityLevel ?? "not provided"}, goal=${profile?.primaryGoal ?? "general fitness"}. Use only clip IDs from this catalog. Choose 2-8 exercises, 1-5 sets each, sensible reps for dynamic exercises, and seconds for holds. Return JSON only: {"exercises":[{"clipId":"...","sets":3,"reps":12,"seconds":30,"restSeconds":30}],"rationale":"..."}. For non-hold exercises omit seconds. Catalog: ${JSON.stringify(catalog)}`;
  try {
    const baseUrl = (process.env.OLLAMA_BASE_URL ?? "http://localhost:11434").replace(/\/$/, "");
    const apiUrl = baseUrl.endsWith("/api") ? `${baseUrl}/chat` : `${baseUrl}/api/chat`;
    const response = await fetch(apiUrl, { method: "POST", headers: { "Content-Type": "application/json", ...(process.env.OLLAMA_API_KEY ? { Authorization: `Bearer ${process.env.OLLAMA_API_KEY}` } : {}) }, body: JSON.stringify({ model: process.env.OLLAMA_MODEL ?? "gpt-oss:20b", stream: false, format: "json", options: { temperature: 0.35 }, messages: [{ role: "system", content: "You are FitNMove Coach. Return strict JSON only and never invent exercise IDs." }, { role: "user", content: prompt }] }) });
    if (!response.ok) {
      const details = await response.text();
      throw new Error(`Ollama returned ${response.status}: ${details.slice(0, 240)}`);
    }
    const result = await response.json() as { message?: { content?: string }; response?: string };
    const parsed = planSchema.parse(jsonFrom(result.message?.content ?? result.response ?? "{}"));
    const validIds = new Set(WORKOUT_CLIPS.map((clip) => clip.id));
    const exercises = parsed.exercises.filter((item) => validIds.has(item.clipId));
    if (exercises.length < 2) throw new Error("Ollama returned unavailable exercises.");
    return NextResponse.json({ ...parsed, exercises });
  } catch (error) {
    console.error("Workout plan generation failed", error);
    return NextResponse.json(buildFallbackPlan(focus));
  }
}
