// Workout Log page JS

let currentUser = null;

(async () => {
  if (!requireAuth()) return;
  currentUser = await getMe();
  if (!currentUser) return;

  // Set today as default date
  document.getElementById('log-date').value = new Date().toISOString().split('T')[0];

  await loadLogs();
})();

async function loadLogs() {
  const el = document.getElementById('log-list');
  el.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div>';

  try {
    const logs = await authFetch(`/api/workout-log/${currentUser.id}`);
    if (!Array.isArray(logs) || !logs.length) {
      el.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🏋️</div>
          <div class="empty-state-text">No workouts logged yet.<br>Add your first one!</div>
        </div>`;
      return;
    }

    el.innerHTML = logs.map(log => {
      const date = new Date(log.date);
      const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
      return `
        <div class="log-entry">
          <div class="log-badge">🔥</div>
          <div style="flex:1;min-width:0">
            <div class="log-exercise-name">${log.exercise}</div>
            <div class="log-date">${dateStr}</div>
          </div>
          <div style="text-align:right">
            <div class="log-meta">${log.sets} sets × ${log.reps} reps</div>
            ${log.weight ? `<div class="log-date">${log.weight} kg</div>` : ''}
          </div>
        </div>
      `;
    }).join('');
  } catch {
    el.innerHTML = '<p style="color:var(--error)">Failed to load workout logs.</p>';
  }
}

async function handleAddLog(e) {
  e.preventDefault();
  const btn = document.getElementById('log-submit-btn');
  const msgEl = document.getElementById('log-msg');
  msgEl.textContent = '';
  msgEl.style.color = 'var(--success)';
  setLoading(btn, true);

  try {
    const res = await authFetch('/api/workout-log/', {
      method: 'POST',
      body: JSON.stringify({
        exercise: document.getElementById('log-exercise').value,
        sets: parseInt(document.getElementById('log-sets').value),
        reps: parseInt(document.getElementById('log-reps').value),
        weight: parseFloat(document.getElementById('log-weight').value) || 0,
        date: document.getElementById('log-date').value
          ? new Date(document.getElementById('log-date').value).toISOString()
          : new Date().toISOString()
      })
    });

    if (res._id) {
      msgEl.textContent = '✅ Exercise added!';
      document.getElementById('log-form').reset();
      document.getElementById('log-date').value = new Date().toISOString().split('T')[0];
      await loadLogs();
      setTimeout(() => { msgEl.textContent = ''; }, 3000);
    } else {
      msgEl.style.color = 'var(--error)';
      msgEl.textContent = res.message || 'Failed to log exercise.';
    }
  } catch {
    msgEl.style.color = 'var(--error)';
    msgEl.textContent = 'Network error.';
  }

  setLoading(btn, false);
}

function setLoading(btn, loading) {
  btn.querySelector('.btn-text').classList.toggle('hidden', loading);
  btn.querySelector('.btn-loader').classList.toggle('hidden', !loading);
  btn.disabled = loading;
}
