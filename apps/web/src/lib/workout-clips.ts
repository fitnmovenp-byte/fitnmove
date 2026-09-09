export type WorkoutClip = {
  id: string;
  name: string;
  muscle: string;
  exerciseKey?: string;
  src: string;
  equipment?: "bodyweight" | "dumbbell";
};

const CLIP_BASE = "/Workout/workoutclips";

const BODYWEIGHT_WORKOUT_CLIPS: WorkoutClip[] = [
  { id: "crunch", name: "Crunch", muscle: "Abs", exerciseKey: "crunch", src: `${CLIP_BASE}/Abs/Crunch.mp4` },
  { id: "hollow-hold", name: "Hollow hold", muscle: "Abs", exerciseKey: "plank", src: `${CLIP_BASE}/Abs/hollowhold.mp4` },
  { id: "leg-raises", name: "Leg raises", muscle: "Abs", exerciseKey: "legRaise", src: `${CLIP_BASE}/Abs/Legraises.mp4` },
  { id: "plank", name: "Plank", muscle: "Abs", exerciseKey: "plank", src: `${CLIP_BASE}/Abs/plank.mp4` },
  { id: "situps", name: "Sit-ups", muscle: "Abs", exerciseKey: "situp", src: `${CLIP_BASE}/Abs/Situps.mp4` },
  { id: "toe-touch", name: "Toe touch", muscle: "Abs", exerciseKey: "crunch", src: `${CLIP_BASE}/Abs/Toetouch.mp4` },
  { id: "lateral-lunge", name: "Lateral lunge", muscle: "Adductors", exerciseKey: "forwardLunge", src: `${CLIP_BASE}/Adductors/laterallunge.mp4` },
  { id: "side-lying-leg-raise", name: "Side lying leg raise", muscle: "Adductors", exerciseKey: "legRaise", src: `${CLIP_BASE}/Adductors/sidelyinglegraise.mp4` },
  { id: "calf-pulses", name: "Calf pulses", muscle: "Calves", exerciseKey: "calfRaise", src: `${CLIP_BASE}/Calves/calfpulses.mp4` },
  { id: "pogo-jumps", name: "Pogo jumps", muscle: "Calves", exerciseKey: "squatJump", src: `${CLIP_BASE}/Calves/pogojumps.mp4` },
  { id: "single-leg-calf-raise", name: "Single leg calf raise", muscle: "Calves", exerciseKey: "calfRaise", src: `${CLIP_BASE}/Calves/singlelegcalfraise.mp4` },
  { id: "standing-calf-raise", name: "Standing calf raise", muscle: "Calves", exerciseKey: "calfRaise", src: `${CLIP_BASE}/Calves/standingcalfraise.mp4` },
  { id: "diamond-pushup", name: "Diamond push-up", muscle: "Chest", exerciseKey: "pushup", src: `${CLIP_BASE}/Chest/diamondpushup.mp4` },
  { id: "hindu-pushup", name: "Hindu push-up", muscle: "Chest", exerciseKey: "pushup", src: `${CLIP_BASE}/Chest/hindupushup.mp4` },
  { id: "pike-pushup", name: "Pike push-up", muscle: "Chest", exerciseKey: "pushup", src: `${CLIP_BASE}/Chest/pikepushup.mp4` },
  { id: "plyometric-pushup", name: "Plyometric push-up", muscle: "Chest", exerciseKey: "pushup", src: `${CLIP_BASE}/Chest/polymetricpushup.mp4` },
  { id: "pushup", name: "Push-up", muscle: "Chest", exerciseKey: "pushup", src: `${CLIP_BASE}/Chest/pushup.mp4` },
  { id: "shoulder-tap-chest", name: "Shoulder tap", muscle: "Chest", exerciseKey: "shoulderTaps", src: `${CLIP_BASE}/Chest/shouldertap.mp4` },
  { id: "fingertip-plank", name: "Fingertip plank", muscle: "Forearms", exerciseKey: "plank", src: `${CLIP_BASE}/Forearms/Finertipplank.mp4` },
  { id: "knuckle-pushups", name: "Knuckle push-ups", muscle: "Forearms", exerciseKey: "pushup", src: `${CLIP_BASE}/Forearms/knucklepushups.mp4` },
  { id: "donkey-kick", name: "Donkey kick", muscle: "Glutes", exerciseKey: "gluteBridge", src: `${CLIP_BASE}/Glutes/donkeykick.mp4` },
  { id: "glute-bridge", name: "Glute bridge", muscle: "Glutes", exerciseKey: "gluteBridge", src: `${CLIP_BASE}/Glutes/glutebridge.mp4` },
  { id: "hip-thrust", name: "Hip thrust", muscle: "Glutes", exerciseKey: "gluteBridge", src: `${CLIP_BASE}/Glutes/hipthrust.mp4` },
  { id: "single-leg-glute-bridge", name: "Single leg glute bridge", muscle: "Glutes", exerciseKey: "gluteBridge", src: `${CLIP_BASE}/Glutes/singlelegglutebridge.mp4` },
  { id: "good-morning", name: "Good morning", muscle: "Hamstrings", exerciseKey: "gluteBridge", src: `${CLIP_BASE}/Hamstrings/goodmorning.mp4` },
  { id: "single-leg-romanian-deadlift", name: "Single leg Romanian deadlift", muscle: "Hamstrings", src: `${CLIP_BASE}/Hamstrings/singlelegromaniandeadlift.mp4` },
  { id: "cobra-raise", name: "Cobra raise", muscle: "Lower back", src: `${CLIP_BASE}/lowerback/cobraraise.mp4` },
  { id: "superman-hold", name: "Superman hold", muscle: "Lower back", src: `${CLIP_BASE}/lowerback/supermanhold.mp4` },
  { id: "bicycle-crunch", name: "Bicycle crunch", muscle: "Obliques", exerciseKey: "crunch", src: `${CLIP_BASE}/Obliques/bicyclecrunch.mp4` },
  { id: "mountain-climber", name: "Mountain climber", muscle: "Obliques", exerciseKey: "mountainClimbers", src: `${CLIP_BASE}/Obliques/mountainclimber.mp4` },
  { id: "russian-twist", name: "Russian twist", muscle: "Obliques", exerciseKey: "crunch", src: `${CLIP_BASE}/Obliques/russiantwist.mp4` },
  { id: "side-plank-hip-dip", name: "Side plank hip dip", muscle: "Obliques", exerciseKey: "sidePlank", src: `${CLIP_BASE}/Obliques/sideplanckhipdip.mp4` },
  { id: "bodyweight-squat", name: "Bodyweight squat", muscle: "Quadriceps", exerciseKey: "squat", src: `${CLIP_BASE}/Quadriceps/Bodyweightsquat.mp4` },
  { id: "jump-squats", name: "Jump squats", muscle: "Quadriceps", exerciseKey: "squatJump", src: `${CLIP_BASE}/Quadriceps/jumpsquats.mp4` },
  { id: "lunges", name: "Lunges", muscle: "Quadriceps", exerciseKey: "forwardLunge", src: `${CLIP_BASE}/Quadriceps/Lunges.mp4` },
  { id: "split-squat", name: "Split squat", muscle: "Quadriceps", exerciseKey: "squat", src: `${CLIP_BASE}/Quadriceps/Splitsquat.mp4` },
  { id: "wall-sit-hold", name: "Wall sit hold", muscle: "Quadriceps", exerciseKey: "wallSit", src: `${CLIP_BASE}/Quadriceps/Wallsithold.mp4` },
  { id: "pike-pushup-shoulder", name: "Pike push-up", muscle: "Shoulder", exerciseKey: "pushup", src: `${CLIP_BASE}/Shoulder/pikepushup.mp4` },
  { id: "pushup-shoulder", name: "Push-up", muscle: "Shoulder", exerciseKey: "pushup", src: `${CLIP_BASE}/Shoulder/pushup.mp4` },
  { id: "shoulder-tap", name: "Shoulder tap", muscle: "Shoulder", exerciseKey: "shoulderTaps", src: `${CLIP_BASE}/Shoulder/shouldertap.mp4` },
  { id: "side-plank-reach", name: "Side plank reach", muscle: "Shoulder", exerciseKey: "sidePlank", src: `${CLIP_BASE}/Shoulder/sideplankreach.mp4` },
  { id: "diamond-pushup-triceps", name: "Diamond push-up", muscle: "Triceps", exerciseKey: "pushup", src: `${CLIP_BASE}/Triceps/diamondpushup.mp4` },
  { id: "hindu-pushup-triceps", name: "Hindu push-up", muscle: "Triceps", exerciseKey: "pushup", src: `${CLIP_BASE}/Triceps/hindupushup.mp4` },
  { id: "prone-y-raise", name: "Prone Y raise", muscle: "Upper back", src: `${CLIP_BASE}/upperback/proneYraise.mp4` },
  { id: "prone-w-raise", name: "Prone W raise", muscle: "Upper back", src: `${CLIP_BASE}/upperback/pronWraise.mp4` },
  { id: "reverse-snow-angel", name: "Reverse snow angel", muscle: "Upper back", src: `${CLIP_BASE}/upperback/reversesnowangel.mp4` },
  { id: "superman", name: "Superman", muscle: "Upper back", src: `${CLIP_BASE}/upperback/superman.mp4` },
];

const DUMBBELL_WORKOUT_CLIPS: WorkoutClip[] = [
  { id: "dumbbell-crunch", name: "Dumbbell crunch", muscle: "Abs", exerciseKey: "crunch", equipment: "dumbbell", src: `${CLIP_BASE}/Abs/dumbell/dumbellcrunch.mp4` },
  { id: "dumbbell-leg-raise-hold", name: "Dumbbell leg raise hold", muscle: "Abs", exerciseKey: "legRaise", equipment: "dumbbell", src: `${CLIP_BASE}/Abs/dumbell/dumbelllegraisehold.mp4` },
  { id: "weighted-situps", name: "Weighted sit-ups", muscle: "Abs", exerciseKey: "situp", equipment: "dumbbell", src: `${CLIP_BASE}/Abs/dumbell/weightedsitups.mp4` },
  { id: "concentration-curl", name: "Concentration curl", muscle: "Biceps", exerciseKey: "bicepCurl", equipment: "dumbbell", src: `${CLIP_BASE}/Biceps/dumbell/concentrationcurl.mp4` },
  { id: "dumbbell-curls", name: "Dumbbell curls", muscle: "Biceps", exerciseKey: "bicepCurl", equipment: "dumbbell", src: `${CLIP_BASE}/Biceps/dumbell/dumbellcurls.mp4` },
  { id: "incline-seated-curls", name: "Incline seated curls", muscle: "Biceps", exerciseKey: "bicepCurl", equipment: "dumbbell", src: `${CLIP_BASE}/Biceps/dumbell/inclinestyleseatedcurls.mp4` },
  { id: "dumbbell-standing-calf-raise", name: "Dumbbell standing calf raise", muscle: "Calves", exerciseKey: "calfRaise", equipment: "dumbbell", src: `${CLIP_BASE}/Calves/dumbell/dumbellstandingcalfraise.mp4` },
  { id: "dumbbell-seated-calf-raise", name: "Dumbbell seated calf raise", muscle: "Calves", exerciseKey: "calfRaise", equipment: "dumbbell", src: `${CLIP_BASE}/Calves/dumbell/seatedcalfraise.mp4` },
  { id: "dumbbell-floor-raise", name: "Dumbbell floor raise", muscle: "Chest", exerciseKey: "pushup", equipment: "dumbbell", src: `${CLIP_BASE}/Chest/DumbellChest/dumbellfloorraise.mp4` },
  { id: "dumbbell-pullover-chest", name: "Dumbbell pullover", muscle: "Chest", exerciseKey: "overheadPress", equipment: "dumbbell", src: `${CLIP_BASE}/Chest/DumbellChest/dumbellpullover.mp4` },
  { id: "dumbbell-squeeze-press", name: "Dumbbell squeeze press", muscle: "Chest", exerciseKey: "pushup", equipment: "dumbbell", src: `${CLIP_BASE}/Chest/DumbellChest/dumbellsqueezepress.mp4` },
  { id: "dumbbell-glute-bridge", name: "Dumbbell glute bridge", muscle: "Glutes", exerciseKey: "gluteBridge", equipment: "dumbbell", src: `${CLIP_BASE}/Glutes/dumbell/dumbellglutebridge.mp4` },
  { id: "dumbbell-hip-thrust", name: "Dumbbell hip thrust", muscle: "Glutes", exerciseKey: "gluteBridge", equipment: "dumbbell", src: `${CLIP_BASE}/Glutes/dumbell/dumbellhipthrust.mp4` },
  { id: "dumbbell-lunges", name: "Dumbbell lunges", muscle: "Glutes", exerciseKey: "forwardLunge", equipment: "dumbbell", src: `${CLIP_BASE}/Glutes/dumbell/dumbelllunges.mp4` },
  { id: "goblet-squat-glutes", name: "Goblet squat", muscle: "Glutes", exerciseKey: "squat", equipment: "dumbbell", src: `${CLIP_BASE}/Glutes/dumbell/gobletsquat.mp4` },
  { id: "romanian-deadlift-glutes", name: "Romanian deadlift", muscle: "Glutes", exerciseKey: "gluteBridge", equipment: "dumbbell", src: `${CLIP_BASE}/Glutes/dumbell/romaniandeadlift.mp4` },
  { id: "dumbbell-good-morning", name: "Dumbbell good morning", muscle: "Hamstrings", exerciseKey: "gluteBridge", equipment: "dumbbell", src: `${CLIP_BASE}/Hamstrings/dumbell/dumbellgoodmorning.mp4` },
  { id: "romanian-deadlift-hamstrings", name: "Romanian deadlift", muscle: "Hamstrings", exerciseKey: "gluteBridge", equipment: "dumbbell", src: `${CLIP_BASE}/Hamstrings/dumbell/romaniandeadlift.mp4` },
  { id: "single-leg-romanian-deadlift-dumbbell", name: "Single leg Romanian deadlift", muscle: "Hamstrings", exerciseKey: "gluteBridge", equipment: "dumbbell", src: `${CLIP_BASE}/Hamstrings/dumbell/singlelegromaniandeadlift.mp4` },
  { id: "dumbbell-bent-over-row-lower-back", name: "Dumbbell bent-over row", muscle: "Lower back", exerciseKey: "pullup", equipment: "dumbbell", src: `${CLIP_BASE}/lowerback/dumbell/bentoverdumbellrow.mp4` },
  { id: "dumbbell-pullover-lower-back", name: "Dumbbell pullover", muscle: "Lower back", exerciseKey: "overheadPress", equipment: "dumbbell", src: `${CLIP_BASE}/lowerback/dumbell/dumbellpullover.mp4` },
  { id: "renegade-rows-lower-back", name: "Renegade rows", muscle: "Lower back", exerciseKey: "shoulderTaps", equipment: "dumbbell", src: `${CLIP_BASE}/lowerback/dumbell/renegaderows.mp4` },
  { id: "dumbbell-russian-twist", name: "Dumbbell Russian twist", muscle: "Obliques", exerciseKey: "crunch", equipment: "dumbbell", src: `${CLIP_BASE}/Obliques/dumbell/dumbellrussiantwist.mp4` },
  { id: "dumbbell-side-bend", name: "Dumbbell side bend", muscle: "Obliques", exerciseKey: "crunch", equipment: "dumbbell", src: `${CLIP_BASE}/Obliques/dumbell/dumbellsidebend.mp4` },
  { id: "renegade-rows-obliques", name: "Renegade rows", muscle: "Obliques", exerciseKey: "shoulderTaps", equipment: "dumbbell", src: `${CLIP_BASE}/Obliques/dumbell/renegaderows.mp4` },
  { id: "suitcase-carry", name: "Suitcase carry", muscle: "Obliques", exerciseKey: "crunch", equipment: "dumbbell", src: `${CLIP_BASE}/Obliques/dumbell/suitcasecarry.mp4` },
  { id: "dumbbell-bulgarian-split-squat", name: "Dumbbell Bulgarian split squat", muscle: "Quadriceps", exerciseKey: "squat", equipment: "dumbbell", src: `${CLIP_BASE}/Quadriceps/dumbell/dumbellbulgariansplitsquat.mp4` },
  { id: "dumbbell-front-squat", name: "Dumbbell front squat", muscle: "Quadriceps", exerciseKey: "squat", equipment: "dumbbell", src: `${CLIP_BASE}/Quadriceps/dumbell/dumbellfrontsquat.mp4` },
  { id: "goblet-squat-quadriceps", name: "Goblet squat", muscle: "Quadriceps", exerciseKey: "squat", equipment: "dumbbell", src: `${CLIP_BASE}/Quadriceps/dumbell/gobletsquat.mp4` },
  { id: "dumbbell-split-squat", name: "Dumbbell split squat", muscle: "Quadriceps", exerciseKey: "squat", equipment: "dumbbell", src: `${CLIP_BASE}/Quadriceps/dumbell/splitsquat.mp4` },
  { id: "arnold-press", name: "Arnold press", muscle: "Shoulder", exerciseKey: "overheadPress", equipment: "dumbbell", src: `${CLIP_BASE}/Shoulder/dumbell/arnoldpress.mp4` },
  { id: "bent-over-reverse-fly", name: "Bent-over reverse fly", muscle: "Shoulder", exerciseKey: "overheadPress", equipment: "dumbbell", src: `${CLIP_BASE}/Shoulder/dumbell/bentoverreversefly.mp4` },
  { id: "dumbbell-front-raise", name: "Dumbbell front raise", muscle: "Shoulder", exerciseKey: "overheadPress", equipment: "dumbbell", src: `${CLIP_BASE}/Shoulder/dumbell/dumbellfrontraise.mp4` },
  { id: "dumbbell-lateral-raise", name: "Dumbbell lateral raise", muscle: "Shoulder", exerciseKey: "overheadPress", equipment: "dumbbell", src: `${CLIP_BASE}/Shoulder/dumbell/dumbelllateralraise.mp4` },
  { id: "dumbbell-shoulder-press", name: "Dumbbell shoulder press", muscle: "Shoulder", exerciseKey: "overheadPress", equipment: "dumbbell", src: `${CLIP_BASE}/Shoulder/dumbell/dumbellshoulderpress.mp4` },
  { id: "dumbbell-floor-press", name: "Dumbbell floor press", muscle: "Triceps", exerciseKey: "pushup", equipment: "dumbbell", src: `${CLIP_BASE}/Triceps/dumbell/dumbellfloorpress.mp4` },
  { id: "dumbbell-skull-crusher", name: "Dumbbell skull crusher", muscle: "Triceps", exerciseKey: "overheadPress", equipment: "dumbbell", src: `${CLIP_BASE}/Triceps/dumbell/dumbellskullcrusheronfloor.mp4` },
  { id: "hammer-curls", name: "Hammer curls", muscle: "Biceps", exerciseKey: "bicepCurl", equipment: "dumbbell", src: `${CLIP_BASE}/Triceps/dumbell/hammercurls.mp4` },
  { id: "overhead-tricep-extension", name: "Overhead tricep extension", muscle: "Triceps", exerciseKey: "overheadPress", equipment: "dumbbell", src: `${CLIP_BASE}/Triceps/dumbell/overheadtricepextension.mp4` },
  { id: "dumbbell-bent-over-row", name: "Dumbbell bent-over row", muscle: "Upper back", exerciseKey: "pullup", equipment: "dumbbell", src: `${CLIP_BASE}/upperback/dumbell/dumbellbentoverrow.mp4` },
  { id: "dumbbell-high-pull", name: "Dumbbell high pull", muscle: "Upper back", exerciseKey: "pullup", equipment: "dumbbell", src: `${CLIP_BASE}/upperback/dumbell/dumbellhighpull.mp4` },
  { id: "dumbbell-shrugs", name: "Dumbbell shrugs", muscle: "Upper back", exerciseKey: "pullup", equipment: "dumbbell", src: `${CLIP_BASE}/upperback/dumbell/dumbellshrugs.mp4` },
  { id: "dumbbell-reverse-fly", name: "Dumbbell reverse fly", muscle: "Upper back", exerciseKey: "overheadPress", equipment: "dumbbell", src: `${CLIP_BASE}/upperback/dumbell/reversefly.mp4` },
];

const FULL_BODY_WORKOUT_CLIPS: WorkoutClip[] = [
  { id: "full-body-burpees", name: "Burpees", muscle: "Full body", exerciseKey: "burpee", src: `${CLIP_BASE}/Fullbody/burpees.mp4` },
  { id: "full-body-high-knees", name: "High knees", muscle: "Full body", exerciseKey: "highKnees", src: `${CLIP_BASE}/Fullbody/highknees.mp4` },
  { id: "full-body-jumping-jacks", name: "Jumping jacks", muscle: "Full body", exerciseKey: "jumpingJacks", src: `${CLIP_BASE}/Fullbody/jumpingjacks.mp4` },
  { id: "full-body-mountain-climber", name: "Mountain climber", muscle: "Full body", exerciseKey: "mountainClimbers", src: `${CLIP_BASE}/Fullbody/mountainclimber.mp4` },
  { id: "squat-thrust", name: "Squat thrust", muscle: "Full body", exerciseKey: "burpee", src: `${CLIP_BASE}/Fullbody/squatthrust.mp4` },
  { id: "dumbbell-burpees", name: "Dumbbell burpees", muscle: "Full body", exerciseKey: "burpee", equipment: "dumbbell", src: `${CLIP_BASE}/Fullbody/dumbell/dumbellburpees.mp4` },
  { id: "dumbbell-clean-and-press", name: "Dumbbell clean and press", muscle: "Full body", exerciseKey: "overheadPress", equipment: "dumbbell", src: `${CLIP_BASE}/Fullbody/dumbell/dumbellcleanandpress.mp4` },
  { id: "dumbbell-squat-to-press", name: "Dumbbell squat to press", muscle: "Full body", exerciseKey: "squat", equipment: "dumbbell", src: `${CLIP_BASE}/Fullbody/dumbell/dumbellsquattopress.mp4` },
  { id: "dumbbell-thruster", name: "Dumbbell thruster", muscle: "Full body", exerciseKey: "squat", equipment: "dumbbell", src: `${CLIP_BASE}/Fullbody/dumbell/dumbellthruster.mp4` },
];

export const WORKOUT_CLIPS: WorkoutClip[] = [
  ...BODYWEIGHT_WORKOUT_CLIPS,
  ...DUMBBELL_WORKOUT_CLIPS,
  ...FULL_BODY_WORKOUT_CLIPS,
];

const MUSCLE_ALIASES: Record<string, string[]> = {
  abs: ["abs", "rectus abdominis", "abdominals"],
  obliques: ["obliques", "external oblique", "internal oblique"],
  chest: ["chest", "pectorals", "pectoralis major", "upper chest", "lower chest"],
  shoulder: ["shoulder", "shoulders", "deltoids", "front delts", "side delts", "rear delts"],
  triceps: ["triceps", "triceps brachii"],
  forearms: ["forearms", "forearm"],
  biceps: ["biceps", "biceps brachii"],
  quadriceps: ["quadriceps", "quads", "thighs", "rectus femoris"],
  hamstrings: ["hamstrings", "biceps femoris"],
  glutes: ["glutes", "gluteus", "gluteus maximus"],
  calves: ["calves", "calf", "gastrocnemius", "soleus"],
  adductors: ["adductors", "inner thigh"],
  "lower back": ["lower back", "erector spinae", "lumbar"],
  "upper back": ["upper back", "trapezius", "traps", "lats", "latissimus dorsi", "rhomboids"],
  "full body": ["full body", "fullbody"],
};

function normalize(value: string) {
  return value.toLowerCase().replace(/[_-]+/g, " ").trim();
}

export function getWorkoutClipsForMuscle(muscle: string) {
  const normalized = normalize(muscle);
  const matchingGroup = Object.entries(MUSCLE_ALIASES).find(([group, aliases]) =>
    group === normalized || aliases.some((alias) => normalized.includes(alias) || alias.includes(normalized))
  )?.[0];

  return WORKOUT_CLIPS.filter((clip) => normalize(clip.muscle) === matchingGroup);
}

export function getWorkoutClipForExercise(exerciseKey?: string, label?: string) {
  if (exerciseKey) {
    const match = WORKOUT_CLIPS.find((clip) => clip.exerciseKey === exerciseKey);
    if (match) return match;
  }

  if (!label) return null;
  const normalizedLabel = normalize(label);
  return (
    WORKOUT_CLIPS.find((clip) => normalize(clip.name) === normalizedLabel) ??
    WORKOUT_CLIPS.find((clip) => normalizedLabel.includes(normalize(clip.name)) || normalize(clip.name).includes(normalizedLabel)) ??
    null
  );
}
