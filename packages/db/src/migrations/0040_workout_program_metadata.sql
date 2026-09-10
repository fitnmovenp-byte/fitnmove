ALTER TABLE "workouts"
  ADD COLUMN IF NOT EXISTS "program_id" uuid REFERENCES "workout_programs"("id") ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS "program_slug" varchar(120),
  ADD COLUMN IF NOT EXISTS "points_earned" integer;
