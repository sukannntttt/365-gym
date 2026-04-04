const BASE = 'https://gym-backend-aukv.onrender.com';

function authFetch(path, opts = {}) {
  const token = localStorage.getItem('token');
  opts.headers = {
    ...(opts.headers || {}),
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : ''
  };
  return fetch(`${BASE}${path}`, opts).then(r => r.json());
}