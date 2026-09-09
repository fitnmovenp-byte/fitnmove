-- Run this in the Supabase SQL Editor if you are not applying Drizzle migrations.
CREATE TABLE IF NOT EXISTS public.workout_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug varchar(120) NOT NULL UNIQUE,
  name varchar(160) NOT NULL,
  tagline text NOT NULL,
  difficulty varchar(20) NOT NULL DEFAULT 'Beginner',
  duration_min integer NOT NULL,
  goal varchar(120) NOT NULL,
  equipment varchar(120) NOT NULL DEFAULT 'No Equipment',
  muscles jsonb NOT NULL DEFAULT '[]'::jsonb,
  calories integer NOT NULL DEFAULT 0,
  compatibility varchar(160) NOT NULL DEFAULT 'Manual or audio cue',
  banner_image text,
  points_reward integer NOT NULL DEFAULT 0,
  tags jsonb NOT NULL DEFAULT '[]'::jsonb,
  exercises jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
