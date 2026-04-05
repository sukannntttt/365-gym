// Progress Tracker page JS

let currentUser = null;
let chartInstance = null;
let allEntries = [];

(async () => {
  if (!requireAuth()) return;
  currentUser = await getMe();
  if (!currentUser) return;

  // Set today as default
  document.getElementById('prog-date').value = new Date().toISOString().split('T')[0];

  await loadProgress();
})();

async function loadProgress() {
  const listEl = document.getElementById('progress-list');
  listEl.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div>';

  try {
    const userId = currentUser._id || currentUser.id;
    allEntries = await authFetch(`/api/progress/${userId}`);
    if (!Array.isArray(allEntries)) allEntries = [];

    renderChart();
    renderTable();
    renderStats();
  } catch {
    listEl.innerHTML = '<p style="color:var(--error)">Failed to load progress.</p>';
  }
}

function renderChart() {
  const empty = document.getElementById('chart-empty-prog');
  const canvas = document.getElementById('weight-chart');

  if (!allEntries.length) {
    empty.classList.remove('hidden');
    canvas.classList.add('hidden');
    return;
  }
  empty.classList.add('hidden');
  canvas.classList.remove('hidden');

  const labels = allEntries.map(e =>
    new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  );
  const weights = allEntries.map(e => e.weight);

  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Weight (kg)',
        data: weights,
        borderColor: '#6c63ff',
        backgroundColor: 'rgba(108,99,255,0.12)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#6c63ff',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8
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
          padding: 12,
          callbacks: {
            label: ctx => `Weight: ${ctx.parsed.y} kg`
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: '#7777aa', font: { family: 'Outfit' } }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: '#7777aa', font: { family: 'Outfit' }, callback: v => `${v} kg` }
        }
      }
    }
  });
}

function renderStats() {
  const el = document.getElementById('progress-stats');
  if (!allEntries.length) { el.innerHTML = ''; return; }

  const weights = allEntries.map(e => e.weight);
  const first = weights[0];
  const last = weights[weights.length - 1];
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const diff = (last - first).toFixed(1);
  const diffClass = diff > 0 ? 'up' : diff < 0 ? 'down' : '';
  const diffSign = diff > 0 ? '+' : '';

  el.innerHTML = `
    <div class="prog-stat-row">
      <span class="prog-stat-label">Starting weight</span>
      <span class="prog-stat-val">${first} kg</span>
    </div>
    <div class="prog-stat-row">
      <span class="prog-stat-label">Current weight</span>
      <span class="prog-stat-val">${last} kg</span>
    </div>
    <div class="prog-stat-row">
      <span class="prog-stat-label">Total change</span>
      <span class="prog-stat-val ${diffClass}">${diffSign}${diff} kg</span>
    </div>
    <div class="prog-stat-row">
      <span class="prog-stat-label">Lowest recorded</span>
      <span class="prog-stat-val">${min} kg</span>
    </div>
    <div class="prog-stat-row">
      <span class="prog-stat-label">Highest recorded</span>
      <span class="prog-stat-val">${max} kg</span>
    </div>
    <div class="prog-stat-row">
      <span class="prog-stat-label">Entries logged</span>
      <span class="prog-stat-val">${allEntries.length}</span>
    </div>
  `;
}

function renderTable() {
  const el = document.getElementById('progress-list');
  if (!allEntries.length) {
    el.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📊</div>
        <div class="empty-state-text">No entries yet. Log your first weight!</div>
      </div>`;
    return;
  }

  const sorted = [...allEntries].reverse();
  el.innerHTML = `
    <table class="progress-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Weight</th>
          <th>Change</th>
        </tr>
      </thead>
      <tbody>
        ${sorted.map((entry, i) => {
          const prev = sorted[i + 1];
          const diff = prev ? (entry.weight - prev.weight).toFixed(1) : null;
          const diffStr = diff !== null
            ? `<span style="color:${diff > 0 ? 'var(--error)' : diff < 0 ? 'var(--success)' : 'var(--text-muted)'}">${diff > 0 ? '+' : ''}${diff} kg</span>`
            : '—';
          return `
            <tr>
              <td>${new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</td>
              <td><strong>${entry.weight} kg</strong></td>
              <td>${diffStr}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}

async function handleAddProgress(e) {
  e.preventDefault();
  const btn = document.getElementById('prog-submit-btn');
  const msgEl = document.getElementById('prog-msg');
  msgEl.textContent = '';
  msgEl.style.color = 'var(--success)';
  setLoading(btn, true);

  try {
    const res = await authFetch('/api/progress/', {
      method: 'POST',
      body: JSON.stringify({
        weight: parseFloat(document.getElementById('prog-weight').value),
        date: document.getElementById('prog-date').value
          ? new Date(document.getElementById('prog-date').value).toISOString()
          : new Date().toISOString()
      })
    });

    if (res._id) {
      msgEl.textContent = '✅ Weight logged!';
      document.getElementById('progress-form').reset();
      document.getElementById('prog-date').value = new Date().toISOString().split('T')[0];
      await loadProgress();
      setTimeout(() => { msgEl.textContent = ''; }, 3000);
    } else {
      msgEl.style.color = 'var(--error)';
      msgEl.textContent = res.message || 'Failed.';
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
