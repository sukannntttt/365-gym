const mongoose = require('mongoose');

const DietSchema = new mongoose.Schema({
  goal: { type: String, required: true }, // e.g. 'fat loss', 'muscle gain', 'weight gain'
  calories: Number,
  protein: Number,
  carbs: Number,
  fats: Number,
  meals: {
    breakfast: String,
    lunch: String,
    dinner: String,
    snacks: String
  }
});

// Guard against OverwriteModelError (e.g. when nodemon hot-reloads)
module.exports = mongoose.models.Diet || mongoose.model('Diet', DietSchema);
