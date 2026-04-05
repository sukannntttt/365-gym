const express = require('express');
const router = express.Router();
const Diet = require('../models/Diet');
const WorkoutPlan = require('../models/WorkoutPlan');

// POST /api/seed -> populates DB
router.get('/', async (req, res) => {
  try {
    await Diet.deleteMany({});
    await WorkoutPlan.deleteMany({});

    // ─────────────────────────────────────────
    //  DIET PLANS
    // ─────────────────────────────────────────
    await Diet.create([
      {
        goal: 'fat loss',
        calories: 1800,
        protein: 150,
        carbs: 150,
        fats: 50,
        meals: {
          breakfast: '4 egg whites + 1 whole egg omelette with spinach & tomatoes. 1 cup oats with berries. Black coffee or green tea.',
          lunch: '200g grilled chicken breast with large mixed salad (cucumber, tomato, lettuce, olive oil). 1 medium sweet potato.',
          dinner: '200g baked salmon or tuna with 2 cups steamed broccoli and green beans. No rice.',
          snacks: 'Greek yogurt (0% fat) + handful of almonds. OR 1 apple + 2 tbsp peanut butter.'
        }
      },
      {
        goal: 'muscle gain',
        calories: 3200,
        protein: 200,
        carbs: 380,
        fats: 90,
        meals: {
          breakfast: '4 whole eggs scrambled + 3 egg whites. 2 cups oats with banana and honey. 1 glass whole milk.',
          lunch: '250g chicken breast or beef with 2 cups white rice. Mixed vegetables stir-fried in olive oil. 1 banana post-meal.',
          dinner: '300g steak or salmon with 2 large baked potatoes. Steamed vegetables. Cottage cheese before bed.',
          snacks: 'Protein shake (30g protein) with whole milk. Handful of mixed nuts + dried fruit. Peanut butter on whole wheat toast.'
        }
      },
      {
        goal: 'weight gain',
        calories: 3800,
        protein: 180,
        carbs: 480,
        fats: 130,
        meals: {
          breakfast: '3 large pancakes with maple syrup + 3 whole eggs. 1 glass whole milk. 1 banana.',
          lunch: '300g pasta with meat sauce (minced beef + tomato). Garlic bread. Large glass of milk.',
          dinner: '250g beef burger in whole wheat bun + sweet potato fries (baked). Side salad with full-fat dressing.',
          snacks: 'Peanut butter & banana sandwich on thick white bread. Mass gainer shake OR whole milk + oats blended. Handful of cashews.'
        }
      }
    ]);

    // ─────────────────────────────────────────
    //  WORKOUT PLANS
    // ─────────────────────────────────────────

    // ── FAT LOSS: 5-day cardio + strength ──
    await WorkoutPlan.create([
      {
        goal: 'fat loss',
        day: 'Day 1 — Upper Body + Cardio',
        exercises: [
          { name: 'Treadmill Warm-up', sets: 1, reps: '10 min', rest: '—' },
          { name: 'Push-ups', sets: 4, reps: '15-20', rest: '45s' },
          { name: 'Dumbbell Rows', sets: 4, reps: '12-15', rest: '45s' },
          { name: 'Shoulder Press (Dumbbell)', sets: 3, reps: '12', rest: '45s' },
          { name: 'Tricep Dips', sets: 3, reps: '15', rest: '45s' },
          { name: 'Jump Rope', sets: 5, reps: '1 min', rest: '30s' }
        ]
      },
      {
        goal: 'fat loss',
        day: 'Day 2 — Lower Body + HIIT',
        exercises: [
          { name: 'Bodyweight Squats', sets: 4, reps: '20', rest: '45s' },
          { name: 'Walking Lunges', sets: 3, reps: '16 (8 each leg)', rest: '45s' },
          { name: 'Glute Bridges', sets: 3, reps: '20', rest: '30s' },
          { name: 'Calf Raises', sets: 4, reps: '25', rest: '30s' },
          { name: 'Burpees (HIIT)', sets: 5, reps: '10', rest: '30s' },
          { name: 'Mountain Climbers', sets: 4, reps: '30s', rest: '20s' }
        ]
      },
      {
        goal: 'fat loss',
        day: 'Day 3 — Active Recovery + Core',
        exercises: [
          { name: '30-min Brisk Walk or Light Jog', sets: 1, reps: '30 min', rest: '—' },
          { name: 'Plank Hold', sets: 4, reps: '45s', rest: '30s' },
          { name: 'Russian Twists', sets: 3, reps: '20', rest: '30s' },
          { name: 'Leg Raises', sets: 3, reps: '15', rest: '30s' },
          { name: 'Bicycle Crunches', sets: 3, reps: '20', rest: '30s' }
        ]
      },
      {
        goal: 'fat loss',
        day: 'Day 4 — Full Body Circuit',
        exercises: [
          { name: 'Jumping Jacks (Warm-up)', sets: 1, reps: '3 min', rest: '—' },
          { name: 'Dumbbell Squat to Press', sets: 4, reps: '12', rest: '60s' },
          { name: 'Renegade Rows', sets: 3, reps: '10 each arm', rest: '60s' },
          { name: 'Kettlebell Swings (or DB)', sets: 4, reps: '15', rest: '45s' },
          { name: 'Box Jumps or Squat Jumps', sets: 4, reps: '10', rest: '45s' },
          { name: 'Battle Ropes or Jump Rope', sets: 5, reps: '30s', rest: '20s' }
        ]
      },
      {
        goal: 'fat loss',
        day: 'Day 5 — Cardio Blast',
        exercises: [
          { name: 'Cycling or Elliptical (steady state)', sets: 1, reps: '20 min', rest: '—' },
          { name: 'Sprint Intervals (30s sprint / 60s walk)', sets: 8, reps: '1 round', rest: '60s' },
          { name: 'Stair Climber', sets: 1, reps: '10 min', rest: '—' },
          { name: 'Cool-down Stretches', sets: 1, reps: '5 min', rest: '—' }
        ]
      }
    ]);

    // ── MUSCLE GAIN: Push Pull Legs (6-day) ──
    await WorkoutPlan.create([
      {
        goal: 'muscle gain',
        day: 'Day 1 — Push (Chest, Shoulders, Triceps)',
        exercises: [
          { name: 'Barbell Bench Press', sets: 4, reps: '8-10', rest: '90s' },
          { name: 'Incline Dumbbell Press', sets: 4, reps: '10-12', rest: '90s' },
          { name: 'Cable Flyes or Pec Deck', sets: 3, reps: '12-15', rest: '60s' },
          { name: 'Overhead Barbell Press', sets: 4, reps: '8-10', rest: '90s' },
          { name: 'Lateral Raises', sets: 3, reps: '15', rest: '60s' },
          { name: 'Skull Crushers', sets: 3, reps: '12', rest: '60s' },
          { name: 'Tricep Pushdowns', sets: 3, reps: '15', rest: '60s' }
        ]
      },
      {
        goal: 'muscle gain',
        day: 'Day 2 — Pull (Back, Biceps)',
        exercises: [
          { name: 'Deadlift', sets: 4, reps: '5-6', rest: '120s' },
          { name: 'Pull-ups or Lat Pulldown', sets: 4, reps: '8-12', rest: '90s' },
          { name: 'Barbell Row', sets: 4, reps: '8-10', rest: '90s' },
          { name: 'Seated Cable Row', sets: 3, reps: '12', rest: '75s' },
          { name: 'Face Pulls', sets: 3, reps: '15', rest: '60s' },
          { name: 'Barbell Curl', sets: 3, reps: '10-12', rest: '60s' },
          { name: 'Hammer Curls', sets: 3, reps: '12', rest: '60s' }
        ]
      },
      {
        goal: 'muscle gain',
        day: 'Day 3 — Legs (Quads, Hamstrings, Glutes)',
        exercises: [
          { name: 'Barbell Back Squat', sets: 5, reps: '6-8', rest: '120s' },
          { name: 'Romanian Deadlift', sets: 4, reps: '10', rest: '90s' },
          { name: 'Leg Press', sets: 4, reps: '12', rest: '90s' },
          { name: 'Leg Curl Machine', sets: 3, reps: '12-15', rest: '60s' },
          { name: 'Walking Lunges', sets: 3, reps: '12 each leg', rest: '60s' },
          { name: 'Seated Calf Raises', sets: 4, reps: '20', rest: '45s' }
        ]
      },
      {
        goal: 'muscle gain',
        day: 'Day 4 — Push (Volume Focus)',
        exercises: [
          { name: 'Incline Barbell Press', sets: 4, reps: '8-10', rest: '90s' },
          { name: 'Flat Dumbbell Press', sets: 4, reps: '10-12', rest: '75s' },
          { name: 'Dumbbell Shoulder Press', sets: 4, reps: '10-12', rest: '75s' },
          { name: 'Front Raises', sets: 3, reps: '12', rest: '60s' },
          { name: 'Cable Lateral Raises', sets: 3, reps: '15', rest: '60s' },
          { name: 'Close Grip Bench Press', sets: 3, reps: '10-12', rest: '75s' },
          { name: 'Overhead Tricep Extension', sets: 3, reps: '12-15', rest: '60s' }
        ]
      },
      {
        goal: 'muscle gain',
        day: 'Day 5 — Pull (Volume Focus)',
        exercises: [
          { name: 'Weighted Pull-ups', sets: 4, reps: '6-8', rest: '90s' },
          { name: 'Single Arm DB Row', sets: 4, reps: '10-12 each', rest: '75s' },
          { name: 'T-Bar Row', sets: 4, reps: '10', rest: '90s' },
          { name: 'Straight Arm Pulldown', sets: 3, reps: '15', rest: '60s' },
          { name: 'Incline Dumbbell Curl', sets: 3, reps: '12', rest: '60s' },
          { name: 'Concentration Curls', sets: 3, reps: '12 each', rest: '60s' }
        ]
      },
      {
        goal: 'muscle gain',
        day: 'Day 6 — Legs + Core',
        exercises: [
          { name: 'Front Squat or Hack Squat', sets: 4, reps: '8-10', rest: '90s' },
          { name: 'Bulgarian Split Squat', sets: 3, reps: '10 each leg', rest: '90s' },
          { name: 'Leg Extension', sets: 4, reps: '15', rest: '60s' },
          { name: 'Stiff-leg Deadlift', sets: 3, reps: '12', rest: '75s' },
          { name: 'Standing Calf Raises', sets: 4, reps: '20', rest: '45s' },
          { name: 'Weighted Plank', sets: 3, reps: '45s', rest: '45s' },
          { name: 'Cable Crunches', sets: 3, reps: '15', rest: '45s' }
        ]
      }
    ]);

    // ── WEIGHT GAIN: 4-day compound focus ──
    await WorkoutPlan.create([
      {
        goal: 'weight gain',
        day: 'Day 1 — Chest & Triceps (Mass)',
        exercises: [
          { name: 'Flat Barbell Bench Press', sets: 5, reps: '5', rest: '120s' },
          { name: 'Incline Dumbbell Press', sets: 4, reps: '8-10', rest: '90s' },
          { name: 'Dumbbell Flyes', sets: 3, reps: '12', rest: '75s' },
          { name: 'Dips (weighted if possible)', sets: 4, reps: '8-10', rest: '90s' },
          { name: 'Skull Crushers', sets: 3, reps: '10-12', rest: '75s' },
          { name: 'Close Grip Bench Press', sets: 3, reps: '10', rest: '75s' }
        ]
      },
      {
        goal: 'weight gain',
        day: 'Day 2 — Back & Biceps (Mass)',
        exercises: [
          { name: 'Conventional Deadlift', sets: 5, reps: '5', rest: '180s' },
          { name: 'Barbell Row (heavy)', sets: 5, reps: '5-6', rest: '120s' },
          { name: 'Weighted Pull-ups', sets: 4, reps: '6-8', rest: '120s' },
          { name: 'Chest-Supported Row', sets: 3, reps: '10-12', rest: '75s' },
          { name: 'EZ-Bar Curl', sets: 4, reps: '10', rest: '75s' },
          { name: 'Reverse Curls', sets: 3, reps: '12', rest: '60s' }
        ]
      },
      {
        goal: 'weight gain',
        day: 'Day 3 — Legs (Heavy Compound)',
        exercises: [
          { name: 'Barbell Back Squat (heavy)', sets: 5, reps: '5', rest: '180s' },
          { name: 'Leg Press (overload)', sets: 5, reps: '8-10', rest: '120s' },
          { name: 'Romanian Deadlift', sets: 4, reps: '8', rest: '120s' },
          { name: 'Hack Squat', sets: 3, reps: '10-12', rest: '90s' },
          { name: 'Leg Curl Machine', sets: 4, reps: '12', rest: '75s' },
          { name: 'Standing Calf Raises (heavy)', sets: 5, reps: '12', rest: '60s' }
        ]
      },
      {
        goal: 'weight gain',
        day: 'Day 4 — Shoulders & Arms (Mass)',
        exercises: [
          { name: 'Barbell Overhead Press (heavy)', sets: 5, reps: '5-6', rest: '120s' },
          { name: 'Arnold Press', sets: 4, reps: '8-10', rest: '90s' },
          { name: 'Upright Rows', sets: 3, reps: '10-12', rest: '75s' },
          { name: 'Barbell Curl', sets: 4, reps: '8-10', rest: '75s' },
          { name: 'Hammer Curls', sets: 3, reps: '12', rest: '60s' },
          { name: 'Overhead Tricep Extension', sets: 4, reps: '10', rest: '75s' },
          { name: 'Tricep Pushdown', sets: 3, reps: '12-15', rest: '60s' }
        ]
      }
    ]);

    res.json({ message: 'Seed complete!' });
  } catch (err) {
    res.status(500).json({ message: 'Error seeding', error: err.message });
  }
});

module.exports = router;
