"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, BrainCircuit, Dumbbell, Loader2, Plus, Search, Sparkles, X } from "lucide-react";
import { WORKOUT_CLIPS, type WorkoutClip } from "@/lib/workout-clips";
import type { PresetExercise, WorkoutPreset } from "../../food/scan-label/workout-analyzer-mode";

type RoutineItem = { id: string; clip: WorkoutClip; reps: number; restSeconds: number };
type EquipmentFilter = "All" | "Bodyweight" | "Dumbbell";
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
  biceps: "Biceps",
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
  const [equipment, setEquipment] = useState<EquipmentFilter>("All");
  const [showGenerator, setShowGenerator] = useState(false);
  const [generatorFocus, setGeneratorFocus] = useState("Full body");
  const [generating, setGenerating] = useState(false);
  const [generatorMessage, setGeneratorMessage] = useState("");
  const clips = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return WORKOUT_CLIPS.filter((clip) =>
      (muscle === "All" || clip.muscle === muscle) &&
      (equipment === "All" || (clip.equipment ?? "bodyweight") === equipment.toLowerCase()) &&
      (!normalizedQuery || clip.name.toLowerCase().includes(normalizedQuery) || clip.muscle.toLowerCase().includes(normalizedQuery))
    );
  }, [equipment, muscle, query]);

  const addClip = (clip: WorkoutClip) => {
    setRoutine((current) => [...current, { id: `${clip.id}-${Date.now()}`, clip, reps: defaultTarget(clip), restSeconds: 20 }]);
  };
  const updateItem = (id: string, change: Partial<Pick<RoutineItem, "reps" | "restSeconds">>) => {
    setRoutine((current) => current.map((item) => item.id === id ? { ...item, ...change } : item));
  };
  const createAiPlan = () => {
    const eligible = WORKOUT_CLIPS.filter((clip) =>
      (muscle === "All" || clip.muscle === muscle) &&
      (equipment === "All" || (clip.equipment ?? "bodyweight") === equipment.toLowerCase())
    );
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
  const generatePlan = async () => {
    setGenerating(true);
    setGeneratorMessage("");
    try {
      const response = await fetch("/api/workout/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ focus: generatorFocus }) });
      const result = await response.json() as { exercises?: Array<{ clipId: string; sets: number; reps: number; seconds?: number; restSeconds: number }>; rationale?: string; error?: string };
      if (!response.ok || !result.exercises) throw new Error(result.error || "Could not generate a workout.");
      const generated = result.exercises.flatMap((item) => {
        const clip = WORKOUT_CLIPS.find((entry) => entry.id === item.clipId);
        if (!clip) return [];
        return Array.from({ length: item.sets }, (_, setIndex) => ({ id: `ai-${clip.id}-${Date.now()}-${setIndex}`, clip, reps: isTimedClip(clip) ? (item.seconds ?? 30) : item.reps, restSeconds: item.restSeconds }));
      });
      setRoutine(generated);
      setGeneratorMessage(result.rationale || "Your plan is ready. You can edit every exercise before starting.");
      setShowGenerator(false);
    } catch (error) {
      setGeneratorMessage(error instanceof Error ? error.message : "Could not generate a workout.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-4 pb-28 sm:px-6">
      <header className="mb-6 flex items-start gap-3">
        <Link href="/hub/workout" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#DDE8E4] bg-white text-[#15483F] shadow-sm" aria-label="Back to workouts"><ArrowLeft className="h-5 w-5" /></Link>
        <div><h1 className="text-2xl font-black text-[#17201E]">Build a custom workout</h1><p className="mt-1 text-sm leading-5 text-[#6B7773]">Add exercises from FitNMove&apos;s workout clips, set reps and breaks, then train without a camera.</p></div>
      </header>

      <section className="relative isolate aspect-[16/9] overflow-hidden rounded-[24px] border border-[#35D39A]/70 bg-[#06251C] shadow-[0_14px_40px_rgba(7,55,40,0.22)]">
        <Image src="/images/aibanner.png" alt="" fill priority sizes="(max-width: 640px) 100vw, 900px" className="-z-10 object-contain" />
        <div className="absolute inset-x-0 bottom-0 flex justify-start p-2.5 sm:p-5"><button type="button" onClick={() => setShowGenerator(true)} className="inline-flex min-h-9 w-1/2 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#B8F34A] to-[#35D39A] px-2 text-xs font-black text-[#06251C] shadow-[0_8px_24px_rgba(53,211,154,0.25)] transition hover:brightness-110 sm:min-h-11 sm:w-auto sm:min-w-[220px] sm:gap-2 sm:px-4 sm:text-sm"><Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Generate plan <span className="text-base leading-none sm:text-lg">›</span></button></div>
      </section>

      {showGenerator && typeof document !== "undefined" ? createPortal(<div className="fixed inset-0 z-[9999] flex items-end justify-center bg-[#02120E]/75 p-3 backdrop-blur-md sm:items-center"><section className="relative w-full max-w-lg overflow-hidden rounded-[28px] border border-[#35D39A]/35 bg-[#0B2C24]/95 p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-6"><div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#20C7A4]/20 blur-3xl" /><div className="pointer-events-none absolute -bottom-24 -left-16 h-44 w-44 rounded-full bg-[#B8F34A]/10 blur-3xl" /><div className="relative flex items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#35D39A]">FitNMove Coach</p><h2 className="mt-1 text-2xl font-black tracking-tight text-[#F4F8F5]">What should we train today?</h2><p className="mt-2 text-sm leading-5 text-[#C0D1CA]">I&apos;ll review your profile and prepare a safe, practical routine from the clips in the app.</p></div><button type="button" onClick={() => setShowGenerator(false)} className="rounded-full border border-[#2A5D4E] bg-[#10372D]/80 px-3 py-2 text-sm font-bold text-[#C0D1CA] transition hover:border-[#35D39A] hover:text-white">Close</button></div><label className="relative mt-6 block text-sm font-black text-[#F4F8F5]">Body area to focus on<select value={generatorFocus} onChange={(event) => setGeneratorFocus(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-[#2A5D4E] bg-[#10372D] px-3 text-sm font-bold text-[#F4F8F5] outline-none focus:border-[#35D39A] focus:ring-2 focus:ring-[#35D39A]/20"><option className="bg-[#10372D]">Full body</option>{MUSCLE_FILTERS.filter((item) => item !== "All").map((item) => <option className="bg-[#10372D]" key={item}>{item}</option>)}</select></label><div className="relative mt-5 rounded-2xl border border-[#2A5D4E] bg-[#10372D]/70 p-4 text-sm text-[#C0D1CA] shadow-inner"><p className="font-black text-[#B8F34A]">Personalizing to your needs</p><p className="mt-1">Your gender, height, weight, goal, and activity level help shape the sets, reps, and rest.</p></div><button type="button" onClick={() => void generatePlan()} disabled={generating} className="relative mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#B8F34A] text-sm font-black text-[#10372D] shadow-[0_12px_30px_rgba(184,243,74,0.2)] transition hover:bg-[#D1FF77] disabled:cursor-wait disabled:opacity-60">{generating ? <><Loader2 className="h-4 w-4 animate-spin" /> Preparing your workout...</> : <><Sparkles className="h-4 w-4" /> Prepare workout plan</>}</button>{generatorMessage && <p className="relative mt-3 text-sm font-semibold text-[#FFB4A8]">{generatorMessage}</p>}</section></div>, document.body) : null}

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
        <div className="mt-3 flex gap-2">{(["All", "Bodyweight", "Dumbbell"] as EquipmentFilter[]).map((filter) => <button key={filter} type="button" onClick={() => setEquipment(filter)} className={`rounded-full px-3 py-2 text-xs font-black ${equipment === filter ? "bg-[#15483F] text-white" : "bg-[#F1F6F4] text-[#45615A]"}`}>{filter}</button>)}</div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{clips.map((clip) => <article key={clip.id} className="overflow-hidden rounded-2xl border border-[#DDE8E4]"><div className="relative"><video src={clip.src} muted playsInline preload="metadata" className="h-28 w-full bg-[#0C2821] object-cover" /><span aria-hidden="true" className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/45 px-1.5 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-white backdrop-blur-sm"><Image src="/icons/Logo.png" alt="" width={14} height={14} className="h-3.5 w-3.5 rounded-sm" />FitNMove</span></div><div className="p-3"><p className="font-black text-[#17201E]">{clip.name}</p><p className="mt-0.5 text-xs font-semibold text-[#6B7773]">{clip.muscle} · {clip.equipment === "dumbbell" ? "Dumbbell" : "Bodyweight"}</p><button type="button" onClick={() => addClip(clip)} className="mt-3 inline-flex min-h-9 items-center gap-1 rounded-full bg-[#EAF8F4] px-3 text-xs font-black text-[#15483F]"><Plus className="h-3.5 w-3.5" />Add to routine</button></div></article>)}</div>
      </section>
    </div>
  );
}
