// Workout Plans page JS

let allPlans = [];
let userGoal = null;

(async () => {
  if (!requireAuth()) return;

  const user = await getMe();
  if (!user) return;

  userGoal = user.goal;
  document.getElementById('workout-subtitle').textContent =
    `Personalized plans for your goal: ${user.goal || 'All goals'}`;

  try {
    allPlans = await authFetch('/api/workout');
    if (!Array.isArray(allPlans) || !allPlans.length) {
      document.getElementById('workout-grid').innerHTML = `
        <div class="empty-state" style="grid-column:1/-1;padding:4rem">
          <div class="empty-state-icon">🏋️</div>
          <div class="empty-state-text">No workout plans available yet.</div>
        </div>`;
      return;
    }
    // Default: show user's goal
    if (userGoal) {
      filterGoal(userGoal, null);
      // Update filter button active state
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(userGoal.split(' ')[0].toLowerCase())) {
          btn.classList.add('active');
        }
      });
    } else {
      renderPlans(allPlans);
    }
  } catch (err) {
    document.getElementById('workout-grid').innerHTML = '<p style="color:var(--text-muted)">Failed to load plans.</p>';
  }
})();

function filterGoal(goal, btn) {
  if (btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  const filtered = goal === 'all' ? allPlans : allPlans.filter(p => p.goal === goal);
  renderPlans(filtered);
}

function goalBadgeClass(goal) {
  if (goal === 'fat loss') return 'badge-fat-loss';
  if (goal === 'muscle gain') return 'badge-muscle-gain';
  if (goal === 'weight gain') return 'badge-weight-gain';
  return '';
}

function renderPlans(plans) {
  if (!plans.length) {
    document.getElementById('workout-grid').innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;padding:3rem">
        <div class="empty-state-icon">🔍</div>
        <div class="empty-state-text">No plans found for this goal.</div>
      </div>`;
    return;
  }

  document.getElementById('workout-grid').innerHTML = plans.map(plan => `
    <div class="workout-day-card" style="animation: slideUp 0.4s ease">
      <div class="workout-day-header">
        <span class="workout-day-name">${plan.day || 'Day'}</span>
        <span class="workout-goal-badge ${goalBadgeClass(plan.goal)}">${plan.goal}</span>
      </div>
      <div class="exercise-list">
        ${(plan.exercises || []).map(ex => `
          <div class="exercise-item">
            <span class="exercise-name">${ex.name}</span>
            <span class="exercise-meta">${ex.sets} sets × ${ex.reps}${ex.rest ? ` · Rest: ${ex.rest}` : ''}</span>
          </div>
        `).join('')}
        ${!plan.exercises?.length ? '<p style="color:var(--text-muted);font-size:.85rem">No exercises listed.</p>' : ''}
      </div>
    </div>
  `).join('');
}

// Expose filterGoal globally for HTML onclick
window.filterGoal = filterGoal;
