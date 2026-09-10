"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { trpc } from "@/lib/trpc-client";
import type { WorkoutProgram } from "@/lib/workout-programs";
import { WorkoutRunner } from "@/components/programs/workout-runner";

export default function ProgramWorkoutPage() {
  const params = useParams<{ slug: string }>();
  const { data, isLoading, isError } = trpc.workoutPrograms.getBySlug.useQuery({ slug: params.slug });
  const program = data as unknown as WorkoutProgram | null | undefined;
  if (isLoading) return <div className="p-6"><div className="h-96 animate-pulse rounded-3xl bg-[#EAF1EE]" /></div>;
  if (isError || !program) return <div className="p-10 text-center"><p className="font-black">Program not found</p><Link href="/programs" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#15483F]"><ArrowLeft className="h-4 w-4" /> Back to programs</Link></div>;
  return <WorkoutRunner program={program} />;
}
