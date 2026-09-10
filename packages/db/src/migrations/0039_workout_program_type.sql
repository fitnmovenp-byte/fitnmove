ALTER TABLE "workout_programs"
  ADD COLUMN IF NOT EXISTS "program_type" varchar(30) NOT NULL DEFAULT 'Calisthenics';
