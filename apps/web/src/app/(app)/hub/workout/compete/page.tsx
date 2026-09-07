"use client";

import Link from "next/link";
import { ArrowLeft, Camera } from "lucide-react";
import { WorkoutAnalyzerMode } from "../../food/scan-label/workout-analyzer-mode";

export default function CompetePage() {
  return (
    <div className="px-4 py-4">
      <header className="mb-4 flex items-start gap-3">
        <Link href="/hub/workout" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#DDE8E4] bg-white text-[#15483F] shadow-sm" aria-label="Back to workouts"><ArrowLeft className="h-5 w-5" /></Link>
        <div><div className="flex items-center gap-2"><Camera className="h-5 w-5 text-[#20C7A4]" /><h1 className="text-2xl font-black text-[#17201E]">Compete</h1></div><p className="mt-1 text-sm leading-5 text-[#6B7773]">Use camera verification for push-ups, squats, planks, and pull-ups.</p></div>
      </header>
      <WorkoutAnalyzerMode experience="quick" cameraOnly />
    </div>
  );
}
