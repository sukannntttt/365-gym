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
      { name: 'Heavy Sled Push / Sled Pull', sets: 4, reps: '25m Push + 25m Pull', rest: '2 Min', benefit: 'Quad & glute force under extreme fatigue', technique: 'Keep low torso angle, drive through whole foot.' },
      { name: 'Burpee Broad Jumps', sets: 3, reps: '20m distance', rest: '90s', benefit: 'Full-body explosive endurance', technique: 'Chest to floor, jump forward aggressively using arm swing.' },
      { name: '1000m Rowing Intervals', sets: 3, reps: '1000m @ 2:00/500m pace', rest: '2 Min', benefit: 'Posterior chain endurance', technique: 'Legs drive first, then hips, then arms pull to sternum.' },
      { name: 'Heavy Farmer Carry', sets: 4, reps: '50m distance (24kg/32kg)', rest: '90s', benefit: 'Grip & core anti-lateral flexion', technique: 'Stand tall, shoulders packed down, tight grip.' },
      { name: 'Sandbag Walking Lunges', sets: 3, reps: '30m distance (20kg)', rest: '90s', benefit: 'Single leg endurance', technique: 'Keep front knee tracking over 2nd toe.' },
      { name: 'Wall Balls', sets: 4, reps: '25 reps (9kg / 6kg ball)', rest: '90s', benefit: 'Squat & push power under heart rate pressure', technique: 'Full depth squat, toss to 10ft target on extension.' }
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
      { name: 'Treadmill Run / Run Outdoors', sets: 3, reps: '800m run', rest: '90s', benefit: 'Aerobic base', technique: 'Moderate conversational pace.' },
      { name: 'Dumbbell Goblet Squat to Thruster', sets: 4, reps: '12 reps', rest: '60s', benefit: 'Wall ball alternative', technique: 'Deep squat, push overhead.' },
      { name: 'Walking Dumbbell Farmers Walk', sets: 4, reps: '40m distance', rest: '60s', benefit: 'Grip & shoulder stability', technique: 'Brace core, walk heel-to-toe.' },
      { name: 'Bodyweight Burpee Stepping', sets: 3, reps: '10 reps', rest: '60s', benefit: 'Station endurance', technique: 'Step back into plank, step forward.' },
      { name: 'Single Leg Bodyweight Lunges', sets: 3, reps: '12 / leg', rest: '60s', benefit: 'Leg stamina', technique: 'Upright torso.' }
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
      { name: 'Single-Leg Dumbbell Romanian Deadlift', sets: 3, reps: '8 / leg', rest: '90s', benefit: 'Hamstring & hip stability', technique: 'Slight knee bend, hinge till stretch in hamstring.' },
      { name: 'Pallof Press (Cable / Band)', sets: 3, reps: '12 / side', rest: '60s', benefit: 'Core anti-rotation stability', technique: 'Brace core, press handle forward without torso moving.' }
    ],
    warmup: 'Glute bridges, Monster walks, Hip openers.',
    cooldown: 'Couch stretch + Hamstring stretch.',
    videoKeyword: 'Athletic strength trap bar deadlift workout'
  },
  {
    id: 'power-explosive',
    name: 'Explosive Power & Plyometric Mastery',
    category: 'power',
    level: 'Intermediate',
    goal: 'Rate of Force Development (RFD) & Sprint Starts',
    daysPerWeek: 3,
    duration: '45-50 Min',
    equipment: 'Plyo Box, Medicine Ball, Kettlebell',
    description: 'High-intent neural training focusing on maximum speed of movement, tendon elastic recoil, and jump height.',
    exercises: [
      { name: 'Depth Jumps to Max Vertical Jump', sets: 4, reps: '4 jumps', rest: '2 Min', benefit: 'Reactive stretch-shortening cycle (SSC)', technique: 'Step off 30cm box, land soft and spring up instantly.' },
      { name: 'Explosive Medicine Ball Chest Pass & Slam', sets: 4, reps: '6 slams', rest: '90s', benefit: 'Upper body rotational & vertical power', technique: 'Slam ball to ground using full hip & abdominal snap.' },
      { name: 'Seated Box Jumps (Max Intent)', sets: 4, reps: '5 jumps', rest: '2 Min', benefit: 'Concentric starting power (zero momentum)', technique: 'Pause on seat, explode upward to high box.' },
      { name: 'Heavy Kettlebell Swings', sets: 4, reps: '10 reps', rest: '90s', benefit: 'Hip snap & glute extension', technique: 'Hinge hips, drive forward with glutes.' },
      { name: 'Plyometric Push-Ups (Hands Leaving Floor)', sets: 3, reps: '6 reps', rest: '90s', benefit: 'Upper body pressing speed', technique: 'Push off floor with maximum acceleration.' }
    ],
    warmup: 'Ankle pogo hops, A-skips, Arm swings.',
    cooldown: 'Light walking & calf stretch.',
    videoKeyword: 'Explosive plyometric power training'
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
    description: 'Yielding and Overcoming Isometric holds that build immense tendon load capacity, decrease knee pain, and increase isometric strength.',
    exercises: [
      { name: 'Spanish Squat Isometric Hold', sets: 4, reps: '45 sec hold', rest: '90s', benefit: 'Patellar tendon loading & quad endurance', technique: 'Heavy band behind knees, sit back to 90 degrees, hold firm.' },
      { name: 'Single-Leg Isometric Wall Sit', sets: 3, reps: '30 sec / leg', rest: '60s', benefit: 'Unilateral quad stiffness', technique: 'Press foot into floor, 90 degree knee angle.' },
      { name: 'Iso-Mid Thigh Pull (Barbell against Pins)', sets: 4, reps: '6 sec max push', rest: '2 Min', benefit: 'Peak isometric force production', technique: 'Pull against immovable pins with 100% max intent.' },
      { name: 'Copenhagen Side Plank Hold', sets: 3, reps: '30 sec / side', rest: '60s', benefit: 'Adductor & groin bulletproofing', technique: 'Top leg on bench, hold hips high and straight.' },
      { name: 'Isometric Dead Hang', sets: 3, reps: '45 sec hold', rest: '60s', benefit: 'Grip strength & shoulder decompression', technique: 'Active shoulders engaged, tight core.' }
    ],
    warmup: 'Bodyweight squats, ankle mobility.',
    cooldown: 'Gentle leg elevation & Quad stretch.',
    videoKeyword: 'Spanish squat isometric hold knee rehabilitation'
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
    description: 'Designed specifically for setters, hitters, and blockers needing rapid 4-step approach jumps, blocking reaction, and shoulder protection.',
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
      { name: 'Single-Arm Dumbbell Row & Cable Anti-Rotation', sets: 3, reps: '10 reps', rest: '60s', benefit: 'Throwing arm lat stability', technique: 'Pull elbow to hip.' }
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
    description: 'Designed for track sprinters focusing on drive phase, upright posture, and hamstring hamstring health.',
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
function openAthleteWorkoutModal(planId) {
  const plan = ATHLETE_GYM_PLANS.find(p => p.id === planId);
  if (!plan) return;

  const content = document.getElementById('modal-plan-content');
  const modal = document.getElementById('workout-detail-modal');

  const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(plan.videoKeyword)}`;

  content.innerHTML = `
    <div class="athlete-card-badge badge-${plan.category}" style="font-size:0.8rem;">${plan.category.toUpperCase()}</div>
    <h2 style="font-size:1.4rem; color:var(--text); margin:0.5rem 0;">${plan.name}</h2>
    <p style="color:var(--text-muted); font-size:0.88rem; margin-bottom:1rem;">${plan.description}</p>

    <div style="display:flex; flex-wrap:wrap; gap:1rem; background:var(--surface2); padding:0.85rem; border-radius:8px; margin-bottom:1.25rem; font-size:0.85rem;">
      <div><strong style="color:var(--accent);">Level:</strong> ${plan.level}</div>
      <div><strong style="color:var(--accent);">Equipment:</strong> ${plan.equipment}</div>
      <div><strong style="color:var(--accent);">Duration:</strong> ${plan.duration}</div>
    </div>

    <div style="margin-bottom:1rem; font-size:0.85rem; color:var(--text-muted);">
      <strong style="color:var(--accent3);">🔥 Warm-Up Routine:</strong> ${plan.warmup}
    </div>

    <h3 style="font-size:1.1rem; color:var(--text); margin-top:1.25rem;">🏋️ Exercises & Athletic Technique</h3>
    <table class="exercise-table">
      <thead>
        <tr>
          <th>Exercise</th>
          <th>Sets × Reps</th>
          <th>Rest</th>
          <th>Athletic Benefit & Technique</th>
        </tr>
      </thead>
      <tbody>
        ${plan.exercises.map(ex => `
          <tr>
            <td>
              <div class="exercise-name">${ex.name}</div>
              <div class="exercise-benefit">${ex.benefit}</div>
            </td>
            <td style="font-weight:700; color:var(--text);">${ex.sets} × ${ex.reps}</td>
            <td style="color:var(--text-muted);">${ex.rest}</td>
            <td style="font-size:0.82rem; color:var(--text-muted);">${ex.technique}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div style="margin-top:1.25rem; font-size:0.85rem; color:var(--text-muted);">
      <strong style="color:var(--accent2);">🧘 Cool-Down Routine:</strong> ${plan.cooldown}
    </div>

    <div style="margin-top:1.5rem; display:flex; gap:0.75rem;">
      <a href="${youtubeUrl}" target="_blank" rel="noopener" class="btn-primary" style="text-decoration:none; display:inline-block; font-size:0.85rem; padding:0.6rem 1rem;">
        ▶️ Watch Video Demonstration
      </a>
      <button class="view-plan-btn" onclick="closeAthleteModal()" style="width:auto; padding:0.6rem 1rem;">Close</button>
    </div>
  `;

  modal.classList.add('open');
}

function closeAthleteModal() {
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

  const days = [
    { day: 'Monday', title: '🏋️ Lower Body Power & Vert Jump', type: 'Gym Training', details: 'Depth jumps, Trap Bar Deadlift, Spanish squat holds.' },
    { day: 'Tuesday', title: '🏟️ Ground Field Acceleration & COD', type: 'Ground Drills', details: '10m crouch starts, split-step court shuffles.' },
    { day: 'Wednesday', title: '🧘 Active Recovery & Mobility', type: 'Rest & Recovery', details: '30 min walk, Copenhagen planks, foam rolling.' },
    { day: 'Thursday', title: '🏋️ Upper Body Push-Pull & Rotational Power', type: 'Gym Training', details: 'Weighted pull-ups, landmine press, med ball wall slams.' },
    { day: 'Friday', title: '🏟️ Sport-Specific Match Practice', type: 'Court Practice', details: 'High-intensity court footwork and tactical match play.' },
    { day: 'Saturday', title: '🔥 HYROX Work Capacity / Conditioning', type: 'Conditioning', details: 'Sled push, rowing intervals, wall ball ladder.' },
    { day: 'Sunday', title: '🌙 Full Rest & Glycogen Replenishment', type: 'Complete Rest', details: 'Turmeric milk, stretching, 9 hours sleep.' }
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
// ATHLETE WIZARD MODAL
// -------------------------------------------------------------
function openAthleteWizardModal() {
  document.getElementById('athlete-wizard-modal').classList.add('open');
}

function closeWizardModal() {
  document.getElementById('athlete-wizard-modal').classList.remove('open');
}

async function handleWizardSubmit(e) {
  e.preventDefault();
  const sport = document.getElementById('wiz-sport').value;
  const positionOrEvent = document.getElementById('wiz-position').value;
  const level = document.getElementById('wiz-level').value;
  const primaryGoal = document.getElementById('wiz-goal').value;
  const trainingDaysPerWeek = Number(document.getElementById('wiz-days').value);
  const dietBudget = document.getElementById('wiz-budget').value;

  try {
    const updated = await authFetch('/api/athlete/profile', {
      method: 'POST',
      body: JSON.stringify({ sport, positionOrEvent, level, primaryGoal, trainingDaysPerWeek, dietBudget })
    });

    userProfile = updated;
    applyUserProfileToUI();
    closeWizardModal();
  } catch (err) {
    console.error('Failed to update athlete wizard:', err);
  }
}

function applyUserProfileToUI() {
  if (!userProfile) return;
  document.getElementById('overview-sport').textContent = userProfile.sport;
  document.getElementById('sum-sport').textContent = userProfile.sport;
  document.getElementById('sum-level').textContent = userProfile.level.toUpperCase();
  document.getElementById('sum-goal').textContent = userProfile.primaryGoal;
  document.getElementById('sum-days').textContent = `${userProfile.trainingDaysPerWeek} Days`;

  selectGroundSport(userProfile.sport);
  updateAthleteDietUI();
}

// -------------------------------------------------------------
// LOAD DATA FROM BACKEND
// -------------------------------------------------------------
async function loadAthleteData() {
  try {
    const profile = await authFetch('/api/athlete/profile');
    userProfile = profile;
    applyUserProfileToUI();

    const progress = await authFetch('/api/athlete/progress');
    athleteLogs = progress || [];

    renderPRSummary();
    updateOverviewStats();
    renderWeeklySchedule();
    updateAthleteDietUI();
  } catch (err) {
    console.error('Failed to load athlete backend profile:', err);
  }
}
