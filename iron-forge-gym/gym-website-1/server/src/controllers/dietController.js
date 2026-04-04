const DietPlan = require('../models/DietPlan');

// Get all available diets
exports.getAllDiets = async (req, res) => {
    try {
        const diets = await DietPlan.find();
        res.status(200).json(diets);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get diet plans based on user goal
exports.getDietByGoal = async (req, res) => {
    const { goal } = req.params;
    try {
        const diets = await DietPlan.find({ goal });
        if (diets.length === 0) {
            return res.status(404).json({ message: 'No diets found for this goal' });
        }
        res.status(200).json(diets);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};