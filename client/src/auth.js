// Shared auth helpers used by all pages

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
}

function requireAuth() {
  if (!localStorage.getItem('token')) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

async function getMe() {
  try {
    const user = await authFetch('/api/auth/me');
    if (user.role === 'admin') {
      const nav = document.querySelector('.sidebar-nav');
      if (nav && !document.getElementById('admin-nav')) {
        const link = document.createElement('a');
        link.href = 'admin.html';
        link.className = 'nav-item';
        link.id = 'admin-nav';
        link.innerHTML = '<i class="fas fa-shield-alt"></i> Control Panel';
        link.style.color = '#ff6b6b';
        nav.appendChild(link);
      }
    }
    return user;
  } catch {
    logout();
  }
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open');
}

// Greet based on time
function getGreeting(name) {
  const h = new Date().getHours();
  if (h < 12) return `Good morning, ${name}! 🌅`;
  if (h < 17) return `Good afternoon, ${name}! ☀️`;
  return `Good evening, ${name}! 🌙`;
}
