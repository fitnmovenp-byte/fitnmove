"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, BrainCircuit, Dumbbell, Plus, Search, Sparkles, X } from "lucide-react";
import { WORKOUT_CLIPS, type WorkoutClip } from "@/lib/workout-clips";
import type { PresetExercise, WorkoutPreset } from "../../food/scan-label/workout-analyzer-mode";

type RoutineItem = { id: string; clip: WorkoutClip; reps: number; restSeconds: number };
const ROUTINE_STORAGE_KEY = "fitnmove-custom-workout";
const MUSCLE_FILTERS = ["All", ...Array.from(new Set(WORKOUT_CLIPS.map((clip) => clip.muscle))).sort()];
const TIMED_EXERCISE_KEYS = new Set(["plank", "wallSit", "sidePlank"]);
const MUSCLE_FILTER_ALIASES: Record<string, string> = {
  "upper-abs": "Abs",
  "lower-abs": "Abs",
  "upper-chest": "Chest",
  "lower-chest": "Chest",
  gluteal: "Glutes",
  deltoids: "Shoulder",
  "front-deltoid": "Shoulder",
  "rear-deltoid": "Shoulder",
  hamstring: "Hamstrings",
  forearm: "Forearms",
  "upper-back": "Upper back",
  "lower-back": "Lower back",
  trapezius: "Upper back",
  "upper-trapezius": "Upper back",
  "lower-trapezius": "Upper back",
  rhomboids: "Upper back",
  biceps: "Forearms",
};

function isTimedClip(clip: WorkoutClip) {
  return Boolean(clip.exerciseKey && TIMED_EXERCISE_KEYS.has(clip.exerciseKey)) || /\bhold\b/i.test(clip.name);
}

function defaultTarget(clip: WorkoutClip) {
  return isTimedClip(clip) ? 30 : 12;
}

function toPreset(items: RoutineItem[]): WorkoutPreset {
  const exercises: PresetExercise[] = items.map((item) => {
    const timed = isTimedClip(item.clip);
    return {
      label: item.clip.name,
      exercise: (item.clip.exerciseKey ?? "plank") as PresetExercise["exercise"],
      clipSrc: item.clip.src,
      sets: 1,
      ...(timed ? { seconds: item.reps, tracking: "timer" as const } : { reps: item.reps, tracking: "manual" as const }),
      restSeconds: item.restSeconds,
    };
  });
  return {
    id: `custom-${Date.now()}`,
    name: "Custom workout",
    displayName: "Custom workout",
    tagline: "Your clip-based routine",
    difficulty: "Beginner",
    durationMin: Math.max(1, Math.ceil(items.length * 2 + items.reduce((total, item) => total + item.restSeconds, 0) / 60)),
    goal: "Custom routine",
    equipment: "Bodyweight",
    muscles: Array.from(new Set(items.map((item) => item.clip.muscle))),
    calories: 0,
    compatibility: "Manual or audio cue",
    thumbnail: "/Workout/leaderboard-banner.png",
    pointsReward: 0,
    tags: ["Custom"],
    exercises,
  };
}

export default function QuickWorkoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [muscle, setMuscle] = useState(() => {
    const requested = searchParams.get("muscle")?.toLowerCase() ?? "";
    const filter = MUSCLE_FILTER_ALIASES[requested] ?? MUSCLE_FILTERS.find((item) => item.toLowerCase() === requested);
    return filter && MUSCLE_FILTERS.includes(filter) ? filter : "All";
  });
  const [routine, setRoutine] = useState<RoutineItem[]>([]);
  const clips = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return WORKOUT_CLIPS.filter((clip) =>
      (muscle === "All" || clip.muscle === muscle) &&
      (!normalizedQuery || clip.name.toLowerCase().includes(normalizedQuery) || clip.muscle.toLowerCase().includes(normalizedQuery))
    );
  }, [muscle, query]);

  const addClip = (clip: WorkoutClip) => {
    setRoutine((current) => [...current, { id: `${clip.id}-${Date.now()}`, clip, reps: defaultTarget(clip), restSeconds: 20 }]);
  };
  const updateItem = (id: string, change: Partial<Pick<RoutineItem, "reps" | "restSeconds">>) => {
    setRoutine((current) => current.map((item) => item.id === id ? { ...item, ...change } : item));
  };
  const createAiPlan = () => {
    const eligible = WORKOUT_CLIPS.filter((clip) => muscle === "All" || clip.muscle === muscle);
    setRoutine(eligible.slice(0, 4).map((clip, index) => ({
      id: `plan-${clip.id}-${Date.now()}-${index}`,
      clip,
      reps: isTimedClip(clip) ? 30 : index === 0 ? 12 : 10,
      restSeconds: index === 3 ? 0 : 20,
    })));
  };
  const startRoutine = () => {
    if (!routine.length) return;
    sessionStorage.setItem(ROUTINE_STORAGE_KEY, JSON.stringify(toPreset(routine)));
    router.push("/hub/workout/quick/train");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-4 pb-28 sm:px-6">
      <header className="mb-6 flex items-start gap-3">
        <Link href="/hub/workout" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#DDE8E4] bg-white text-[#15483F] shadow-sm" aria-label="Back to workouts"><ArrowLeft className="h-5 w-5" /></Link>
        <div><h1 className="text-2xl font-black text-[#17201E]">Build a custom workout</h1><p className="mt-1 text-sm leading-5 text-[#6B7773]">Add exercises from FitNMove&apos;s workout clips, set reps and breaks, then train without a camera.</p></div>
      </header>

      <section className="rounded-[24px] border border-[#CFECE4] bg-[#F7FAF9] p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex items-center gap-2 text-[#15483F]"><BrainCircuit className="h-5 w-5" /><h2 className="font-black">Smart Workout Plan</h2></div><p className="mt-1 text-sm text-[#6B7773]">Create a balanced routine from clips in your selected focus area.</p></div><button type="button" onClick={createAiPlan} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#15483F] px-4 text-sm font-black text-white"><Sparkles className="h-4 w-4" /> Generate plan</button></div>
      </section>

      <section className="mt-5 rounded-[24px] border border-[#DDE8E4] bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-center justify-between gap-3"><div><h2 className="font-black text-[#17201E]">Your routine</h2><p className="mt-1 text-sm text-[#6B7773]">Each break runs after its exercise.</p></div><span className="rounded-full bg-[#EAF8F4] px-3 py-1 text-xs font-black text-[#15483F]">{routine.length} exercises</span></div>
        {routine.length ? <ol className="mt-4 space-y-3">{routine.map((item, index) => <li key={item.id} className="rounded-2xl border border-[#DDE8E4] bg-[#F7FAF9] p-3"><div className="flex items-start gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#15483F] text-xs font-black text-white">{index + 1}</span><div className="min-w-0 flex-1"><p className="break-words font-black text-[#17201E]">{item.clip.name}</p><p className="text-xs font-semibold text-[#6B7773]">{item.clip.muscle}</p></div><button type="button" onClick={() => setRoutine((current) => current.filter((entry) => entry.id !== item.id))} className="p-1 text-[#6B7773]" aria-label={`Remove ${item.clip.name}`}><X className="h-4 w-4" /></button></div><div className="mt-3 grid grid-cols-2 gap-2"><label className="text-xs font-bold text-[#6B7773]">{isTimedClip(item.clip) ? "Hold (seconds)" : "Reps"}<input type="number" min="1" value={item.reps} onChange={(event) => updateItem(item.id, { reps: Math.max(1, Number(event.target.value) || 1) })} className="mt-1 h-10 w-full rounded-xl border border-[#DDE8E4] bg-white px-3 font-black text-[#17201E]" /></label><label className="text-xs font-bold text-[#6B7773]">Break (seconds)<input type="number" min="0" value={item.restSeconds} onChange={(event) => updateItem(item.id, { restSeconds: Math.max(0, Number(event.target.value) || 0) })} className="mt-1 h-10 w-full rounded-xl border border-[#DDE8E4] bg-white px-3 font-black text-[#17201E]" /></label></div></li>)}</ol> : <p className="mt-4 rounded-2xl bg-[#F7FAF9] px-4 py-5 text-sm font-semibold text-[#6B7773]">Search the clip library below, or generate a plan to get started.</p>}
      </section>

      {routine.length > 0 && (
        <button
          type="button"
          onClick={startRoutine}
          className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#15483F] px-6 text-sm font-black text-white shadow-sm"
        >
          <Dumbbell className="h-4 w-4" />
          Start workout
        </button>
      )}

      <section className="mt-5 rounded-[24px] border border-[#DDE8E4] bg-white p-4 shadow-sm sm:p-5">
        <h2 className="font-black text-[#17201E]">Workout clip library</h2>
        <div className="mt-3 flex h-11 items-center gap-2 rounded-xl border border-[#DDE8E4] px-3"><Search className="h-4 w-4 text-[#6B7773]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search exercises" className="min-w-0 flex-1 bg-transparent text-sm outline-none" /></div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">{MUSCLE_FILTERS.map((filter) => <button key={filter} type="button" onClick={() => setMuscle(filter)} className={`shrink-0 rounded-full px-3 py-2 text-xs font-black ${muscle === filter ? "bg-[#15483F] text-white" : "bg-[#F1F6F4] text-[#45615A]"}`}>{filter}</button>)}</div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{clips.map((clip) => <article key={clip.id} className="overflow-hidden rounded-2xl border border-[#DDE8E4]"><video src={clip.src} muted playsInline preload="metadata" className="h-28 w-full bg-[#0C2821] object-cover" /><div className="p-3"><p className="font-black text-[#17201E]">{clip.name}</p><p className="mt-0.5 text-xs font-semibold text-[#6B7773]">{clip.muscle}</p><button type="button" onClick={() => addClip(clip)} className="mt-3 inline-flex min-h-9 items-center gap-1 rounded-full bg-[#EAF8F4] px-3 text-xs font-black text-[#15483F]"><Plus className="h-3.5 w-3.5" />Add to routine</button></div></article>)}</div>
      </section>
    </div>
  );
}
