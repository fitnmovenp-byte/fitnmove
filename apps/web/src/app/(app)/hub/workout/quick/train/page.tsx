"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { WorkoutAnalyzerMode, type WorkoutPreset } from "../../../food/scan-label/workout-analyzer-mode";

const ROUTINE_STORAGE_KEY = "fitnmove-custom-workout";

export default function CustomWorkoutTrainPage() {
  const [routine, setRoutine] = useState<WorkoutPreset | null | undefined>(undefined);

  useEffect(() => {
    const saved = sessionStorage.getItem(ROUTINE_STORAGE_KEY);
    if (!saved) {
      setRoutine(null);
      return;
    }
    try {
      setRoutine(JSON.parse(saved) as WorkoutPreset);
    } catch {
      setRoutine(null);
    }
  }, []);

  if (routine === undefined) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (!routine) return <div className="px-4 py-8"><p className="text-sm font-semibold text-muted-foreground">Your custom routine is no longer available.</p><Link href="/hub/workout/quick" className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Build a routine</Link></div>;

  return <div className="px-4 py-4"><Link href="/hub/workout/quick" className="mb-4 inline-flex h-11 items-center gap-2 rounded-full border border-[#DDE8E4] bg-white px-4 text-sm font-bold text-[#15483F] shadow-sm"><ArrowLeft className="h-4 w-4" /> Edit routine</Link><WorkoutAnalyzerMode experience="quick" initialPreset={routine} disableCamera /></div>;
}
