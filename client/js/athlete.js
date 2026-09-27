// ATHLETE TRAINING HUB — 365 FITNESS GYM
// High Performance Athletic System

let userProfile = null;
let athleteLogs = [];
let chartInstance = null;
let timerInterval = null;
let timerSeconds = 0;
let isTimerRunning = false;

// -------------------------------------------------------------
// ATHLETE GYM WORKOUT PLANS DATABASE
// -------------------------------------------------------------
const ATHLETE_GYM_PLANS = [
  {
    id: 'hyrox-inter',
    name: 'HYROX Race Readiness & Work Capacity',
    category: 'hyrox',
    level: 'Intermediate',
    goal: 'HYROX Endurance & Transition Speed',
    daysPerWeek: 4,
    duration: '60-75 Min',
    equipment: 'Sled, SkiErg, Rower, Dumbbells, Wall Ball',
    description: 'Race-simulated hybrid workout balancing high-zone running with heavy functional station strength.',
    exercises: [
      { name: '1000m SkiErg Pace Warm-Up', sets: 1, reps: '1000m', rest: '90s', benefit: 'Upper body aerobic engine', technique: 'Hinge hips, drive handles to thighs with core engagement.' },
      { name: 'Heavy Sled Push / Sled Pull', sets: 4, reps: '25m Push + 25m Pull', rest: '2 Min', benefit: 'Quad & glute force under fatigue', technique: 'Keep low torso angle, drive through whole foot.' },
      { name: 'Burpee Broad Jumps', sets: 3, reps: '20m distance', rest: '90s', benefit: 'Full-body explosive endurance', technique: 'Chest to floor, jump forward aggressively using arm swing.' },
      { name: '1000m Rowing Intervals', sets: 3, reps: '1000m @ 2:00 pace', rest: '2 Min', benefit: 'Posterior chain endurance', technique: 'Legs drive first, then hips, then arms pull to sternum.' },
      { name: 'Heavy Farmer Carry', sets: 4, reps: '50m distance (24kg)', rest: '90s', benefit: 'Grip & core anti-lateral flexion', technique: 'Stand tall, shoulders packed down, tight grip.' },
      { name: 'Sandbag Walking Lunges', sets: 3, reps: '30m distance', rest: '90s', benefit: 'Single leg stamina', technique: 'Keep front knee tracking over 2nd toe.' },
      { name: 'Wall Balls', sets: 4, reps: '25 reps (9kg / 6kg)', rest: '90s', benefit: 'Squat & push power under HR pressure', technique: 'Full depth squat, toss to 10ft target on extension.' }
    ],
    warmup: '5 min light jog + dynamic leg swings, arm circles, inchworms.',
    cooldown: '5 min walk + static quad stretch, hamstring stretch, calf stretch.',
    videoKeyword: 'HYROX race preparation workout'
  },
  {
    id: 'hyrox-beginner',
    name: 'HYROX Foundation (Gym & Bodyweight)',
    category: 'hyrox',
    level: 'Beginner',
    goal: 'HYROX Station Conditioning',
    daysPerWeek: 3,
    duration: '45-50 Min',
    equipment: 'Dumbbells, Treadmill / Run Track',
    description: 'Beginner-friendly station training using accessible equipment and bodyweight regressions.',
    exercises: [
      { name: 'Treadmill Run / Outdoor Run', sets: 3, reps: '800m run', rest: '90s', benefit: 'Aerobic base', technique: 'Moderate conversational pace.' },
      { name: 'Dumbbell Goblet Thrusters', sets: 4, reps: '12 reps', rest: '60s', benefit: 'Wall ball alternative', technique: 'Deep squat, push overhead in one motion.' },
      { name: 'Walking Dumbbell Farmers Carry', sets: 4, reps: '40m distance', rest: '60s', benefit: 'Grip & shoulder stability', technique: 'Brace core, walk heel-to-toe.' },
      { name: 'Bodyweight Burpee Stepping', sets: 3, reps: '10 reps', rest: '60s', benefit: 'Station endurance', technique: 'Step back into plank, step forward.' },
      { name: 'Single Leg Bodyweight Lunges', sets: 3, reps: '12 / leg', rest: '60s', benefit: 'Leg stamina', technique: 'Upright torso, controlled landing.' }
    ],
    warmup: 'Cat-cow, thoracic rotations, ankle circles.',
    cooldown: 'Foam rolling calves and quads.',
    videoKeyword: 'Beginner HYROX workout at home'
  },
  {
    id: 'strength-athletic',
    name: 'Raw Athletic Force Production & Trap-Bar Deadlift',
    category: 'strength',
    level: 'Intermediate',
    goal: 'Maximum Ground Force & Posterior Power',
    daysPerWeek: 4,
    duration: '60 Min',
    equipment: 'Trap Bar, Barbell, Dumbbells',
    description: 'Designed to maximize force production and strength-to-weight ratio without excessive hypertrophy strain.',
    exercises: [
      { name: 'Heavy Trap-Bar Deadlift', sets: 4, reps: '4-5 reps @ 80-85% 1RM', rest: '3 Min', benefit: 'Maximum lower body vertical force', technique: 'Hinge at hips, brace core, drive ground away explosively.' },
      { name: 'Barbell Front Squat', sets: 4, reps: '5 reps', rest: '2.5 Min', benefit: 'Quad & core anti-flexion', technique: 'Elbows high, vertical spine, full depth.' },
      { name: 'Weighted Pull-Ups', sets: 4, reps: '5-6 reps', rest: '2 Min', benefit: 'Upper body pull power & lat stiffness', technique: 'Full extension at bottom, chin over bar.' },
      { name: 'Single-Leg DB Romanian Deadlift', sets: 3, reps: '8 / leg', rest: '90s', benefit: 'Hamstring & hip stability', technique: 'Slight knee bend, hinge till stretch in hamstring.' },
      { name: 'Pallof Press (Cable / Band)', sets: 3, reps: '12 / side', rest: '60s', benefit: 'Core anti-rotation stability', technique: 'Brace core, press handle forward without torso moving.' }
    ],
    warmup: 'Glute bridges, Monster walks, Hip openers.',
    cooldown: 'Couch stretch + Hamstring stretch.',
    videoKeyword: 'Athletic strength trap bar deadlift workout'
  },
  {
    id: 'power-explosive',
    name: 'Explosive Rate of Force Development (RFD)',
    category: 'power',
    level: 'Intermediate',
    goal: 'Rate of Force Development & Sprint Starts',
    daysPerWeek: 3,
    duration: '45-50 Min',
    equipment: 'Plyo Box, Medicine Ball, Kettlebell',
    description: 'High-intent neural training focusing on maximum speed of movement, tendon elastic recoil, and power.',
    exercises: [
      { name: 'Seated Box Jump to Max Vertical', sets: 4, reps: '5 jumps', rest: '2 Min', benefit: 'Concentric starting power', technique: 'Pause on seat, explode upward with max intent.' },
      { name: 'Explosive Medicine Ball Slams', sets: 4, reps: '6 slams', rest: '90s', benefit: 'Rotational & vertical upper body power', technique: 'Slam ball to ground using full hip & torso snap.' },
      { name: 'Heavy Kettlebell Swings', sets: 4, reps: '10 reps', rest: '90s', benefit: 'Hip snap & glute extension', technique: 'Hinge hips, drive forward with glutes.' },
      { name: 'Plyometric Push-Ups (Clap)', sets: 3, reps: '6 reps', rest: '90s', benefit: 'Upper body pressing speed', technique: 'Push off floor with maximum explosive acceleration.' }
    ],
    warmup: 'Ankle pogo hops, A-skips, Arm swings.',
    cooldown: 'Light walking & calf stretch.',
    videoKeyword: 'Explosive rate of force development workout'
  },
  {
    id: 'isometric-holds',
    name: 'Tendon Resilience & Overcoming Isometrics',
    category: 'isometric',
    level: 'All Levels',
    goal: 'Patellar Tendon Protection & Joint Stiffness',
    daysPerWeek: 3,
    duration: '35-40 Min',
    equipment: 'Bodyweight, Barbell, Resistance Loop',
    description: 'Yielding and Overcoming Isometric holds that build tendon load capacity and decrease knee pain.',
    exercises: [
      { name: 'Spanish Squat Isometric Hold', sets: 4, reps: '45 sec hold', rest: '90s', benefit: 'Patellar tendon loading & quad endurance', technique: 'Heavy band behind knees, sit back to 90 degrees, hold firm.' },
      { name: 'Single-Leg Isometric Wall Sit', sets: 3, reps: '30 sec / leg', rest: '60s', benefit: 'Unilateral quad stiffness', technique: 'Press foot into floor, 90 degree knee angle.' },
      { name: 'Iso-Mid Thigh Pull (Barbell on Pins)', sets: 4, reps: '6 sec max push', rest: '2 Min', benefit: 'Peak isometric force production', technique: 'Pull against immovable pins with 100% max intent.' },
      { name: 'Copenhagen Side Plank Hold', sets: 3, reps: '30 sec / side', rest: '60s', benefit: 'Adductor & groin bulletproofing', technique: 'Top leg on bench, hold hips high and straight.' }
    ],
    warmup: 'Bodyweight squats, ankle mobility.',
    cooldown: 'Gentle leg elevation & Quad stretch.',
    videoKeyword: 'Spanish squat isometric hold knee rehabilitation'
  },
  {
    id: 'plyo-vert-jump',
    name: 'Jump & Plyometric Elasticity Protocol',
    category: 'plyometric',
    level: 'Intermediate',
    goal: 'Max Vertical Jump & Reactive Elasticity',
    daysPerWeek: 3,
    duration: '45 Min',
    equipment: 'Plyo Box, Hurdle / Cone, Band',
    description: 'Advanced jump training targeting ground contact times (<200ms) and elastic energy storage in the Achilles tendon.',
    exercises: [
      { name: 'Continuous Pogo Hops (Ankle Stiffness)', sets: 4, reps: '15 sec', rest: '60s', benefit: 'Achilles tendon elastic energy', technique: 'Keep knees stiff, bounce off forefeet rapidly.' },
      { name: 'Depth Jumps off 30cm Box', sets: 4, reps: '4 jumps', rest: '2 Min', benefit: 'Reactive stretch-shortening cycle (SSC)', technique: 'Step off box, absorb landing instantly and spring vertical.' },
      { name: 'Penultimate Plant Approach Jumps', sets: 4, reps: '5 jumps', rest: '2 Min', benefit: 'Horizontal-to-vertical transfer', technique: 'Long penultimate stride, plant block foot hard.' },
      { name: 'Single-Leg Hurdle Bounds', sets: 3, reps: '5 bounds / leg', rest: '90s', benefit: 'Unilateral jump power & landing control', technique: 'Explode sideways over hurdle, land stick.' }
    ],
    warmup: 'Dynamic leg swings, pogos, ankles mobility.',
    cooldown: 'Soleus and gastrocnemius static stretch.',
    videoKeyword: 'Vertical jump plyometric workout elastic recoil'
  },
  {
    id: 'plyo-box-depth',
    name: 'Plyometric Box & Horizontal Bound Power',
    category: 'plyometric',
    level: 'Advanced',
    goal: 'Horizontal Broad Jump & Landing Stiffness',
    daysPerWeek: 3,
    duration: '50 Min',
    equipment: 'High Plyo Box, Medicine Ball',
    description: 'High-amplitude broad jumps, bounding, and landing mechanics for explosive multi-sport athletes.',
    exercises: [
      { name: 'Standing Broad Jump to Stick Landing', sets: 4, reps: '5 jumps', rest: '90s', benefit: 'Horizontal hip drive power', technique: 'Hinge hips back, swing arms, jump max distance.' },
      { name: 'Alternating Single-Leg Bounds (30m)', sets: 4, reps: '30m distance', rest: '2 Min', benefit: 'Stride length & single leg propulsion', technique: 'Drive knee up and forward, paw the ground.' },
      { name: 'Medicine Ball Scoop Throw & Jump', sets: 4, reps: '6 throws', rest: '90s', benefit: 'Full-body triple extension', technique: 'Scoop ball between legs, launch overhead into air.' }
    ],
    warmup: 'Skipping drills, lateral shuffles.',
    cooldown: 'Hamstring stretch and foam rolling.',
    videoKeyword: 'Plyometric bounding and broad jump workout'
  },
  {
    id: 'agility-cod-reaction',
    name: 'Agility, Reaction & COD Deceleration',
    category: 'agility',
    level: 'Intermediate',
    goal: 'Change of Direction & Deceleration Control',
    daysPerWeek: 3,
    duration: '45 Min',
    equipment: 'Cones, Agility Ladder, Reaction Balls',
    description: 'Focuses on braking force, foot placement angles, and rapid multi-directional acceleration.',
    exercises: [
      { name: '5-10-5 Pro Agility Shuttle Run', sets: 5, reps: '3 rounds', rest: '90s', benefit: 'Lateral change of direction speed', technique: 'Stay low, touch lines with outside hand, push hard.' },
      { name: 'Deceleration Stop & Stick (10m Sprint)', sets: 4, reps: '4 sprints', rest: '90s', benefit: 'Eccentric quad deceleration & ACL safety', technique: 'Sprint 10m, sink hips low into 2-step stop.' },
      { name: 'Crossover Step & Shuffle Drill', sets: 4, reps: '15m distance', rest: '60s', benefit: 'Court / field recovery footwork', technique: 'Crossover lead leg, transition seamlessly into lateral shuffle.' },
      { name: 'Visual Reaction Cone Taps (Partner)', sets: 4, reps: '30 sec', rest: '60s', benefit: 'Cognitive reaction & open-skill agility', technique: 'React to callout, accelerate to colored cone.' }
    ],
    warmup: 'High knees, butt kicks, carioca drills.',
    cooldown: 'Groin / adductor stretch, hip flexor release.',
    videoKeyword: 'Change of direction agility deceleration drills'
  },
  {
    id: 'agility-reactive-shuttle',
    name: 'Reactive Footwork & Rapid Crossover Speed',
    category: 'agility',
    level: 'All Levels',
    goal: 'Footwork Frequency & Open Reaction',
    daysPerWeek: 3,
    duration: '40 Min',
    equipment: 'Agility Ladder, Cones',
    description: 'Fast footwork frequency drills designed to sharpen ground contact cadence and split-step timing.',
    exercises: [
      { name: 'Ladder In-Out & Ickey Shuffle', sets: 4, reps: '4 passes', rest: '60s', benefit: 'Foot cadence & coordination', technique: 'Stay light on toes, maintain athletic posture.' },
      { name: 'L-Drill 3-Cone Agility Test', sets: 4, reps: '3 reps / direction', rest: '90s', benefit: 'Tight cornering & turning control', technique: 'Sprint to cone 1, backpedal, loop around cone 2.' },
      { name: 'Lateral Skater Bouts to Cone Sprint', sets: 4, reps: '5 bounds + 5m sprint', rest: '90s', benefit: 'Lateral push-off into linear speed', technique: 'Bound side-to-side 4x, explode into forward sprint.' }
    ],
    warmup: 'Ankle bounces, lateral leg swings.',
    cooldown: 'Calf & ankle stretching routine.',
    videoKeyword: 'Agility ladder and reactive shuttle drills'
  },
  {
    id: 'conditioning-engine',
    name: 'Athletic Work Capacity & Repeat Sprint Ability (RSA)',
    category: 'conditioning',
    level: 'Intermediate',
    goal: 'VO2 Max Engine & Anaerobic Lactic Tolerance',
    daysPerWeek: 4,
    duration: '50 Min',
    equipment: 'SkiErg, Assault Bike, Treadmill, Kettlebell',
    description: 'High-intensity interval conditioning designed to elevate anaerobic threshold and speed up heart rate recovery.',
    exercises: [
      { name: 'Assault Bike Sprint Intervals (15s Max / 45s Rest)', sets: 8, reps: '15s work / 45s rest', rest: '45s', benefit: 'Anaerobic power & lactat clearance', technique: 'Pedal & push arms with 100% max effort.' },
      { name: 'Kettlebell Clean & Push Press Density', sets: 4, reps: '10 reps (20kg)', rest: '60s', benefit: 'Full-body lactic work capacity', technique: 'Clean KB to rack, dip and drive overhead.' },
      { name: '100m Repeat Sprint Intervals @ 85%', sets: 6, reps: '100m sprint', rest: '60s', benefit: 'Repeat Sprint Ability (RSA)', technique: 'Maintain clean sprint posture down straightaway.' },
      { name: 'Rowing Ergometer 500m Time Trial', sets: 3, reps: '500m sprint', rest: '2 Min', benefit: 'Cardiovascular power output', technique: 'Aggressive leg drive, maintain 30+ strokes/min.' }
    ],
    warmup: '5 min light jog + dynamic arm & leg mobility.',
    cooldown: '5 min slow walk + deep diaphragmatic breathing.',
    videoKeyword: 'Repeat sprint ability athletic conditioning workout'
  },
  {
    id: 'conditioning-repeat-sprint',
    name: 'Aerobic Base & Hybrid Threshold Circuit',
    category: 'conditioning',
    level: 'Beginner',
    goal: 'Aerobic Engine & Energy System Base',
    daysPerWeek: 3,
    duration: '45 Min',
    equipment: 'Rower, Jump Rope, Bodyweight',
    description: 'Aerobic zone threshold conditioning to build endurance without compromising explosive speed.',
    exercises: [
      { name: 'Continuous Jump Rope & Shadow Movement', sets: 4, reps: '3 min round', rest: '60s', benefit: 'Calf endurance & foot stiffness', technique: 'Light bounce on forefeet.' },
      { name: 'Bodyweight Circuit (Push-Up, Air Squat, Sit-Up)', sets: 4, reps: '15 reps each', rest: '60s', benefit: 'General muscular endurance', technique: 'Continuous movement rhythm.' },
      { name: '2000m Rowing Zone 2 Engine', sets: 1, reps: '2000m steady pace', rest: '2 Min', benefit: 'Aerobic base building', technique: 'Keep HR around 130-145 bpm.' }
    ],
    warmup: 'Dynamic stretching, cat-cow.',
    cooldown: 'Full body static stretch.',
    videoKeyword: 'Aerobic base conditioning for explosive athletes'
  },
  {
    id: 'mobility-prehab-hips',
    name: 'Ankle, Knee & Hip Prehab Protocol',
    category: 'mobility',
    level: 'All Levels',
    goal: 'Joint Mobility & Tendon Pain Prevention',
    daysPerWeek: 4,
    duration: '35 Min',
    equipment: 'Foam Roller, Resistance Loop, Slant Board',
    description: 'Targeted prehab focusing on ankle dorsiflexion, patellar tendon protection, and hip capsule space.',
    exercises: [
      { name: 'Slant Board Poliquin Step-Ups', sets: 3, reps: '15 / leg', rest: '60s', benefit: 'VMO knee stabilizer strengthening', technique: 'Heel elevated, drive knee forward past toes under control.' },
      { name: 'Knee-to-Wall Ankle Dorsiflexion Mobilization', sets: 3, reps: '12 / ankle', rest: '45s', benefit: 'Ankle range for deep squatting & landing', technique: 'Drive knee forward over big toe while keeping heel down.' },
      { name: '90/90 Hip Switch & Liftoffs', sets: 3, reps: '10 switches', rest: '45s', benefit: 'Hip internal & external rotation space', technique: 'Upright spine, rotate knees smoothly side-to-side.' },
      { name: 'Single-Leg Tibialis Raise (against Wall)', sets: 3, reps: '20 reps', rest: '45s', benefit: 'Shin strength & shin splint prevention', technique: 'Lean back against wall, flex toes up to shins.' }
    ],
    warmup: 'Foam roll calves, IT band, and hamstrings.',
    cooldown: 'Couch stretch (2 min per side).',
    videoKeyword: 'Ankle dorsiflexion knee prehab poliquin step up'
  },
  {
    id: 'mobility-shoulder-spine',
    name: 'Shoulder Rotator & Thoracic Spine Freedom',
    category: 'mobility',
    level: 'All Levels',
    goal: 'Overhead Range & Rotational Spine Health',
    daysPerWeek: 3,
    duration: '30 Min',
    equipment: 'Bands, Foam Roller, Light DB',
    description: 'Essential bulletproofing for throwing, spiking, and overhead pressing sports.',
    exercises: [
      { name: 'Thoracic Extension on Foam Roller', sets: 3, reps: '10 extensions', rest: '30s', benefit: 'Thoracic spine extension for overhead posture', technique: 'Support head, extend upper back over roller.' },
      { name: 'Band Pull-Aparts & Face Pulls', sets: 4, reps: '20 reps', rest: '45s', benefit: 'Rear deltoid & rhomboid posture control', technique: 'Squeeze shoulder blades together at end range.' },
      { name: 'Sidelying Thoracic Windmills', sets: 3, reps: '8 / side', rest: '45s', benefit: 'Rotational spine & chest opening', technique: 'Trace big circle with top arm, keep knees pinned.' }
    ],
    warmup: 'Cat-cow, shoulder circles.',
    cooldown: 'Childs pose + Thread the needle stretch.',
    videoKeyword: 'Thoracic spine mobility shoulder bulletproofing'
  },
  {
    id: 'sport-volleyball',
    name: 'Volleyball Vertical Jump & Shoulder Armour',
    category: 'sport-specific',
    level: 'Intermediate',
    goal: 'Max Jump Height & Rotational Spike Power',
    daysPerWeek: 4,
    duration: '60 Min',
    equipment: 'Barbell, Dumbbells, Plyo Box, Bands',
    description: 'Designed specifically for setters, hitters, and blockers needing rapid approach jumps and shoulder safety.',
    exercises: [
      { name: 'Penultimate Approach Jump Drills', sets: 4, reps: '5 jumps', rest: '2 Min', benefit: 'Horizontal-to-vertical conversion speed', technique: 'Long 2nd step, fast plant-and-block foot placement.' },
      { name: 'Barbell Jump Squats (Light 20-30% 1RM)', sets: 4, reps: '5 jumps', rest: '2 Min', benefit: 'Loaded explosive extension', technique: 'Dip quickly and spring up with max velocity.' },
      { name: 'Bulgarian Split Squats (Heavy)', sets: 3, reps: '6 / leg', rest: '90s', benefit: 'Single-leg landing stability & quad strength', technique: 'Upright posture, lower rear knee controlled.' },
      { name: 'Band External Shoulder Rotations & Y-T-W', sets: 3, reps: '15 reps', rest: '60s', benefit: 'Spiking shoulder rotator cuff protection', technique: 'Keep elbow glued to ribcage.' },
      { name: 'Landmine Rotational Press', sets: 3, reps: '8 / side', rest: '60s', benefit: 'Overhead spike rotational core power', technique: 'Pivot rear foot, drive bar diagonally overhead.' }
    ],
    warmup: 'Arm swings, leg swings, pogo hops.',
    cooldown: 'Shoulder doorway stretch + calf stretch.',
    videoKeyword: 'Volleyball vertical jump training program'
  },
  {
    id: 'sport-cricket',
    name: 'Cricket Pace Bowling & Explosive Batting Power',
    category: 'sport-specific',
    level: 'Intermediate',
    goal: 'Bowling Shoulder Speed & Wicket Sprinting',
    daysPerWeek: 4,
    duration: '60 Min',
    equipment: 'Trap Bar, Medicine Ball, Cable Machine',
    description: 'Targeted for pace bowlers requiring front-leg block stability and batters needing fast 22-yard accelerations.',
    exercises: [
      { name: 'Front-Leg Block Split Squat Iso Hold', sets: 4, reps: '30 sec / leg', rest: '90s', benefit: 'Bowler front leg force absorbtion', technique: 'Firm front heel lock, prevent knee collapse.' },
      { name: 'Rotational Medicine Ball Wall Throws', sets: 4, reps: '8 / side', rest: '90s', benefit: 'Batting shot power & bowling torso rotation', technique: 'Hip drive leads the arm throw into wall.' },
      { name: 'Sled Resisted 10m Sprints', sets: 5, reps: '10m sprint', rest: '90s', benefit: 'First 3-step wicket acceleration', technique: 'Drive low angle, push earth back.' },
      { name: 'Single-Arm DB Row & Cable Anti-Rotation', sets: 3, reps: '10 reps', rest: '60s', benefit: 'Throwing arm lat stability', technique: 'Pull elbow to hip.' }
    ],
    warmup: 'Thoracic rotations, hip mobility.',
    cooldown: 'Lat stretch & hamstring stretch.',
    videoKeyword: 'Cricket bowler physical training workout'
  },
  {
    id: 'sport-badminton',
    name: 'Badminton Court Agility & Smash Power',
    category: 'sport-specific',
    level: 'Intermediate',
    goal: '6-Point Footwork Speed & Forearm Snap',
    daysPerWeek: 4,
    duration: '50 Min',
    equipment: 'Dumbbells, Resistance Bands, Agility Ladder',
    description: 'Combines rapid multidirectional deceleration, explosive court lunges, and wrist pronation strength.',
    exercises: [
      { name: 'Explosive Low Dumbbell Court Lunges', sets: 4, reps: '8 / leg', rest: '90s', benefit: 'Net lunge recovery speed', technique: 'Step out wide, land heel-first, push back explosively.' },
      { name: 'Agility Ladder 2-In-2-Out & Shuffle', sets: 4, reps: '30 sec drills', rest: '60s', benefit: 'Quick foot contact & split-step timing', technique: 'Light on balls of feet.' },
      { name: 'Band Wrist Pronation & Overhead Snap', sets: 3, reps: '15 reps', rest: '45s', benefit: 'Smash speed & forearm endurance', technique: 'Fast wrist snap against light band resistance.' },
      { name: 'Lateral Skater Hops with Stick Landing', sets: 4, reps: '10 total', rest: '60s', benefit: 'Sideways court push-off stability', technique: 'Bound sideways, freeze on 1 leg for 2s.' }
    ],
    warmup: 'Ankle bounces, wrist circles.',
    cooldown: 'Calf & Achilles stretch.',
    videoKeyword: 'Badminton footwork and smash workout'
  },
  {
    id: 'sport-sprint',
    name: 'Sprint Mechanics & Max Velocity (100m/200m)',
    category: 'speed',
    level: 'Intermediate',
    goal: 'Top-Speed Velocity & Acceleration Angle',
    daysPerWeek: 4,
    duration: '55 Min',
    equipment: 'Barbell, Resistance Bands, Sled',
    description: 'Designed for track sprinters focusing on drive phase, upright posture, and hamstring health.',
    exercises: [
      { name: 'Wall Drill A-Skips & High Knee Drive', sets: 4, reps: '15 sec', rest: '60s', benefit: 'Piston leg action & hip flexion speed', technique: '45 degree torso against wall, drive knee up hard.' },
      { name: 'Standing Broad Jump to 10m Acceleration', sets: 4, reps: '4 reps', rest: '2 Min', benefit: 'Horizontal push out of blocks', technique: 'Jump forward, land into immediate sprint stride.' },
      { name: 'Heavy Barbell Hip Thrusts', sets: 4, reps: '6 reps', rest: '2 Min', benefit: 'Glute max horizontal force', technique: 'Squeeze glutes hard at top lock.' },
      { name: 'Nordic Hamstring Curls', sets: 3, reps: '5 negative reps', rest: '2 Min', benefit: 'High-speed hamstring strain prevention', technique: 'Lower body slowly under control.' }
    ],
    warmup: 'Leg swings, ankling, striders.',
    cooldown: 'Foam roll hamstrings & hip flexors.',
    videoKeyword: '100m sprinter strength and acceleration workout'
  }
];

// -------------------------------------------------------------
// GROUND TRAINING DRILLS DATABASE (Field & Court Practice)
// -------------------------------------------------------------
const ATHLETE_GROUND_DRILLS = {
  'Volleyball': {
    title: 'Volleyball Court Jump & Spike Session',
    position: 'Hitter / Setter / Libero / Blocker',
    duration: '45 Min',
    drills: [
      { name: 'Approach Jump 4-Step Technique', duration: '10 Min', desc: 'Execute 15 max approach jumps focusing on smooth 2nd long step and arm swing back.' },
      { name: 'Lateral Block Shuffle & Press', duration: '8 Min', desc: 'Quick 2-step shuffle along net, explode vertically and press hands over net.' },
      { name: 'Serve-Receive to Transition Sprint', duration: '10 Min', desc: 'Pass ball off wall/partner, immediately drop back 3m to approach angle.' },
      { name: 'Spike Snap & Wall Target Drills', duration: '10 Min', desc: 'High contact spike snap practice focusing on wrist snap and core rotation.' }
    ]
  },
  'Cricket': {
    title: 'Cricket Field Sprint & Wicket Agility',
    position: 'Fast Bowler / Batter / Fielder',
    duration: '50 Min',
    drills: [
      { name: '22-Yard Wicket Sprint & Turn Drills', duration: '12 Min', desc: 'Sprint 20m, touch bat line, turn 180 degrees, sprint back. 6 sets.' },
      { name: 'Bowling Approach Run-Up Consistency', duration: '15 Min', desc: 'Practice 10 full approach runs measuring stride rhythm and explosive stride stride block.' },
      { name: 'Boundary Reaction & Pickup-Throw', duration: '10 Min', desc: 'Partner rolls ball to boundary, sprint, scoop 1-handed, throw to target keeper.' },
      { name: 'High Catch & Soft Hands Drills', duration: '8 Min', desc: 'High skyer catches cushion technique.' }
    ]
  },
  'Badminton': {
    title: 'Badminton 6-Point Court Footwork',
    position: 'Single / Doubles Player',
    duration: '40 Min',
    drills: [
      { name: 'Split-Step to Corner Shadow Footwork', duration: '12 Min', desc: 'Partner points to 1 of 6 corners; execute split-step and shadow stroke.' },
      { name: 'Explosive Net Lunge & Recovery', duration: '10 Min', desc: 'Sprint to net, deep lunge, retrieve shuttle, push off front leg back to center.' },
      { name: 'Smash & Jump Rear Court Recovery', duration: '10 Min', desc: 'Scissor jump in rear court, smash shuttle, recovery sprint to midcourt.' },
      { name: 'Multi-Shuttle Rapid Defense', duration: '8 Min', desc: 'Fast defensive drive block returns.' }
    ]
  },
  'Sprinting': {
    title: 'Track Acceleration & Fly 20m Velocity',
    position: '100m / 200m / 400m Sprinter',
    duration: '55 Min',
    drills: [
      { name: 'Wall Acceleration Drills & A-Skips', duration: '10 Min', desc: 'Proper drive angle, triple extension posture.' },
      { name: '10m / 20m Block & Crouch Starts', duration: '15 Min', desc: '6 max effort starts focusing on low head and aggressive backward push.' },
      { name: 'Fly 20m Max Velocity Runs', duration: '15 Min', desc: '30m build-up into 20m 100% max speed flying zone. 4 reps with 3 min full rest.' },
      { name: 'Tempo Strides & Cool Down Walk', duration: '10 Min', desc: 'Smooth strides for recovery.' }
    ]
  },
  'HYROX': {
    title: 'Outdoor HYROX Running & Station Combo',
    position: 'HYROX Athlete',
    duration: '60 Min',
    drills: [
      { name: '1km Run + 50m Dumbbell Farmers Walk', duration: '15 Min', desc: 'Run 1km at race pace, immediately pick up DBs and walk 50m without stopping.' },
      { name: '1km Run + 30 Burpee Broad Jumps', duration: '15 Min', desc: 'Run 1km, jump forward 30 times with chest to floor.' },
      { name: '1km Run + 50 Walking Lunges', duration: '15 Min', desc: 'Run 1km, deep walking lunges.' },
      { name: 'Cool Down & Hydration', duration: '15 Min', desc: 'Stretching and core recovery.' }
    ]
  }
};

// -------------------------------------------------------------
// INITIALIZATION ON DOM CONTENT LOADED
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAuth()) return;

  initSubnavTabs();
  initCategoryFilters();
  initGroundSportPills();
  updateMetricUnitLabel();

  await loadAthleteData();
  renderGymPlans('all');
});

// -------------------------------------------------------------
// SUB-TAB NAVIGATION
// -------------------------------------------------------------
function initSubnavTabs() {
  const btns = document.querySelectorAll('.athlete-tab-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });
}

function switchTab(tabId) {
  document.querySelectorAll('.athlete-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

  const activeBtn = document.querySelector(`.athlete-tab-btn[data-tab="${tabId}"]`);
  const activePanel = document.getElementById(tabId);

  if (activeBtn) activeBtn.classList.add('active');
  if (activePanel) activePanel.classList.add('active');

  if (tabId === 'tab-progress' && chartInstance === null) {
    renderAthleteChart();
  }
}

// -------------------------------------------------------------
// GYM CATEGORY FILTERS
// -------------------------------------------------------------
function initCategoryFilters() {
  const container = document.getElementById('gym-category-filters');
  if (!container) return;

  container.addEventListener('click', (e) => {
    if (e.target.classList.contains('cat-btn')) {
      container.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const cat = e.target.getAttribute('data-cat');
      renderGymPlans(cat);
    }
  });
}

function renderGymPlans(category) {
  const container = document.getElementById('gym-plans-container');
  if (!container) return;

  let filtered = ATHLETE_GYM_PLANS;
  if (category !== 'all') {
    filtered = ATHLETE_GYM_PLANS.filter(p => p.category === category);
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">
        No workout plans found for this category yet.
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(plan => `
    <div class="athlete-card ${plan.category}">
      <div>
        <div class="athlete-card-badge badge-${plan.category}">${plan.category.toUpperCase()}</div>
        <h3 class="athlete-card-title">${plan.name}</h3>
        <div class="athlete-card-meta">
          <span class="meta-item">🎯 ${plan.level}</span>
          <span class="meta-item">⏱️ ${plan.duration}</span>
          <span class="meta-item">📅 ${plan.daysPerWeek} Days/Wk</span>
        </div>
        <p class="athlete-card-desc">${plan.description}</p>
      </div>
      <div class="athlete-card-footer">
        <button class="view-plan-btn" onclick="openAthleteWorkoutModal('${plan.id}')">
          🔍 View Full Plan & Exercises
        </button>
      </div>
    </div>
  `).join('');
}

// -------------------------------------------------------------
// WORKOUT PLAN MODAL
// -------------------------------------------------------------
let activeModalRestTimer = null;
let activeModalRestSeconds = 0;

function openAthleteWorkoutModal(planId) {
  const plan = ATHLETE_GYM_PLANS.find(p => p.id === planId);
  if (!plan) return;

  const content = document.getElementById('modal-plan-content');
  const modal = document.getElementById('workout-detail-modal');

  const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(plan.videoKeyword)}`;

  content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
      <div>
        <div class="athlete-card-badge badge-${plan.category}" style="font-size:0.8rem;">${plan.category.toUpperCase()}</div>
        <h2 style="font-size:1.4rem; color:var(--text); margin:0.5rem 0;">${plan.name}</h2>
        <p style="color:var(--text-muted); font-size:0.88rem; margin-bottom:0.5rem;">${plan.description}</p>
      </div>
      <div style="text-align:right; background:var(--surface2); padding:0.6rem 1rem; border-radius:8px; border:1px solid var(--border); min-width:130px;">
        <span style="font-size:0.72rem; color:var(--text-muted); display:block;">SESSION PROGRESS</span>
        <strong id="completed-ex-count" style="font-size:1.2rem; color:var(--accent);">0 / ${plan.exercises.length}</strong>
      </div>
    </div>

    <div style="display:flex; flex-wrap:wrap; gap:1rem; background:var(--surface2); padding:0.85rem; border-radius:8px; margin-bottom:1rem; font-size:0.85rem;">
      <div><strong style="color:var(--accent);">Level:</strong> ${plan.level}</div>
      <div><strong style="color:var(--accent);">Equipment:</strong> ${plan.equipment}</div>
      <div><strong style="color:var(--accent);">Duration:</strong> ${plan.duration}</div>
    </div>

    <!-- Rest Timer Widget inside Modal -->
    <div style="background:var(--surface2); border:1px solid var(--border); padding:0.75rem 1rem; border-radius:8px; margin-bottom:1rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
      <div>
        <strong style="color:var(--accent3); font-size:0.88rem;">⏱️ Live Rest Recovery Timer</strong>
        <div style="font-size:0.75rem; color:var(--text-muted);">Start rest interval countdown between sets</div>
      </div>
      <div style="display:flex; align-items:center; gap:0.5rem;">
        <div id="modal-rest-timer-val" style="font-family:monospace; font-size:1.3rem; font-weight:800; color:var(--accent); min-width:60px;">00:00</div>
        <button class="cat-btn" onclick="startModalRestTimer(60)" style="padding:0.3rem 0.6rem; font-size:0.78rem;">+60s</button>
        <button class="cat-btn" onclick="startModalRestTimer(90)" style="padding:0.3rem 0.6rem; font-size:0.78rem;">+90s</button>
        <button class="cat-btn" onclick="resetModalRestTimer()" style="padding:0.3rem 0.6rem; font-size:0.78rem; background:var(--surface); border:1px solid var(--border);">Reset</button>
      </div>
    </div>

    <div style="margin-bottom:1rem; font-size:0.85rem; color:var(--text-muted);">
      <strong style="color:var(--accent3);">🔥 Warm-Up Routine:</strong> ${plan.warmup}
    </div>

    <h3 style="font-size:1.05rem; color:var(--text); margin-top:1rem; margin-bottom:0.75rem; display:flex; justify-content:space-between; align-items:center;">
      <span>🏋️ Exercises & Athletic Technique</span>
      <span style="font-size:0.78rem; color:var(--text-muted); font-weight:normal;">Check off completed exercises</span>
    </h3>
    <table class="exercise-table">
      <thead>
        <tr>
          <th style="width:40px; text-align:center;">Done</th>
          <th>Exercise</th>
          <th>Sets × Reps</th>
          <th>Rest</th>
          <th>Technique</th>
        </tr>
      </thead>
      <tbody>
        ${plan.exercises.map((ex, idx) => `
          <tr id="ex-row-${idx}">
            <td style="text-align:center;">
              <input type="checkbox" onchange="toggleExerciseCheck(this, ${idx}, ${plan.exercises.length})" style="width:18px; height:18px; cursor:pointer;" />
            </td>
            <td>
              <div class="exercise-name">${ex.name}</div>
              <div class="exercise-benefit">${ex.benefit}</div>
            </td>
            <td style="font-weight:700; color:var(--text);">${ex.sets} × ${ex.reps}</td>
            <td>
              <button class="cat-btn" onclick="parseAndStartRest('${ex.rest}')" style="padding:0.2rem 0.45rem; font-size:0.75rem; white-space:nowrap;">
                ⏱️ ${ex.rest}
              </button>
            </td>
            <td style="font-size:0.82rem; color:var(--text-muted);">${ex.technique}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div style="margin-top:1.25rem; font-size:0.85rem; color:var(--text-muted);">
      <strong style="color:var(--accent2);">🧘 Cool-Down Routine:</strong> ${plan.cooldown}
    </div>

    <div style="margin-top:1.5rem; display:flex; flex-wrap:wrap; gap:0.75rem;">
      <button class="btn-primary" onclick="finishLiveWorkout('${plan.id}')" style="padding:0.6rem 1.25rem; font-size:0.88rem; flex:2; min-width:200px;">
        ✅ Finish & Log Completed Workout
      </button>
      <a href="${youtubeUrl}" target="_blank" rel="noopener" class="btn-secondary" style="text-decoration:none; display:inline-flex; align-items:center; justify-content:center; font-size:0.85rem; padding:0.6rem 1rem; background:var(--surface2); border:1px solid var(--border); color:var(--text); border-radius:8px; flex:1; min-width:140px;">
        ▶️ Watch Video Demo
      </a>
      <button class="view-plan-btn" onclick="closeAthleteModal()" style="width:auto; padding:0.6rem 1rem;">Close</button>
    </div>
  `;

  modal.classList.add('open');
}

function toggleExerciseCheck(cb, idx, total) {
  const row = document.getElementById(`ex-row-${idx}`);
  if (row) {
    if (cb.checked) {
      row.style.opacity = '0.5';
      row.style.textDecoration = 'line-through';
    } else {
      row.style.opacity = '1';
      row.style.textDecoration = 'none';
    }
  }

  const checkboxes = document.querySelectorAll('#workout-detail-modal input[type="checkbox"]');
  let checkedCount = 0;
  checkboxes.forEach(c => { if (c.checked) checkedCount++; });

  const counter = document.getElementById('completed-ex-count');
  if (counter) counter.textContent = `${checkedCount} / ${total}`;
}

function parseAndStartRest(restStr) {
  let seconds = 60;
  if (restStr.includes('90')) seconds = 90;
  else if (restStr.includes('2 Min') || restStr.includes('120')) seconds = 120;
  else if (restStr.includes('3 Min')) seconds = 180;
  else if (restStr.includes('45')) seconds = 45;
  startModalRestTimer(seconds);
}

function startModalRestTimer(sec) {
  if (activeModalRestTimer) clearInterval(activeModalRestTimer);
  activeModalRestSeconds = sec;
  updateModalRestTimerDisplay();

  activeModalRestTimer = setInterval(() => {
    activeModalRestSeconds--;
    if (activeModalRestSeconds <= 0) {
      clearInterval(activeModalRestTimer);
      activeModalRestSeconds = 0;
      updateModalRestTimerDisplay();
      if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
    } else {
      updateModalRestTimerDisplay();
    }
  }, 1000);
}

function resetModalRestTimer() {
  if (activeModalRestTimer) clearInterval(activeModalRestTimer);
  activeModalRestSeconds = 0;
  updateModalRestTimerDisplay();
}

function updateModalRestTimerDisplay() {
  const el = document.getElementById('modal-rest-timer-val');
  if (!el) return;
  const mins = Math.floor(activeModalRestSeconds / 60).toString().padStart(2, '0');
  const secs = (activeModalRestSeconds % 60).toString().padStart(2, '0');
  el.textContent = `${mins}:${secs}`;
}

async function finishLiveWorkout(planId) {
  const plan = ATHLETE_GYM_PLANS.find(p => p.id === planId);
  if (!plan) return;

  const checkboxes = document.querySelectorAll('#workout-detail-modal input[type="checkbox"]');
  const completedExercises = [];
  checkboxes.forEach((cb, idx) => {
    if (cb.checked && plan.exercises[idx]) {
      completedExercises.push(plan.exercises[idx].name);
    }
  });

  try {
    const res = await authFetch('/api/athlete/workout/complete', {
      method: 'POST',
      body: JSON.stringify({
        planId: plan.id,
        planName: plan.name,
        category: plan.category,
        durationMinutes: parseInt(plan.duration) || 60,
        completedExercises
      })
    });

    if (res && res.completionRecord) {
      alert(`🎉 Workout Logged: ${plan.name}!\nGreat job completing ${completedExercises.length} exercises today.`);
    } else {
      alert(`🎉 Session Completed: ${plan.name}!`);
    }

    closeAthleteModal();
    await loadAthleteData();
  } catch (err) {
    console.error('Failed to log workout completion:', err);
    closeAthleteModal();
    alert(`🎉 Session completed: ${plan.name}!`);
  }
}

function closeAthleteModal() {
  if (activeModalRestTimer) clearInterval(activeModalRestTimer);
  document.getElementById('workout-detail-modal').classList.remove('open');
}

// -------------------------------------------------------------
// GROUND TRAINING DRILLS ENGINE
// -------------------------------------------------------------
function initGroundSportPills() {
  const container = document.getElementById('ground-sport-pills');
  if (!container) return;

  const sports = ['Volleyball', 'Cricket', 'Badminton', 'Sprinting', 'HYROX'];
  const icons = { Volleyball: '🏐', Cricket: '🏏', Badminton: '🏸', Sprinting: '🏃', HYROX: '🔥' };

  container.innerHTML = sports.map((s, idx) => `
    <div class="sport-pill ${idx === 0 ? 'active' : ''}" onclick="selectGroundSport('${s}', this)">
      <span class="sport-pill-icon">${icons[s]}</span>
      <span class="sport-pill-name">${s}</span>
    </div>
  `).join('');

  selectGroundSport('Volleyball');
}

function selectGroundSport(sportName, el) {
  if (el) {
    document.querySelectorAll('.sport-pill').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
  }

  const session = ATHLETE_GROUND_DRILLS[sportName] || ATHLETE_GROUND_DRILLS['Volleyball'];
  const display = document.getElementById('ground-session-display');
  if (!display) return;

  display.innerHTML = `
    <div class="dashboard-grid">
      <!-- Session Details & Drill List -->
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <h2 class="card-title" style="margin:0;">${session.title}</h2>
          <span class="athlete-card-badge badge-speed">${session.duration}</span>
        </div>
        <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:1.25rem;">
          Target Position: <strong style="color:var(--text);">${session.position}</strong>
        </p>

        <div style="display:flex; flex-direction:column; gap:0.85rem;">
          ${session.drills.map((d, i) => `
            <div style="background:var(--surface2); padding:0.9rem; border-radius:8px; border-left:3px solid var(--accent3);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.25rem;">
                <strong style="color:var(--text); font-size:0.92rem;">${i+1}. ${d.name}</strong>
                <span style="font-size:0.75rem; color:var(--accent3); font-weight:700;">${d.duration}</span>
              </div>
              <p style="font-size:0.82rem; color:var(--text-muted); margin:0;">${d.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Interactive Guidance Timer -->
      <div class="card" style="display:flex; flex-direction:column; justify-content:center; align-items:center;">
        <h2 class="card-title">⏱️ Interactive Drill Timer</h2>
        <div class="timer-container" style="width:100%;">
          <div style="font-size:0.85rem; color:var(--text-muted);">Active Ground Session</div>
          <div class="timer-display" id="timer-val">00:00</div>
          <div class="timer-controls">
            <button class="btn-primary" onclick="toggleTimer()" id="timer-toggle-btn">▶️ Start Drill</button>
            <button class="cat-btn" onclick="resetTimer()">🔄 Reset</button>
          </div>
        </div>
        <p style="font-size:0.8rem; color:var(--text-muted); text-align:center;">
          Use this timer on the court/field to track your drill interval durations and rest recovery periods.
        </p>
      </div>
    </div>
  `;
}

function toggleTimer() {
  const btn = document.getElementById('timer-toggle-btn');
  if (isTimerRunning) {
    clearInterval(timerInterval);
    isTimerRunning = false;
    if (btn) btn.textContent = '▶️ Resume Drill';
  } else {
    isTimerRunning = true;
    if (btn) btn.textContent = '⏸️ Pause';
    timerInterval = setInterval(() => {
      timerSeconds++;
      updateTimerDisplay();
    }, 1000);
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  isTimerRunning = false;
  timerSeconds = 0;
  updateTimerDisplay();
  const btn = document.getElementById('timer-toggle-btn');
  if (btn) btn.textContent = '▶️ Start Drill';
}

function updateTimerDisplay() {
  const el = document.getElementById('timer-val');
  if (!el) return;
  const mins = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
  const secs = (timerSeconds % 60).toString().padStart(2, '0');
  el.textContent = `${mins}:${secs}`;
}

// -------------------------------------------------------------
// ATHLETE NUTRITION ENGINE
// -------------------------------------------------------------
function updateAthleteDietUI() {
  const type = document.getElementById('diet-type-select')?.value || 'veg';
  const budget = document.getElementById('diet-budget-select')?.value || 'moderate';
  const wheyFree = document.getElementById('diet-whey-select')?.value === 'true';

  // Calculate athletic macros based on 70kg athlete baseline
  const calories = 2600;
  const protein = 150; // 2.1g / kg
  const carbs = 340;   // 4.8g / kg
  const fat = 65;      // 0.9g / kg

  const macroGrid = document.getElementById('athlete-macro-cards');
  if (macroGrid) {
    macroGrid.innerHTML = `
      <div class="stat-card">
        <div class="stat-icon">🔥</div>
        <div class="stat-info">
          <div class="stat-value">${calories} kcal</div>
          <div class="stat-label">Daily Athletic Energy</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🥩</div>
        <div class="stat-info">
          <div class="stat-value">${protein}g</div>
          <div class="stat-label">Muscle Repair Protein</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🍚</div>
        <div class="stat-info">
          <div class="stat-value">${carbs}g</div>
          <div class="stat-label">Glycogen Carb Engine</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🥑</div>
        <div class="stat-info">
          <div class="stat-value">${fat}g</div>
          <div class="stat-label">Hormonal Healthy Fats</div>
        </div>
      </div>
    `;
  }

  // Generate Indian Meals
  const mealsTimeline = document.getElementById('athlete-meals-timeline');
  if (!mealsTimeline) return;

  let proteinSource = 'Paneer / Sattu / Sprouts';
  if (type === 'non-veg') proteinSource = 'Eggs / Chicken Breast / Fish';
  if (type === 'egg') proteinSource = 'Boiled Eggs / Omelette / Sattu';
  if (type === 'vegan') proteinSource = 'Soy Chunks / Tofu / Rajma';

  let postShake = wheyFree
    ? 'High-Protein Roasted Chana Sattu Drink (30g Sattu + Jaggery + Water)'
    : '1 Scoop Whey Protein + 1 Banana + 300ml Toned Milk';

  mealsTimeline.innerHTML = `
    <div class="timeline-item">
      <div class="timeline-time">07:00 AM</div>
      <div class="timeline-body">
        <div class="timeline-title">🌅 Pre-Training Hydration & Glycogen</div>
        <div class="timeline-desc">1 Large Banana + 5 soaked Almonds + 500ml Water with a pinch of Pink Salt / ORS.</div>
      </div>
    </div>
    <div class="timeline-item">
      <div class="timeline-time">09:30 AM</div>
      <div class="timeline-body">
        <div class="timeline-title">🥤 Post-Session Immediate Recovery Window</div>
        <div class="timeline-desc">${postShake}</div>
      </div>
    </div>
    <div class="timeline-item">
      <div class="timeline-time">01:30 PM</div>
      <div class="timeline-body">
        <div class="timeline-title">🍛 High-Performance Lunch</div>
        <div class="timeline-desc">
          2 Whole Wheat Rotis / 1 Bowl Brown Rice + 150g ${proteinSource} + 1 Bowl Dal / Rajma + Green Salad + Curd.
        </div>
      </div>
    </div>
    <div class="timeline-item">
      <div class="timeline-time">05:30 PM</div>
      <div class="timeline-body">
        <div class="timeline-title">🍎 Match / Training Afternoon Snack</div>
        <div class="timeline-desc">Roasted Chana (100g) + 1 Apple or Boiled Sweet Potato with Chaat Masala.</div>
      </div>
    </div>
    <div class="timeline-item">
      <div class="timeline-time">08:30 PM</div>
      <div class="timeline-body">
        <div class="timeline-title">🌙 Recovery Dinner & Casein</div>
        <div class="timeline-desc">
          Mixed Veg Sabzi + 100g ${type === 'non-veg' ? 'Grilled Fish / Chicken' : 'Low-Fat Paneer / Tofu'} + 1 Bowl Moong Dal + Warm Turmeric Milk before bed.
        </div>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// READINESS SUBMITTER
// -------------------------------------------------------------
async function handleReadinessSubmit(e) {
  e.preventDefault();
  const sleepHours = document.getElementById('read-sleep').value;
  const sleepQuality = document.getElementById('read-sleep-q').value;
  const soreness = document.getElementById('read-soreness').value;
  const fatigue = document.getElementById('read-fatigue').value;
  const motivation = document.getElementById('read-motivation').value;

  try {
    const res = await authFetch('/api/athlete/readiness', {
      method: 'POST',
      body: JSON.stringify({ sleepHours, sleepQuality, soreness, fatigue, motivation })
    });

    const score = res.latestLog.readinessScore;
    document.getElementById('readiness-score-val').textContent = score;

    let status = 'GREEN — Prime for High Intensity Training';
    let advice = 'Your recovery markers look optimal. Recommended today: High-power sprint or heavy athletic lifting session.';

    if (score < 60) {
      status = 'RED — High Fatigue / Needs Active Recovery';
      advice = 'Elevated soreness and CNS fatigue detected. Recommended: Light mobility, foam rolling, 30 min walking, and extra sleep.';
    } else if (score < 78) {
      status = 'YELLOW — Moderate Readiness / Adjust Volume';
      advice = 'Moderate fatigue detected. Reduce heavy jumps/sprints by 20% and focus on technical quality.';
    }

    document.getElementById('readiness-score-status').textContent = status;
    document.getElementById('readiness-advice').textContent = advice;
    document.getElementById('overview-readiness').textContent = `${score}%`;

  } catch (err) {
    console.error('Failed to save readiness log:', err);
  }
}

// -------------------------------------------------------------
// PERFORMANCE METRIC SUBMITTER & PROGRESS CHART
// -------------------------------------------------------------
function updateMetricUnitLabel() {
  const type = document.getElementById('met-type')?.value;
  const exGroup = document.getElementById('exercise-name-group');

  if (exGroup) {
    if (type === 'strength_pr' || type === 'iso_hold') {
      exGroup.style.display = 'block';
    } else {
      exGroup.style.display = 'none';
    }
  }
}

async function handleMetricSubmit(e) {
  e.preventDefault();
  const metricType = document.getElementById('met-type').value;
  const value = document.getElementById('met-val').value;
  const exerciseName = document.getElementById('met-exercise')?.value;
  const notes = document.getElementById('met-notes')?.value;

  let unit = 'cm';
  if (metricType.includes('sprint')) unit = 'sec';
  if (metricType === 'pull_ups') unit = 'reps';
  if (metricType === 'iso_hold') unit = 'sec';
  if (metricType === 'hyrox_time') unit = 'min';
  if (metricType === 'strength_pr') unit = 'kg';

  try {
    const newLog = await authFetch('/api/athlete/progress', {
      method: 'POST',
      body: JSON.stringify({ metricType, value, unit, exerciseName, notes })
    });

    athleteLogs.unshift(newLog);
    renderPRSummary();
    renderAthleteChart();
    updateOverviewStats();
    document.getElementById('athlete-metric-form').reset();
    updateMetricUnitLabel();
  } catch (err) {
    console.error('Failed to log metric:', err);
  }
}

function renderPRSummary() {
  const grid = document.getElementById('pr-cards-grid');
  if (!grid) return;

  const prs = {};
  athleteLogs.forEach(l => {
    if (!prs[l.metricType]) {
      prs[l.metricType] = l;
    } else {
      // For sprint & hyrox, lower is better. For jumps/strength, higher is better.
      if (l.metricType.includes('sprint') || l.metricType === 'hyrox_time') {
        if (l.value < prs[l.metricType].value) prs[l.metricType] = l;
      } else {
        if (l.value > prs[l.metricType].value) prs[l.metricType] = l;
      }
    }
  });

  const labels = {
    vertical_jump: '🦘 Vert Jump',
    broad_jump: '📏 Broad Jump',
    sprint_10m: '⚡ 10m Sprint',
    sprint_30m: '🏃 30m Sprint',
    sprint_100m: '🥇 100m Sprint',
    pull_ups: '💪 Pull-ups',
    iso_hold: '🧘 Iso Hold',
    hyrox_time: '🔥 HYROX Time',
    strength_pr: '🏋️ Strength PR'
  };

  const keys = Object.keys(prs);
  if (keys.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1; color:var(--text-muted); font-size:0.85rem;">No PRs logged yet. Use the form to record your jump height or sprint times!</div>`;
    return;
  }

  grid.innerHTML = keys.map(k => `
    <div style="background:var(--surface2); padding:0.75rem; border-radius:8px; border-top:3px solid var(--accent);">
      <span style="font-size:0.72rem; color:var(--text-muted); display:block;">${labels[k] || k}</span>
      <strong style="font-size:1.1rem; color:var(--text);">${prs[k].value} ${prs[k].unit}</strong>
    </div>
  `).join('');
}

function renderAthleteChart() {
  const canvas = document.getElementById('athlete-chart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (chartInstance) chartInstance.destroy();

  const sorted = [...athleteLogs].reverse();
  const labels = sorted.map(l => new Date(l.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
  const dataVals = sorted.map(l => l.value);

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels.length ? labels : ['Day 1', 'Day 2', 'Day 3'],
      datasets: [{
        label: 'Logged Metric Values',
        data: dataVals.length ? dataVals : [60, 62, 65],
        borderColor: '#6c63ff',
        backgroundColor: 'rgba(108, 99, 255, 0.15)',
        borderWidth: 3,
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#22d3a5'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#a0a0b8' } }
      },
      scales: {
        x: { ticks: { color: '#a0a0b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { ticks: { color: '#a0a0b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
      }
    }
  });
}

function updateOverviewStats() {
  const vert = athleteLogs.find(l => l.metricType === 'vertical_jump');
  const sprint = athleteLogs.find(l => l.metricType === 'sprint_100m');

  if (vert) document.getElementById('overview-jump').textContent = `${vert.value} cm`;
  if (sprint) document.getElementById('overview-sprint').textContent = `${sprint.value} s`;
}

// -------------------------------------------------------------
// UNIFIED WEEKLY SCHEDULE GENERATOR
// -------------------------------------------------------------
function renderWeeklySchedule() {
  const grid = document.getElementById('weekly-schedule-grid');
  if (!grid) return;

  const sport = userProfile?.sport || 'General Athletic';
  const goal = userProfile?.primaryGoal || 'Explosive Power';

  let days = [
    { day: 'Monday', title: `🏋️ Lower Body ${goal} & Vert Jump`, type: 'Gym Training', details: 'Depth jumps, Trap Bar Deadlifts, Spanish squat isometric holds.' },
    { day: 'Tuesday', title: `🏟️ ${sport} Field Acceleration & COD`, type: 'Ground Drills', details: `Specific ${sport} agility drills, 10m crouch starts, split-step footwork.` },
    { day: 'Wednesday', title: '🧘 Active Recovery & Mobility', type: 'Rest & Recovery', details: '30 min brisk walk, Copenhagen planks, foam rolling calves and quads.' },
    { day: 'Thursday', title: `🏋️ Upper Body Push-Pull & ${sport} Power`, type: 'Gym Training', details: 'Weighted pull-ups, landmine rotational press, med ball slams.' },
    { day: 'Friday', title: `🏟️ ${sport} Match Simulation & Drills`, type: 'Field / Court Practice', details: `High-intensity ${sport} specific court/field drills and match play.` },
    { day: 'Saturday', title: '🔥 HYROX Work Capacity / Conditioning', type: 'Conditioning', details: 'Sled pushes, rowing intervals, farmer carries, wall balls.' },
    { day: 'Sunday', title: '🌙 Full Rest & Glycogen Replenishment', type: 'Complete Rest', details: 'Tart cherry juice, passive stretching, 9 hours sleep.' }
  ];

  grid.innerHTML = days.map(d => `
    <div class="card" style="border-left: 4px solid var(--accent); padding:1rem;">
      <div style="font-size:0.78rem; font-weight:800; color:var(--accent); text-transform:uppercase;">${d.day}</div>
      <h4 style="font-size:0.98rem; color:var(--text); margin:0.35rem 0;">${d.title}</h4>
      <div style="font-size:0.75rem; color:var(--accent3); font-weight:700; margin-bottom:0.4rem;">${d.type}</div>
      <p style="font-size:0.82rem; color:var(--text-muted); margin:0;">${d.details}</p>
    </div>
  `).join('');
}

// -------------------------------------------------------------
// ATHLETE WIZARD & RESET MODALS
// -------------------------------------------------------------
function openAthleteWizardModal() {
  if (userProfile) {
    if (document.getElementById('wiz-sport')) document.getElementById('wiz-sport').value = userProfile.sport || 'General Athletic';
    if (document.getElementById('wiz-secondary-sport')) document.getElementById('wiz-secondary-sport').value = userProfile.secondarySport || '';
    if (document.getElementById('wiz-position')) document.getElementById('wiz-position').value = userProfile.positionOrEvent || '';
    if (document.getElementById('wiz-level')) document.getElementById('wiz-level').value = userProfile.level || 'intermediate';
    if (document.getElementById('wiz-goal')) document.getElementById('wiz-goal').value = userProfile.primaryGoal || 'Explosive Power & Speed';
    if (document.getElementById('wiz-days')) document.getElementById('wiz-days').value = userProfile.trainingDaysPerWeek || 4;
    if (document.getElementById('wiz-age')) document.getElementById('wiz-age').value = userProfile.age || '';
    if (document.getElementById('wiz-weight')) document.getElementById('wiz-weight').value = userProfile.bodyWeight || '';
    if (document.getElementById('wiz-height')) document.getElementById('wiz-height').value = userProfile.height || '';
    if (document.getElementById('wiz-duration')) document.getElementById('wiz-duration').value = userProfile.sessionDuration || '60 Min';
    if (document.getElementById('wiz-equipment')) document.getElementById('wiz-equipment').value = userProfile.equipment || 'Full Gym';
    if (document.getElementById('wiz-location')) document.getElementById('wiz-location').value = userProfile.trainingLocation || 'Mixed';
    if (document.getElementById('wiz-diet-pref')) document.getElementById('wiz-diet-pref').value = userProfile.dietPreference || 'veg';
    if (document.getElementById('wiz-budget')) document.getElementById('wiz-budget').value = userProfile.dietBudget || 'moderate';
    if (document.getElementById('wiz-whey')) document.getElementById('wiz-whey').value = userProfile.isWheyFree ? 'true' : 'false';
    if (document.getElementById('wiz-comp-date') && userProfile.competitionDate) {
      document.getElementById('wiz-comp-date').value = new Date(userProfile.competitionDate).toISOString().split('T')[0];
    }
  }
  document.getElementById('athlete-wizard-modal').classList.add('open');
}

function closeWizardModal() {
  document.getElementById('athlete-wizard-modal').classList.remove('open');
}

function openResetProfileModal() {
  document.getElementById('athlete-reset-modal').classList.add('open');
}

function closeResetProfileModal() {
  document.getElementById('athlete-reset-modal').classList.remove('open');
}

async function confirmResetProfile() {
  try {
    const res = await authFetch('/api/athlete/profile/reset', {
      method: 'POST'
    });
    if (res && res.profile) {
      userProfile = res.profile;
      applyUserProfileToUI();
      closeResetProfileModal();
      alert('🔄 Sport profile reset to defaults.');
    }
  } catch (err) {
    console.error('Failed to reset profile:', err);
    alert('Failed to reset profile. Please try again.');
  }
}

async function handleWizardSubmit(e) {
  e.preventDefault();
  const submitBtn = e.target.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving & Reconfiguring...';
  }

  const sport = document.getElementById('wiz-sport')?.value;
  const secondarySport = document.getElementById('wiz-secondary-sport')?.value;
  const positionOrEvent = document.getElementById('wiz-position')?.value;
  const level = document.getElementById('wiz-level')?.value;
  const primaryGoal = document.getElementById('wiz-goal')?.value;
  const trainingDaysPerWeek = Number(document.getElementById('wiz-days')?.value || 4);
  const age = document.getElementById('wiz-age')?.value ? Number(document.getElementById('wiz-age').value) : undefined;
  const bodyWeight = document.getElementById('wiz-weight')?.value ? Number(document.getElementById('wiz-weight').value) : undefined;
  const height = document.getElementById('wiz-height')?.value ? Number(document.getElementById('wiz-height').value) : undefined;
  const sessionDuration = document.getElementById('wiz-duration')?.value;
  const equipment = document.getElementById('wiz-equipment')?.value;
  const trainingLocation = document.getElementById('wiz-location')?.value;
  const dietPreference = document.getElementById('wiz-diet-pref')?.value;
  const dietBudget = document.getElementById('wiz-budget')?.value;
  const isWheyFree = document.getElementById('wiz-whey')?.value === 'true';
  const competitionDate = document.getElementById('wiz-comp-date')?.value || undefined;

  try {
    const updated = await authFetch('/api/athlete/profile', {
      method: 'POST',
      body: JSON.stringify({
        sport,
        secondarySport,
        positionOrEvent,
        level,
        primaryGoal,
        trainingDaysPerWeek,
        age,
        bodyWeight,
        height,
        sessionDuration,
        equipment,
        trainingLocation,
        dietPreference,
        dietBudget,
        isWheyFree,
        competitionDate
      })
    });

    if (updated && updated._id) {
      userProfile = updated;
      applyUserProfileToUI();
      closeWizardModal();
      alert('🎯 Profile updated and dashboard reconfigured!');
    } else if (updated && updated.message) {
      alert(`Error updating profile: ${updated.message}`);
    }
  } catch (err) {
    console.error('Failed to update athlete wizard:', err);
    alert('Failed to save profile settings. Please try again.');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = '💾 Save & Reconfigure Dashboard';
    }
  }
}

function applyUserProfileToUI() {
  if (!userProfile) return;

  const sport = userProfile.sport || 'General Athletic';
  const level = (userProfile.level || 'intermediate').toUpperCase();
  const goal = userProfile.primaryGoal || 'Explosive Power';
  const days = userProfile.trainingDaysPerWeek || 4;
  const eq = userProfile.equipment || 'Full Gym';
  const dur = userProfile.sessionDuration || '60 Min';

  const elemOverviewSport = document.getElementById('overview-sport');
  if (elemOverviewSport) elemOverviewSport.textContent = sport;

  const elemSumSport = document.getElementById('sum-sport');
  if (elemSumSport) elemSumSport.textContent = sport;

  const elemSumLevel = document.getElementById('sum-level');
  if (elemSumLevel) elemSumLevel.textContent = level;

  const elemSumGoal = document.getElementById('sum-goal');
  if (elemSumGoal) elemSumGoal.textContent = goal;

  const elemSumDays = document.getElementById('sum-days');
  if (elemSumDays) elemSumDays.textContent = `${days} Days`;

  const elemSumEq = document.getElementById('sum-equipment');
  if (elemSumEq) elemSumEq.textContent = eq;

  const elemSumDur = document.getElementById('sum-duration');
  if (elemSumDur) elemSumDur.textContent = dur;

  // Reconfigure Today's Training Focus Card on Dashboard
  const todayTitle = document.getElementById('today-session-title');
  const todayDesc = document.getElementById('today-session-desc');
  if (todayTitle && todayDesc) {
    todayTitle.textContent = `🏋️ ${sport} — ${goal} Focus`;
    todayDesc.textContent = `Customized for ${userProfile.positionOrEvent || sport} at ${level} level (${eq}, ${days} days/week, ${dur}).`;
  }

  // Sync selectors in diet tab if available
  const dietSelect = document.getElementById('diet-type-select');
  if (dietSelect && userProfile.dietPreference) dietSelect.value = userProfile.dietPreference;

  const budgetSelect = document.getElementById('diet-budget-select');
  if (budgetSelect && userProfile.dietBudget) budgetSelect.value = userProfile.dietBudget;

  const wheySelect = document.getElementById('diet-whey-select');
  if (wheySelect) wheySelect.value = userProfile.isWheyFree ? 'true' : 'false';

  // Reconfigure sub-components & tabs
  if (typeof ATHLETE_GROUND_DRILLS !== 'undefined') {
    selectGroundSport(ATHLETE_GROUND_DRILLS[sport] ? sport : 'Volleyball');
  }
  updateAthleteDietUI();
  renderWeeklySchedule();
  renderGymPlans('all');
}

// -------------------------------------------------------------
// LOAD DATA FROM BACKEND
// -------------------------------------------------------------
async function loadAthleteData() {
  try {
    const profile = await authFetch('/api/athlete/profile');
    if (profile && profile._id) {
      userProfile = profile;
      applyUserProfileToUI();
    }

    const progress = await authFetch('/api/athlete/progress');
    athleteLogs = Array.isArray(progress) ? progress : [];

    renderPRSummary();
    updateOverviewStats();
    renderWeeklySchedule();
    updateAthleteDietUI();
  } catch (err) {
    console.error('Failed to load athlete backend profile:', err);
  }
}
