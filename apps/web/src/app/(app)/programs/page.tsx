"use client";

import Link from "next/link";
import { Clock3, Dumbbell, Flame, ListChecks, Target, Trophy } from "lucide-react";
import { trpc } from "@/lib/trpc-client";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { LoginDialog } from "@/components/auth/login-dialog";
import type { WorkoutProgram } from "@/lib/workout-programs";
import { useEffect, useMemo, useState } from "react";

const difficulties = ["All", "Easy", "Medium", "Hard", "Elite"];
const difficultyBanners: Record<string, string> = {
  Easy: "/images/easy.png",
  Medium: "/images/medium.png",
  Hard: "/images/hard.png",
  Elite: "/images/elite.png",
};

export default function ProgramsPage() {
  const { isAuthenticated, showLoginDialog, setShowLoginDialog } = useAuthGuard();
  const { data, isLoading, isError } = trpc.workoutPrograms.listPublished.useQuery(undefined, { enabled: isAuthenticated });
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const programs = (mounted ? data ?? [] : []) as unknown as WorkoutProgram[];
  const [type, setType] = useState<"Calisthenics" | "Dumbbell">("Calisthenics");
  const [difficulty, setDifficulty] = useState("All");
  const filtered = useMemo(() => programs.filter((program) => program.programType === type && (difficulty === "All" || program.difficulty === difficulty)), [programs, type, difficulty]);

  return (
    <div className="relative space-y-5 overflow-hidden px-4 py-6 sm:px-6">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#20C7A4]/20 blur-3xl" />
      <div className="relative rounded-[28px] border border-[#DDE8E4] bg-[#F7FAF9] p-5 shadow-[0_18px_50px_rgba(21,72,63,0.10)] backdrop-blur-xl sm:p-7">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#20C7A4]">Train with intent</p>
        <h1 className="mt-1 text-3xl font-black text-[#17201E]">Workout programs</h1>
        <p className="mt-2 max-w-2xl text-sm text-[#6B7773]">Structured sessions with clear sets, rest, and progress from your FitNMove exercise library.</p>
      </div>
      <div className="relative flex flex-wrap gap-2 rounded-2xl border border-[#DDE8E4] bg-[#F7FAF9] p-2 shadow-[0_12px_30px_rgba(21,72,63,0.08)] backdrop-blur-xl">
        {["Calisthenics", "Dumbbell"].map((item) => <button key={item} onClick={() => setType(item as typeof type)} className={`!text-[#15483F] min-h-11 rounded-xl px-4 text-sm font-black transition ${type === item ? "bg-[#DDFBF2] shadow-sm" : "hover:bg-[#EDF8F4]"}`}>{item}</button>)}
      </div>
      <div className="relative flex gap-2 overflow-x-auto pb-1">
        {difficulties.map((item) => <button key={item} onClick={() => setDifficulty(item)} className={`!text-[#15483F] min-h-10 shrink-0 rounded-full border px-4 text-xs font-bold backdrop-blur ${difficulty === item ? "border-[#20C7A4] bg-[#DDFBF2]/90 shadow-sm" : "border-[#DDE8E4] bg-[#F7FAF9]"}`}>{item}</button>)}
      </div>
      {(!mounted || isLoading) && <div className="grid gap-4 sm:grid-cols-2"><div className="h-64 animate-pulse rounded-3xl bg-[#EAF1EE]" /><div className="h-64 animate-pulse rounded-3xl bg-[#EAF1EE]" /></div>}
      {mounted && isError && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Programs could not be loaded. Please try again.</div>}
      {mounted && !isLoading && !isError && filtered.length === 0 && <div className="rounded-3xl border border-dashed border-[#C9DCD5] bg-white p-10 text-center text-sm text-[#6B7773]">No published {difficulty === "All" ? "" : difficulty.toLowerCase()} {type.toLowerCase()} programs yet.</div>}
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((program) => <Link key={program.programId ?? program.slug} href={`/programs/${program.slug}`} className="group overflow-hidden rounded-3xl border border-[#DDE8E4] bg-[#F7FAF9] shadow-[0_15px_40px_rgba(21,72,63,0.10)] backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_50px_rgba(21,72,63,0.16)]">
          <div className="relative h-56 bg-[#173A33]"><img src={program.bannerImage || difficultyBanners[program.difficulty] || "/images/easy.png"} alt={`${program.difficulty} program`} loading="lazy" className="h-full w-full object-fill transition group-hover:scale-[1.02]" /><span className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1 text-xs font-black text-white backdrop-blur">{program.difficulty}</span></div>
          <div className="space-y-4 p-5"><div><h2 className="text-xl font-black text-[#17201E]">{program.name}</h2><p className="mt-1 line-clamp-2 text-sm text-[#6B7773]">{program.tagline}</p></div><div className="grid grid-cols-2 gap-2 text-xs font-semibold text-[#58716B]"><span><Clock3 className="mr-1 inline h-3.5 w-3.5" />{program.durationMin} min</span><span><ListChecks className="mr-1 inline h-3.5 w-3.5" />{program.exercises.length} exercises</span><span><Target className="mr-1 inline h-3.5 w-3.5" />{program.goal}</span><span><Dumbbell className="mr-1 inline h-3.5 w-3.5" />{program.equipment}</span></div><div className="flex flex-wrap gap-1.5">{program.muscles.slice(0, 4).map((muscle) => <span key={muscle} className="rounded-full border border-[#D8EEE6] bg-[#F0F7F4]/75 px-2.5 py-1 text-[11px] font-bold text-[#58716B]">{muscle}</span>)}</div><div className="flex items-center justify-between border-t border-white/70 pt-3 text-xs font-black text-[#15483F]"><span><Flame className="mr-1 inline h-3.5 w-3.5 text-[#20C7A4]" />{program.calories} kcal</span><span><Trophy className="mr-1 inline h-3.5 w-3.5 text-[#F0A44B]" />+{program.pointsReward} points</span></div></div>
        </Link>)}
      </div>
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </div>
  );
}



