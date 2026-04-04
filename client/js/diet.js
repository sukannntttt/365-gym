// Diet page JS

(async () => {
  if (!requireAuth()) return;

  const user = await getMe();
  if (!user) return;

  if (!user.goal) {
    document.getElementById('macro-grid').innerHTML = '<p style="color:var(--text-muted);padding:2rem">No goal set. Please re-register with a goal.</p>';
    return;
  }

  document.getElementById('diet-subtitle').textContent =
    `Your plan for: ${user.goal.replace(/\b\w/g, c => c.toUpperCase())}`;

  try {
    const diet = await authFetch(`/api/diet/${encodeURIComponent(user.goal)}`);

    if (diet.message) {
      document.getElementById('macro-grid').innerHTML = `
        <p style="color:var(--text-muted);padding:2rem;grid-column:1/-1">
          No diet plan found for goal "<strong>${user.goal}</strong>". 
          Please ask an admin to add one.
        </p>`;
      return;
    }

    // Macros
    document.getElementById('macro-grid').innerHTML = `
      <div class="macro-card calories">
        <div class="macro-value">${diet.calories || 0}<span class="macro-unit"> kcal</span></div>
        <div class="macro-label">🔥 Calories</div>
      </div>
      <div class="macro-card protein">
        <div class="macro-value">${diet.protein || 0}<span class="macro-unit">g</span></div>
        <div class="macro-label">💪 Protein</div>
      </div>
      <div class="macro-card carbs">
        <div class="macro-value">${diet.carbs || 0}<span class="macro-unit">g</span></div>
        <div class="macro-label">🌾 Carbs</div>
      </div>
      <div class="macro-card fats">
        <div class="macro-value">${diet.fats || 0}<span class="macro-unit">g</span></div>
        <div class="macro-label">🥑 Fats</div>
      </div>
    `;

    // Meals
    if (diet.meals) {
      const mealIcons = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snacks: '🍎' };
      const mealLabels = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snacks: 'Snacks' };

      document.getElementById('meals-section').innerHTML = Object.entries(diet.meals)
        .filter(([, val]) => val)
        .map(([key, val]) => `
          <div class="meal-card">
            <div class="meal-icon">${mealIcons[key] || '🍽️'}</div>
            <div class="meal-name">${mealLabels[key] || key}</div>
            <div class="meal-desc">${val}</div>
          </div>
        `).join('');
    } else {
      document.getElementById('meals-section').innerHTML =
        '<p style="color:var(--text-muted)">No meal details available.</p>';
    }
  } catch {
    document.getElementById('macro-grid').innerHTML = '<p style="color:var(--error)">Failed to load diet plan.</p>';
  }
})();
