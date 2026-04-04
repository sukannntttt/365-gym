// BMI Calculator page JS

(async () => {
  if (!requireAuth()) return;
  const user = await getMe();
  if (!user) return;

  // Pre-fill with user's profile data
  if (user.weight) document.getElementById('bmi-weight').value = user.weight;
  if (user.height) document.getElementById('bmi-height').value = user.height;

  // Auto-calculate on load if user has data
  if (user.weight && user.height) {
    await computeBMI(user.weight, user.height);
  }
})();

async function handleBMI(e) {
  e.preventDefault();
  const weight = parseFloat(document.getElementById('bmi-weight').value);
  const height = parseFloat(document.getElementById('bmi-height').value);
  await computeBMI(weight, height);
}

async function computeBMI(weight, height) {
  try {
    const res = await authFetch('/api/bmi', {
      method: 'POST',
      body: JSON.stringify({ weight, height })
    });

    if (res.bmi) {
      showResult(res.bmi, res.category, weight, height);
    } else {
      document.getElementById('bmi-result-inner').innerHTML =
        `<p style="color:var(--error);text-align:center">${res.message || 'Calculation failed.'}</p>`;
    }
  } catch {
    document.getElementById('bmi-result-inner').innerHTML =
      '<p style="color:var(--error);text-align:center">Network error.</p>';
  }
}

function showResult(bmi, category, weight, height) {
  const colorClass = {
    'Underweight': 'color-underweight',
    'Normal weight': 'color-normal',
    'Overweight': 'color-overweight',
    'Obese': 'color-obese'
  }[category] || '';

  const advice = {
    'Underweight': 'Consider a high-calorie diet and strength training to build muscle mass.',
    'Normal weight': 'Great work! Maintain your current healthy lifestyle.',
    'Overweight': 'Focus on cardio, portion control, and a calorie deficit.',
    'Obese': 'Consult a healthcare provider. Small consistent changes make a big difference.'
  }[category] || '';

  // Calculate marker position (BMI 10–40 range mapped to 0–100%)
  const markerPos = Math.min(100, Math.max(0, ((bmi - 10) / 30) * 100));

  document.getElementById('bmi-result-inner').innerHTML = `
    <div class="bmi-result">
      <p style="color:var(--text-muted);font-size:.85rem;text-transform:uppercase;letter-spacing:.1em;margin-bottom:.5rem">Your BMI</p>
      <div class="bmi-score ${colorClass}">${bmi}</div>
      <div class="bmi-category-label ${colorClass}">${category}</div>
      <p class="bmi-desc">${advice}</p>
      
      <div class="bmi-meter">
        <div class="bmi-meter-bar">
          <div class="bmi-meter-marker" style="left: ${markerPos}%"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:.7rem;color:var(--text-muted);margin-top:.5rem">
          <span>Underweight</span>
          <span>Normal</span>
          <span>Overweight</span>
          <span>Obese</span>
        </div>
      </div>

      <div style="
        margin-top:1.5rem;
        display:flex;
        gap:1rem;
        justify-content:center;
        flex-wrap:wrap;
      ">
        <div style="text-align:center">
          <div style="font-size:.75rem;color:var(--text-muted);margin-bottom:.25rem">Weight</div>
          <div style="font-weight:700">${weight} kg</div>
        </div>
        <div style="text-align:center">
          <div style="font-size:.75rem;color:var(--text-muted);margin-bottom:.25rem">Height</div>
          <div style="font-weight:700">${height} cm</div>
        </div>
        <div style="text-align:center">
          <div style="font-size:.75rem;color:var(--text-muted);margin-bottom:.25rem">Ideal Range</div>
          <div style="font-weight:700">${getIdealWeight(height)}</div>
        </div>
      </div>
    </div>
  `;

  // Highlight matching category card
  document.querySelectorAll('.bmi-cat').forEach(el => {
    el.style.opacity = '0.4';
    el.style.transform = 'scale(0.97)';
  });
  const catMap = {
    'Underweight': 'underweight',
    'Normal weight': 'normal',
    'Overweight': 'overweight',
    'Obese': 'obese'
  };
  const activeEl = document.querySelector(`.bmi-cat.${catMap[category]}`);
  if (activeEl) {
    activeEl.style.opacity = '1';
    activeEl.style.transform = 'scale(1)';
    activeEl.style.boxShadow = '0 0 20px rgba(108,99,255,0.2)';
  }
}

function getIdealWeight(height) {
  const h = height / 100;
  const min = (18.5 * h * h).toFixed(1);
  const max = (24.9 * h * h).toFixed(1);
  return `${min}–${max} kg`;
}
