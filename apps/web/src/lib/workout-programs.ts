import { getWorkoutClipForExercise, WORKOUT_CLIPS } from "@/lib/workout-clips";

export type ProgramExercise = {
  exercise_id?: string;
  name: string;
  order: number;
  sets: number;
  reps: number | null;
  duration_seconds: number | null;
  rest_seconds: number;
  reps_per_side: boolean;
};

export type WorkoutProgram = {
  programId: string;
  slug: string;
  id: string;
  name: string;
  displayName?: string;
  tagline: string;
  programType: "Calisthenics" | "Dumbbell" | string;
  difficulty: string;
  durationMin: number;
  goal: string;
  equipment: string;
  muscles: string[];
  calories: number;
  bannerImage: string | null;
  pointsReward: number;
  exercises: ProgramExercise[];
};

export function exerciseTarget(exercise: ProgramExercise) {
  if (exercise.duration_seconds != null) return `${exercise.duration_seconds} SEC`;
  return `${exercise.reps ?? 0} REPS${exercise.reps_per_side ? " / SIDE" : ""}`;
}

export function setTarget(exercise: ProgramExercise) {
  return `${exercise.sets} SETS × ${exerciseTarget(exercise)}`;
}

export function formatClock(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
}

export function mediaForExercise(exercise: ProgramExercise) {
  const byId = exercise.exercise_id ? WORKOUT_CLIPS.find((clip) => clip.id === exercise.exercise_id) : null;
  return byId?.src ?? getWorkoutClipForExercise(exercise.exercise_id, exercise.name)?.src ?? null;
}
