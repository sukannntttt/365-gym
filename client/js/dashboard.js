// Dashboard page JS

let currentUser = null;
let chartInstance = null;

(async () => {
  if (!requireAuth()) return;

  // Set today's date
  document.getElementById('today-date').textContent =
    new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // Set default date on quick log form
  const today = new Date().toISOString().split('T')[0];

  // Load user info
  currentUser = await getMe();
  if (!currentUser) return;

  const greeting = document.getElementById('greeting');
  greeting.textContent = getGreeting(currentUser.name);

  document.getElementById('user-goal-label').textContent =
    `Goal: ${currentUser.goal || 'Not set'} · ${currentUser.height || '—'}cm · ${currentUser.weight || '—'}kg`;

  // Membership Badge
  const badge = document.getElementById('membership-badge');
  badge.textContent = currentUser.membershipTier || 'FREE';
  if (currentUser.membershipTier === 'Pro') badge.style.color = '#3b82f6', badge.style.borderColor = '#3b82f6';
  if (currentUser.membershipTier === 'Elite') badge.style.color = '#f59e0b', badge.style.borderColor = '#f59e0b';

  document.getElementById('cur-weight').textContent = currentUser.weight || '—';

  // Fee Check
  if (currentUser.feeDueDate) {
    const due = new Date(currentUser.feeDueDate);
    const container = document.getElementById('fee-reminder-container');
    
    if (due < new Date()) {
      container.innerHTML = `<div style="background: rgba(255,107,107,0.1); border: 1px solid #ff6b6b; color: #ff6b6b; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-weight: bold; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.5rem;">⚠️</span>
          <span>Your gym membership fee was due on ${due.toLocaleDateString()}. Please pay your fees to avoid suspension.</span>
        </div>
        <button class="btn-primary" onclick="createPayment()" style="background: #1dd1a1; border: none; padding: 8px 15px; cursor: pointer; color: #000; font-weight: bold; border-radius: 6px;">Pay Online (₹1200)</button>
      </div>`;
    } else if (due.getTime() - new Date().getTime() < 5 * 24 * 60 * 60 * 1000) {
      container.innerHTML = `<div style="background: rgba(254,202,87,0.1); border: 1px solid #feca57; color: #feca57; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-weight: bold; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.5rem;">🔔</span>
          <span>Reminder: Your gym membership fee is due soon (${due.toLocaleDateString()}).</span>
        </div>
        <button class="btn-primary" onclick="createPayment()" style="background: #1dd1a1; border: none; padding: 8px 15px; cursor: pointer; color: #000; font-weight: bold; border-radius: 6px;">Pay Online (₹1200)</button>
      </div>`;
    }
  }

  // Handle successful return from payment
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('payment') === 'success') {
    alert('Payment successful! Your fee due date has been updated.');
    // Strip from URL to avoid repeated alerts
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // Load all parallel data
  await Promise.all([loadDiet(), loadLogs(), loadProgress(), loadAnalytics()]);
})();

async function loadAnalytics() {
  try {
    const stats = await authFetch('/api/analytics/stats');
    document.getElementById('weekly-volume').textContent = stats.weeklyVolume ? stats.weeklyVolume.toLocaleString() : '0';
    document.getElementById('avg-calories').textContent = stats.avgDailyCalories ? stats.avgDailyCalories.toLocaleString() : '0';
    document.getElementById('log-count').textContent = stats.workoutCount || '0';
  } catch (err) {
    console.error('Failed to load analytics:', err);
  }
}

async function loadDiet() {
  if (!currentUser?.goal) {
    document.getElementById('diet-summary').innerHTML = '<p style="color:var(--text-muted);font-size:.9rem;">Set your goal to see a diet plan.</p>';
    return;
  }
  try {
    const diet = await authFetch(`/api/diet/${encodeURIComponent(currentUser.goal)}`);
    if (diet.message) {
      document.getElementById('diet-summary').innerHTML = `<p style="color:var(--text-muted);font-size:.9rem;">${diet.message}</p>`;
      return;
    }
    const colors = { calories: '#ff6584', protein: '#6c63ff', carbs: '#22d3a5', fats: '#f59e0b' };
    const maxVals = { calories: 3000, protein: 200, carbs: 400, fats: 100 };
    const items = [
      { key: 'calories', label: 'Calories', val: diet.calories, unit: 'kcal' },
      { key: 'protein', label: 'Protein', val: diet.protein, unit: 'g' },
      { key: 'carbs', label: 'Carbs', val: diet.carbs, unit: 'g' },
      { key: 'fats', label: 'Fats', val: diet.fats, unit: 'g' },
    ];
    document.getElementById('diet-summary').innerHTML = `
      <div class="diet-widget">
        ${items.map(item => `
          <div class="diet-macro-row">
            <span class="diet-macro-name">${item.label}</span>
            <div class="diet-macro-bar">
              <div class="diet-macro-fill" style="width:${Math.min(100, (item.val / maxVals[item.key]) * 100)}%;background:${colors[item.key]}"></div>
            </div>
            <span class="diet-macro-val">${item.val || 0}${item.unit}</span>
          </div>
        `).join('')}
      </div>
    `;
  } catch {
    document.getElementById('diet-summary').innerHTML = '<p style="color:var(--text-muted)">Could not load diet.</p>';
  }
}

async function loadLogs() {
  try {
    const userId = currentUser._id || currentUser.id;
    const logs = await authFetch(`/api/workout-log/${userId}`);
    document.getElementById('log-count').textContent = Array.isArray(logs) ? logs.length : 0;

    const recent = Array.isArray(logs) ? logs.slice(0, 5) : [];
    const el = document.getElementById('recent-logs');
    if (!recent.length) {
      el.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🏋️</div>
          <div class="empty-state-text">No workouts logged yet.<br>Use the Quick Log to start!</div>
        </div>`;
      return;
    }
    el.innerHTML = recent.map(log => `
      <div class="log-entry">
        <div class="log-badge">🔥</div>
        <div style="flex:1">
          <div class="log-exercise-name">${log.exercise}</div>
          <div class="log-date">${new Date(log.date).toLocaleDateString()}</div>
        </div>
        <div class="log-meta">${log.sets}×${log.reps} ${log.weight ? `@ ${log.weight}kg` : ''}</div>
      </div>
    `).join('');
  } catch {
    document.getElementById('recent-logs').innerHTML = '<p style="color:var(--text-muted)">Could not load logs.</p>';
  }
}

async function loadProgress() {
  try {
    const entries = await authFetch(`/api/progress/${currentUser.id}`);
    if (!Array.isArray(entries) || !entries.length) {
      document.getElementById('chart-empty').classList.remove('hidden');
      return;
    }
    const labels = entries.map(e => new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    const weights = entries.map(e => e.weight);

    const ctx = document.getElementById('progress-chart').getContext('2d');
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Weight (kg)',
          data: weights,
          borderColor: '#6c63ff',
          backgroundColor: 'rgba(108,99,255,0.1)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#6c63ff',
          pointRadius: 4,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1a1a2e',
            borderColor: 'rgba(108,99,255,0.3)',
            borderWidth: 1,
            titleColor: '#eeeeff',
            bodyColor: '#7777aa',
            padding: 10
          }
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#7777aa' } },
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#7777aa' } }
        }
      }
    });
  } catch {
    document.getElementById('chart-empty').classList.remove('hidden');
  }
}

async function handleQuickLog(e) {
  e.preventDefault();
  const msgEl = document.getElementById('ql-msg');
  msgEl.textContent = '';

  try {
    const res = await authFetch('/api/workout-log/', {
      method: 'POST',
      body: JSON.stringify({
        exercise: document.getElementById('ql-exercise').value,
        sets: parseInt(document.getElementById('ql-sets').value),
        reps: parseInt(document.getElementById('ql-reps').value),
        weight: parseFloat(document.getElementById('ql-weight').value) || 0,
        date: new Date().toISOString()
      })
    });
    if (res._id) {
      msgEl.textContent = '✅ Exercise logged!';
      document.getElementById('quick-log-form').reset();
      loadLogs(); // refresh
      setTimeout(() => { msgEl.textContent = ''; }, 3000);
    } else {
      msgEl.style.color = 'var(--error)';
      msgEl.textContent = res.message || 'Failed to log.';
    }
  } catch {
    msgEl.style.color = 'var(--error)';
    msgEl.textContent = 'Network error.';
  }
}

// Payment trigger
window.createPayment = function() {
  window.location.href = 'checkout.html';
};

// Sidebar Toggle (Mobile)
window.toggleSidebar = function() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('active');
};
