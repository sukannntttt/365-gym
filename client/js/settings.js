document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAuth()) return;

  const currentUser = await getMe();
  if (!currentUser) return;

  // Prefill profile data
  document.getElementById('set-name').value = currentUser.name || '';
  document.getElementById('set-age').value = currentUser.age || '';
  document.getElementById('set-height').value = currentUser.height || '';
  document.getElementById('set-weight').value = currentUser.weight || '';
  
  if (currentUser.goal) {
    document.getElementById('set-goal').value = currentUser.goal.toLowerCase();
  }
  if (currentUser.dietPreference) {
    document.getElementById('set-diet').value = currentUser.dietPreference.toLowerCase();
  }

  document.getElementById('current-email').value = currentUser.email || '';

  // Handle Profile Update
  document.getElementById('profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('save-profile-btn');
    const msg = document.getElementById('profile-msg');
    
    btn.disabled = true;
    btn.textContent = 'Saving...';
    msg.textContent = '';

    try {
      const res = await fetch(`${BASE}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: document.getElementById('set-name').value,
          age: parseInt(document.getElementById('set-age').value),
          height: parseFloat(document.getElementById('set-height').value),
          weight: parseFloat(document.getElementById('set-weight').value),
          goal: document.getElementById('set-goal').value,
          dietPreference: document.getElementById('set-diet').value
        })
      });

      const data = await res.json();
      if (res.ok) {
        msg.textContent = '✅ Profile visually updated!';
        msg.style.color = '#1dd1a1';
      } else {
        msg.textContent = data.message || 'Failed to update profile.';
        msg.style.color = '#ff6b6b';
      }
    } catch (err) {
      msg.textContent = 'Network error.';
      msg.style.color = '#ff6b6b';
    }

    btn.disabled = false;
    btn.textContent = 'Save Profile';
    
    setTimeout(() => { msg.textContent = ''; }, 3000);
  });

  // Handle Email Change
  document.getElementById('email-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('change-email-btn');
    const msg = document.getElementById('email-msg');
    
    const newEmail = document.getElementById('new-email').value;
    if (newEmail.toLowerCase() === currentUser.email.toLowerCase()) {
      msg.textContent = 'This is already your email!';
      msg.style.color = '#feca57';
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Requesting...';
    msg.textContent = '';

    try {
      const res = await fetch(`${BASE}/api/auth/email/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ newEmail })
      });

      const data = await res.json();
      if (res.ok) {
        msg.textContent = '📩 Check your CURRENT email inbox for the authorization link!';
        msg.style.color = '#1dd1a1';
        document.getElementById('email-form').reset();
      } else {
        msg.textContent = data.message || 'Failed to request change.';
        msg.style.color = '#ff6b6b';
      }
    } catch (err) {
      msg.textContent = 'Network error.';
      msg.style.color = '#ff6b6b';
    }

    btn.disabled = false;
    btn.textContent = 'Request Change';
  });
});
