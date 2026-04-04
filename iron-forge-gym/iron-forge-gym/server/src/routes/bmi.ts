import { Router } from 'express';

const router = Router();

// BMI Calculation Route
router.post('/calculate', (req, res) => {
    const { weight, height } = req.body;

    if (!weight || !height) {
        return res.status(400).json({ error: 'Weight and height are required' });
    }

    const bmi = weight / (height * height);
    let category = '';

    if (bmi < 18.5) {
        category = 'Underweight';
    } else if (bmi >= 18.5 && bmi < 24.9) {
        category = 'Normal weight';
    } else if (bmi >= 25 && bmi < 29.9) {
        category = 'Overweight';
    } else {
        category = 'Obesity';
    }

    return res.json({ bmi: parseFloat(bmi.toFixed(2)), category });
});

export default router;