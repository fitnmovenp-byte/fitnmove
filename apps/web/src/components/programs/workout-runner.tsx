"use client";

import Link from "next/link";
import { ArrowLeft, Check, Pause, Play, SkipForward, Volume2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { trpc } from "@/lib/trpc-client";
import { exerciseTarget, formatClock, mediaForExercise, type WorkoutProgram } from "@/lib/workout-programs";

type Props = { program: WorkoutProgram };
type Session = { index: number; set: number; mode: "active" | "rest" | "done"; rest: number; timeLeft: number; startedAt: number; elapsed: number; paused: boolean; completedSets: number };

export function WorkoutRunner({ program }: Props) {
  const router = useRouter();
  const key = `fitnmove_program_session_${program.programId}`;
  const exercises = useMemo(() => [...program.exercises].sort((a, b) => a.order - b.order), [program.exercises]);
  const [session, setSession] = useState<Session>(() => ({ index: 0, set: 1, mode: "active", rest: 0, timeLeft: exercises[0]?.duration_seconds ?? 0, startedAt: Date.now(), elapsed: 0, paused: false, completedSets: 0 }));
  const [saving, setSaving] = useState(false);
  const [trackingMode, setTrackingMode] = useState<"manual" | "audio">("manual");
  const [modeSelected, setModeSelected] = useState(false);
  const completedRef = useRef(false);
  const transitionRef = useRef(false);
  const lastTickRef = useRef(Date.now());
  const current = exercises[session.index];
  const next = exercises[session.index + 1];
  const totalSets = exercises.reduce((sum, item) => sum + item.sets, 0);

  useEffect(() => {
    try { const stored = localStorage.getItem(key); if (stored) { const parsed = JSON.parse(stored) as Partial<Session>; setSession((value) => ({ ...value, ...parsed, timeLeft: parsed.timeLeft ?? value.timeLeft })); } } catch { /* ignore malformed local state */ }
  }, [key]);
  useEffect(() => {
    const savedMode = localStorage.getItem(`${key}_mode`);
    if (savedMode === "manual" || savedMode === "audio") { setTrackingMode(savedMode); setModeSelected(true); }
  }, [key]);
  useEffect(() => { localStorage.setItem(key, JSON.stringify(session)); }, [key, session]);
  useEffect(() => {
    if (session.paused || session.mode === "done") return;
    lastTickRef.current = Date.now();
    const timer = window.setInterval(() => {
      const now = Date.now();
      const delta = Math.max(1, Math.min(10, Math.floor((now - lastTickRef.current) / 1000)));
      lastTickRef.current = now;
      setSession((value) => ({ ...value, elapsed: Math.max(value.elapsed, Math.floor((now - value.startedAt) / 1000)), ...(value.mode === "rest" ? { rest: Math.max(0, value.rest - delta) } : {}) }));
      if (session.mode === "active" && current?.duration_seconds) setSession((value) => ({ ...value, timeLeft: Math.max(0, value.timeLeft - delta) }));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [current?.duration_seconds, session.mode, session.paused]);

  const completeMutation = trpc.workoutPrograms.complete.useMutation({ onSuccess: () => { localStorage.removeItem(key); setSaving(false); } });
  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setSaving(true);
    setSession((value) => ({ ...value, mode: "done" }));
    completeMutation.mutate({ programId: program.programId, programName: program.name, programSlug: program.slug, durationSeconds: Math.max(1, Math.floor((Date.now() - session.startedAt) / 1000)), pointsEarned: program.pointsReward, totalSets });
  }, [completeMutation, program, session.startedAt, totalSets]);

  const advance = useCallback(() => {
    transitionRef.current = false;
    if (!current) return;
    if (session.set < current.sets) { setSession((value) => ({ ...value, set: value.set + 1, mode: "active", rest: 0, paused: false, timeLeft: current.duration_seconds ?? 0 })); return; }
    if (session.index < exercises.length - 1) { const upcoming = exercises[session.index + 1]; setSession((value) => ({ ...value, index: value.index + 1, set: 1, mode: "active", rest: 0, paused: false, timeLeft: upcoming.duration_seconds ?? 0 })); return; }
    finish();
  }, [current, exercises.length, finish, session.index, session.set]);
  const completeSet = useCallback(() => {
    if (transitionRef.current || !current) return;
    transitionRef.current = true;
    setSession((value) => ({ ...value, completedSets: value.completedSets + 1 }));
    if (current.rest_seconds > 0 && !(session.index === exercises.length - 1 && session.set === current.sets)) {
      setSession((value) => ({ ...value, mode: "rest", rest: current.rest_seconds, paused: false }));
      transitionRef.current = false;
    } else advance();
  }, [advance, current, exercises.length, session.index, session.set]);
  useEffect(() => { if (session.mode === "active" && current?.duration_seconds && session.timeLeft === 0) completeSet(); }, [completeSet, current?.duration_seconds, session.mode, session.timeLeft]);
  useEffect(() => { if (session.mode === "rest" && session.rest <= 0) advance(); }, [advance, session.mode, session.rest]);
  useEffect(() => {
    if (trackingMode !== "audio" || session.mode !== "active" || session.paused || !current || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const message = current.duration_seconds != null
      ? `${current.name}. Hold for ${current.duration_seconds} seconds. Set ${session.set} of ${current.sets}.`
      : `${current.name}. ${exerciseTarget(current)}. Set ${session.set} of ${current.sets}.`;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(message));
    return () => window.speechSynthesis.cancel();
  }, [current, session.mode, session.paused, session.set, trackingMode]);

  if (!current && session.mode !== "done") return <div className="p-6 text-center">This program has no exercises.</div>;
  if (!modeSelected) return <div className="relative flex min-h-[calc(100vh-9rem)] items-center justify-center overflow-hidden px-4 py-8"><div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-[#20C7A4]/20 blur-3xl" /><div className="relative w-full max-w-lg rounded-[30px] border border-[#DDE8E4] bg-[#F7FAF9] p-6 shadow-[0_24px_70px_rgba(21,72,63,0.15)] backdrop-blur-2xl sm:p-8"><div className="mb-6 flex items-center gap-3"><Link href={`/programs/${program.slug}`} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DDE8E4] bg-[#F7FAF9] text-[#15483F]"><ArrowLeft className="h-4 w-4" /></Link><div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#20A88A]">Ready when you are</p><h1 className="text-2xl font-black text-[#17201E]">{program.name}</h1></div></div><p className="text-sm text-[#6B7773]">Choose how you want to follow this program. Camera tracking is not used here.</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><button onClick={() => { setTrackingMode("manual"); localStorage.setItem(`${key}_mode`, "manual"); setModeSelected(true); }} className="rounded-2xl border border-[#DDE8E4] bg-[#F7FAF9] p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#20C7A4]"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E3F8F1] text-[#15483F]"><Check className="h-5 w-5" /></span><span className="mt-4 block font-black text-[#17201E]">Manual Mode</span><span className="mt-1 block text-xs leading-5 text-[#6B7773]">Tap complete set when you finish.</span></button><button onClick={() => { setTrackingMode("audio"); localStorage.setItem(`${key}_mode`, "audio"); setModeSelected(true); }} className="rounded-2xl border border-[#DDE8E4] bg-[#F7FAF9] p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#20C7A4]"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E3F8F1] text-[#15483F]"><Volume2 className="h-5 w-5" /></span><span className="mt-4 block font-black text-[#17201E]">Audio Cue Mode</span><span className="mt-1 block text-xs leading-5 text-[#6B7773]">Hear exercise, set, and target cues.</span></button></div></div></div>;
  if (session.mode === "done") return <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-5 py-8 text-center"><div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#DDFBF2] text-[#15483F]"><Check className="h-10 w-10" /></div><p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-[#20A88A]">Workout complete</p><h1 className="mt-2 text-3xl font-black text-[#17201E]">{program.name}</h1><p className="mt-4 text-4xl font-black tabular-nums text-[#15483F]">{formatClock(session.elapsed)}</p><p className="mt-2 text-sm text-[#6B7773]">{session.completedSets} sets completed · {program.calories} kcal estimated</p><p className="mt-4 text-xl font-black text-[#20A88A]">+{program.pointsReward} POINTS</p><Link href="/hub/workout" className="mt-8 flex min-h-14 items-center justify-center rounded-2xl bg-[#15483F] px-5 font-black text-white">DONE</Link>{saving && <p className="mt-3 text-xs text-[#6B7773]">Saving workout…</p>}</div>;

  const isRest = session.mode === "rest";
  const progress = Math.round((session.completedSets / Math.max(1, totalSets)) * 100);
  return <div className="relative min-h-[calc(100vh-8rem)] overflow-hidden px-4 py-4 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:px-6"><div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#20C7A4]/15 blur-3xl" /><div className="relative mx-auto max-w-2xl"><div className="flex items-center justify-between rounded-2xl border border-[#DDE8E4] bg-[#F7FAF9] px-3 py-2 shadow-sm backdrop-blur-xl"><button onClick={() => { if (window.confirm("Quit this workout? Your current progress will be cleared.")) { localStorage.removeItem(key); localStorage.removeItem(`${key}_mode`); router.back(); } }} className="flex min-h-11 items-center gap-2 text-sm font-black text-[#58716B]"><X className="h-5 w-5" /> Quit</button><span className="text-xs font-black uppercase tracking-wider text-[#6B7773]">{program.name} · {trackingMode === "audio" ? "Audio Cue" : "Manual"}</span><button onClick={() => setSession((value) => ({ ...value, paused: !value.paused }))} className="flex h-11 w-11 items-center justify-center rounded-full border border-[#DDE8E4] bg-[#F7FAF9] text-[#15483F]" aria-label={session.paused ? "Resume" : "Pause"}>{session.paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}</button></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-[#F7FAF9]"><div className="h-full rounded-full bg-[#20C7A4] transition-all" style={{ width: `${progress}%` }} /></div><div className="mt-2 flex justify-between text-xs font-bold text-[#6B7773]"><span>Exercise {session.index + 1} of {exercises.length}</span><span>{session.completedSets} / {totalSets} sets</span></div>{isRest ? <div className="mt-12 rounded-3xl border border-[#DDE8E4] bg-[#F7FAF9] p-7 text-center shadow-[0_18px_50px_rgba(21,72,63,0.10)] backdrop-blur-xl"><p className="text-xs font-black uppercase tracking-[0.22em] text-[#20A88A]">Rest</p><p className="mt-4 text-6xl font-black tabular-nums text-[#15483F]">{formatClock(session.rest)}</p><p className="mt-5 text-sm font-bold text-[#6B7773]">Next: {current.name}<br />{exerciseTarget(current)}</p><button onClick={() => setSession((value) => ({ ...value, paused: !value.paused }))} className="mx-auto mt-5 flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#DDE8E4] bg-white px-5 text-sm font-black text-[#15483F]">{session.paused ? <><Play className="h-4 w-4" /> RESUME</> : <><Pause className="h-4 w-4" /> PAUSE</>}</button><button onClick={advance} className="mt-7 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#15483F] font-black text-white"><SkipForward className="h-5 w-5" /> SKIP REST</button></div> : <div className="mt-7 space-y-5"><div className="overflow-hidden rounded-3xl border border-white/80 bg-[#102C27] shadow-[0_20px_60px_rgba(21,72,63,0.18)]">{mediaForExercise(current) ? <video key={mediaForExercise(current)} src={mediaForExercise(current) ?? undefined} className="aspect-video w-full object-cover" muted playsInline autoPlay loop preload="metadata" /> : <div className="flex aspect-video items-center justify-center px-8 text-center text-2xl font-black text-white">{current.name}</div>}<div className="p-5 text-white"><p className="text-xs font-black uppercase tracking-wider text-[#7DE8CA]">Set {session.set} of {current.sets}</p><h1 className="mt-1 text-3xl font-black">{current.name}</h1><p className="mt-3 text-lg font-black">{current.duration_seconds != null ? formatClock(session.timeLeft) : exerciseTarget(current)}</p></div></div><button onClick={() => { if (current.duration_seconds != null) setSession((value) => ({ ...value, paused: !value.paused })); else completeSet(); }} className="flex min-h-16 w-full items-center justify-center gap-2 rounded-2xl bg-[#20C7A4] text-lg font-black text-[#073B32] shadow-lg shadow-[#20C7A4]/20">{session.paused ? <><Play className="h-5 w-5 fill-current" /> RESUME</> : current.duration_seconds != null ? <><Pause className="h-5 w-5" /> PAUSE TIMER</> : <><Check className="h-5 w-5" /> COMPLETE SET</>}</button><div className="rounded-2xl border border-[#DDE8E4] bg-[#F7FAF9] p-4 text-sm text-[#6B7773] shadow-sm backdrop-blur-xl"><span className="font-black text-[#17201E]">Next</span>{next ? ` · ${next.name} · ${exerciseTarget(next)}` : " · Finish"}</div></div>}</div></div>;
}




