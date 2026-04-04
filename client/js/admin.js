document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAuth()) return;

  const currentUser = await getMe();
  if (!currentUser || currentUser.role !== 'admin') {
    document.querySelector('.main-content').innerHTML = `
      <div class="card" style="text-align: center; padding: 4rem;">
        <h1 style="color: #ff6b6b; font-size: 4rem; margin-bottom: 1rem;">🚫</h1>
        <h2>Access Denied</h2>
        <p class="page-sub">You do not have administrator privileges to view this page.</p>
        <a href="dashboard.html" class="btn-primary" style="display: inline-block; margin-top: 1rem;">Back to Dashboard</a>
      </div>
    `;
    return;
  }

  setTimeout(() => {
    const adminNav = document.getElementById('admin-nav');
    if (adminNav) adminNav.classList.add('active');
  }, 100);

  try {
    const data = await authFetch('/api/admin/users');
    
    document.getElementById('stat-total-users').textContent = data.totalUsers || 0;
    document.getElementById('stat-total-workouts').textContent = data.totalWorkouts || 0;
    document.getElementById('stat-total-progress').textContent = data.totalProgress || 0;

    const tbody = document.getElementById('users-tbody');
    if (data.users && data.users.length > 0) {
      tbody.innerHTML = '';
      data.users.forEach(u => {
        const tr = document.createElement('tr');
        
        const userGoal = u.goal ? (u.goal.charAt(0).toUpperCase() + u.goal.slice(1)) : 'Unknown';
        
        let feeDateStr = '—';
        let feeStatusColor = 'var(--text-secondary)';
        if (u.feeDueDate) {
          const due = new Date(u.feeDueDate);
          feeDateStr = due.toLocaleDateString();
          if (due < new Date()) feeStatusColor = '#ff6b6b'; 
          else if (due.getTime() - new Date().getTime() < 5 * 24 * 60 * 60 * 1000) feeStatusColor = '#feca57'; 
          else feeStatusColor = '#1dd1a1'; 
        }

        if (u.pendingTxnId) {
          feeDateStr += `<br><span style="color:#feca57; font-size:0.75rem; font-weight:normal;">Txn: ${u.pendingTxnId}</span>`;
        }
        
        let roleHtml = `<span class="role-user">User</span>`;
        if (u.role === 'admin') {
          roleHtml = `<span class="role-admin">Admin</span>`;
        }

        tr.innerHTML = `
          <td style="font-weight: 500;">${u.name || '—'}</td>
          <td style="color: var(--text-secondary);">${u.email}</td>
          <td>${u.age || '—'}</td>
          <td>${userGoal}</td>
          <td style="color: ${feeStatusColor}; font-weight: bold;">${feeDateStr}</td>
          <td>${roleHtml}</td>
          <td>
            <button class="btn-primary" style="padding: 4px 10px; font-size: 0.8rem;" onclick="markPaid('${u._id}')">Mark Paid</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    } else {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-secondary);">No users found.</td></tr>`;
    }
    
  } catch (err) {
    console.error('Failed to load admin stats:', err);
    document.getElementById('users-tbody').innerHTML = `
      <tr><td colspan="7" style="text-align: center; color: #ff6b6b;">Error loading data. Are you an admin?</td></tr>
    `;
  }
});

// Admin global function: Mark Paid
window.markPaid = async function(userId) {
  if (!confirm('Mark fee as paid? This will add 30 days to their due date.')) return;
  
  try {
    const res = await fetch(BASE + '/api/admin/pay-fee/' + userId, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });

    if (res.ok) {
      alert('Fee updated successfully! +30 Days added.');
      location.reload(); 
    } else {
      alert('Failed to update fee.');
    }
  } catch (err) {
    console.error(err);
    alert('An error occurred.');
  }
};
