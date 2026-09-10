alter table public.workouts
  add column if not exists program_id uuid references public.workout_programs(id) on delete set null,
  add column if not exists program_slug varchar(120),
  add column if not exists points_earned integer;
