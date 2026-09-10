"use client";

import Link from "next/link";
import { ArrowLeft, Clock3, Dumbbell, Flame, Play, Trophy } from "lucide-react";
import { useParams } from "next/navigation";
import { trpc } from "@/lib/trpc-client";
import type { WorkoutProgram } from "@/lib/workout-programs";
import { exerciseTarget, setTarget } from "@/lib/workout-programs";

const difficultyBanners: Record<string, string> = { Easy: "/images/easy.png", Medium: "/images/medium.png", Hard: "/images/hard.png", Elite: "/images/elite.png" };

export default function ProgramDetailPage() {
  const params = useParams<{ slug: string }>();
  const { data, isLoading, isError } = trpc.workoutPrograms.getBySlug.useQuery({ slug: params.slug });
  const program = data as unknown as WorkoutProgram | null | undefined;
  if (isLoading) return <div className="space-y-4 px-4 py-6"><div className="h-60 animate-pulse rounded-3xl bg-[#EAF1EE]" /><div className="h-80 animate-pulse rounded-3xl bg-[#EAF1EE]" /></div>;
  if (isError || !program) return <div className="px-4 py-16 text-center"><p className="text-lg font-black text-[#17201E]">Program not found</p><Link href="/programs" className="mt-4 inline-flex rounded-full bg-[#15483F] px-5 py-3 text-sm font-black text-white">Back to programs</Link></div>;
  return <div className="relative space-y-5 overflow-hidden px-4 py-6 sm:px-6"><div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#20C7A4]/20 blur-3xl" /><Link href="/programs" className="relative inline-flex min-h-11 items-center gap-2 rounded-full border border-[#DDE8E4] bg-[#F7FAF9] px-4 text-sm font-black text-[#15483F] shadow-sm backdrop-blur-xl"><ArrowLeft className="h-4 w-4" /> All programs</Link><div className="relative overflow-hidden rounded-[30px] border border-[#DDE8E4] bg-[#F7FAF9] shadow-[0_20px_60px_rgba(21,72,63,0.12)] backdrop-blur-xl"><div className="relative h-72 bg-[#15483F] sm:h-96"><img src={program.bannerImage || difficultyBanners[program.difficulty] || "/images/easy.png"} alt={`${program.difficulty} program`} className="h-full w-full object-fill" /><span className="absolute left-5 top-5 rounded-full border border-white/30 bg-black/35 px-3 py-1 text-xs font-black text-white backdrop-blur">{program.programType} · {program.difficulty}</span></div><div className="space-y-5 p-5 sm:p-7"><div><h1 className="text-3xl font-black text-[#17201E]">{program.name}</h1><p className="mt-2 text-[#6B7773]">{program.tagline}</p></div><div className="grid grid-cols-2 gap-3 text-sm text-[#58716B] sm:grid-cols-4"><span><Clock3 className="mr-1 inline h-4 w-4 text-[#20A88A]" />{program.durationMin} min</span><span><Dumbbell className="mr-1 inline h-4 w-4 text-[#20A88A]" />{program.equipment}</span><span><Flame className="mr-1 inline h-4 w-4 text-[#20A88A]" />{program.calories} kcal</span><span><Trophy className="mr-1 inline h-4 w-4 text-[#F0A44B]" />+{program.pointsReward}</span></div><div className="flex flex-wrap gap-2">{program.muscles.map((muscle) => <span key={muscle} className="rounded-full border border-[#D8EEE6] bg-[#EFF8F4]/70 px-3 py-1 text-xs font-bold text-[#15483F]">{muscle}</span>)}</div><div className="space-y-3"><h2 className="text-lg font-black text-[#17201E]">Exercises</h2>{[...program.exercises].sort((a,b) => a.order - b.order).map((exercise, index) => <div key={`${exercise.exercise_id ?? exercise.name}-${index}`} className="rounded-2xl border border-[#DDE8E4] bg-[#F7FAF9] p-4 shadow-sm backdrop-blur"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-wider text-[#20A88A]">{index + 1}</p><h3 className="mt-1 font-black text-[#17201E]">{exercise.name}</h3></div><span className="rounded-full border border-[#D8EEE6] bg-white px-3 py-1 text-xs font-black text-[#15483F]">{setTarget(exercise)}</span></div><p className="mt-2 text-xs font-semibold text-[#6B7773]">{exercise.duration_seconds != null ? `Hold for ${exercise.duration_seconds} seconds` : exerciseTarget(exercise)} · {exercise.rest_seconds}s rest</p></div>)}</div><Link href={`/programs/${program.slug}/workout`} className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#20C7A4] px-5 text-base font-black text-[#073B32] shadow-lg shadow-[#20C7A4]/25 transition hover:bg-[#65E8C8]"><Play className="h-5 w-5 fill-current" /> START WORKOUT</Link></div></div></div>;
}





