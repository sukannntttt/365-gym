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
        goal: 'fat loss', type: 'veg',
        calories: 1600, protein: 120, carbs: 150, fats: 50,
        meals: {
          breakfast: 'Moong Dal Chilla (2 small) with Mint Chutney. 1 cup Black Coffee/Green Tea.<br><span class="meal-macros">🔥 300 kcal | 💪 15g Protein | 🌾 40g Carbs | 🥑 8g Fats | 🌿 6g Fiber</span>',
          lunch: '1 Katori Dal (Yellow/Moong), 100g Paneer Bhurji, 1 Multigrain Roti, Large Cucumber/Tomato Salad.<br><span class="meal-macros">🔥 450 kcal | 💪 25g Protein | 🌾 45g Carbs | 🥑 18g Fats | 🌿 10g Fiber</span>',
          dinner: '1 Katori Soya Chunk Curry, 1 Katori Mixed Veg Subzi (low oil), 1 Roti.<br><span class="meal-macros">🔥 400 kcal | 💪 25g Protein | 🌾 45g Carbs | 🥑 10g Fats | 🌿 12g Fiber</span>',
          snacks: '1 scoop Whey Protein in Water, 1 bowl Makhana (Fox nuts) roasted in 1 tsp ghee.<br><span class="meal-macros">🔥 250 kcal | 💪 26g Protein | 🌾 15g Carbs | 🥑 8g Fats | 🌿 2g Fiber</span>'
        }
      },
      {
        goal: 'fat loss', type: 'non-veg',
        calories: 1700, protein: 140, carbs: 130, fats: 55,
        meals: {
          breakfast: '3 Boiled Egg Whites + 1 Whole Egg. 1 slice Brown Bread. Green Tea.<br><span class="meal-macros">🔥 250 kcal | 💪 20g Protein | 🌾 15g Carbs | 🥑 10g Fats | 🌿 2g Fiber</span>',
          lunch: '150g Chicken Tikka (grilled), 1 Roti, 1 Katori Curd (Dahi), Large Green Salad.<br><span class="meal-macros">🔥 450 kcal | 💪 40g Protein | 🌾 30g Carbs | 🥑 15g Fats | 🌿 6g Fiber</span>',
          dinner: '150g Baked/Grilled Fish (Bhetki/Surmai) with Lemon & Herbs, 1 Katori Vegetable Soup, 1 cup Steamed Broccoli.<br><span class="meal-macros">🔥 350 kcal | 💪 35g Protein | 🌾 15g Carbs | 🥑 12g Fats | 🌿 8g Fiber</span>',
          snacks: '1 scoop Whey Protein in Water, Handful of Almonds (10-12).<br><span class="meal-macros">🔥 220 kcal | 💪 28g Protein | 🌾 5g Carbs | 🥑 12g Fats | 🌿 3g Fiber</span>'
        }
      },
      {
        goal: 'muscle gain', type: 'veg',
        calories: 2800, protein: 160, carbs: 320, fats: 90,
        meals: {
          breakfast: '2 Paneer Parathas (low oil) with 1 Katori Curd. 1 Banana. 1 glass Skim Milk.<br><span class="meal-macros">🔥 600 kcal | 💪 30g Protein | 🌾 75g Carbs | 🥑 20g Fats | 🌿 8g Fiber</span>',
          lunch: '1.5 Katori Rajma or Chole, 2 Katori White Rice, 100g Paneer Curry, Salad.<br><span class="meal-macros">🔥 850 kcal | 💪 40g Protein | 🌾 110g Carbs | 🥑 25g Fats | 🌿 15g Fiber</span>',
          dinner: '1.5 Katori Dal Makhani (homemade), 3 Multigrain Rotis, 1 Katori Mixed Veg.<br><span class="meal-macros">🔥 700 kcal | 💪 25g Protein | 🌾 90g Carbs | 🥑 20g Fats | 🌿 14g Fiber</span>',
          snacks: '2 scoops Mass/Whey Protein + 300ml Milk + 1 Banana + 1 tbsp Peanut Butter Smoothie.<br><span class="meal-macros">🔥 650 kcal | 💪 55g Protein | 🌾 60g Carbs | 🥑 20g Fats | 🌿 6g Fiber</span>'
        }
      },
      {
        goal: 'muscle gain', type: 'non-veg',
        calories: 3000, protein: 190, carbs: 300, fats: 100,
        meals: {
          breakfast: '5 Egg Omelette (3 whole, 2 whites) with Cheese. 2 slices Whole Wheat Toast. 1 Banana.<br><span class="meal-macros">🔥 600 kcal | 💪 35g Protein | 🌾 50g Carbs | 🥑 28g Fats | 🌿 5g Fiber</span>',
          lunch: '250g Chicken Curry (Home style, 1 tbsp oil), 2 Katori White Rice, 1 Roti, Cucumber Salad.<br><span class="meal-macros">🔥 850 kcal | 💪 60g Protein | 🌾 90g Carbs | 🥑 25g Fats | 🌿 6g Fiber</span>',
          dinner: '200g Mutton Rogan Josh or Chicken Kheema, 3 Rotis, 1 Katori Spinach (Palak).<br><span class="meal-macros">🔥 800 kcal | 💪 55g Protein | 🌾 70g Carbs | 🥑 30g Fats | 🌿 8g Fiber</span>',
          snacks: 'Whey Protein (1 scoop) + Oatmeal (50g) + Handful of Walnuts & Almonds.<br><span class="meal-macros">🔥 550 kcal | 💪 35g Protein | 🌾 50g Carbs | 🥑 20g Fats | 🌿 7g Fiber</span>'
        }
      },
      {
        goal: 'weight gain', type: 'veg',
        calories: 3400, protein: 150, carbs: 450, fats: 110,
        meals: {
          breakfast: '3 Aloo Parathas with Butter & 1 Katori Sweet Curd. 1 Mango or 2 Bananas. 1 glass Full Fat Milk.<br><span class="meal-macros">🔥 900 kcal | 💪 25g Protein | 🌾 120g Carbs | 🥑 35g Fats | 🌿 10g Fiber</span>',
          lunch: '2 Katori Chole, 2 Katori Jeera Rice, 2 Rotis, 100g Paneer Butter Masala.<br><span class="meal-macros">🔥 1100 kcal | 💪 40g Protein | 🌾 150g Carbs | 🥑 40g Fats | 🌿 18g Fiber</span>',
          dinner: '2 Katori Dal Fry (with tadka), 4 Rotis, 1 Katori Potato/Peas Vegetable. 1 Bowl Gajar Halwa or Sweet.<br><span class="meal-macros">🔥 950 kcal | 💪 30g Protein | 🌾 130g Carbs | 🥑 30g Fats | 🌿 15g Fiber</span>',
          snacks: 'Heavy Smoothie: 500ml Full Fat Milk, 2 Bananas, 2 tbsp Peanut Butter, 1 scoop Protien/Gainer, Oats.<br><span class="meal-macros">🔥 800 kcal | 💪 45g Protein | 🌾 90g Carbs | 🥑 30g Fats | 🌿 8g Fiber</span>'
        }
      },
      {
        goal: 'weight gain', type: 'non-veg',
        calories: 3600, protein: 180, carbs: 450, fats: 120,
        meals: {
          breakfast: '6 Scrambled Eggs (4 whole, 2 whites). 3 slices Buttered Toast. 1 Glass Full Fat Milk with 1 Banana.<br><span class="meal-macros">🔥 900 kcal | 💪 45g Protein | 🌾 75g Carbs | 🥑 45g Fats | 🌿 6g Fiber</span>',
          lunch: '300g Chicken Biryani (Restaurant or homemade heavy), 1 Katori Raita, 2 Boiled Eggs.<br><span class="meal-macros">🔥 1200 kcal | 💪 70g Protein | 🌾 140g Carbs | 🥑 40g Fats | 🌿 5g Fiber</span>',
          dinner: '250g Butter Chicken, 3 Garlic Naans or 4 Rotis, Side Salad.<br><span class="meal-macros">🔥 1100 kcal | 💪 60g Protein | 🌾 130g Carbs | 🥑 40g Fats | 🌿 8g Fiber</span>',
          snacks: 'Weight Gainer Shake: Mass Gainer / Whey + 500ml Milk + Peanut butter sandwich (thick slices).<br><span class="meal-macros">🔥 850 kcal | 💪 50g Protein | 🌾 90g Carbs | 🥑 30g Fats | 🌿 6g Fiber</span>'
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
