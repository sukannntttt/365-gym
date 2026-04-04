const mongoose = require('mongoose');

const dietPlanSchema = new mongoose.Schema({
    goal: {
        type: String,
        required: true
    },
    calories: {
        type: Number,
        required: true
    },
    protein: {
        type: Number,
        required: true
    },
    carbs: {
        type: Number,
        required: true
    },
    fats: {
        type: Number,
        required: true
    },
    meals: {
        type: [String],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('DietPlan', dietPlanSchema);