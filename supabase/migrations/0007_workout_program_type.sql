alter table public.workout_programs
  add column if not exists program_type text not null default 'Calisthenics';
