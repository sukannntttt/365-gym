const BASE = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
  ? 'http://localhost:5000'
  : 'https://gym-backend-aukv.onrender.com';

function authFetch(path, opts = {}) {
  const token = localStorage.getItem('token');
  opts.headers = {
    'Content-Type': 'application/json',
    ...(opts.headers || {}),
    Authorization: token ? `Bearer ${token}` : ''
  };
  return fetch(`${BASE}${path}`, opts).then(r => r.json());
}