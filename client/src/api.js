function authFetch(path, opts = {}) {
  const token = localStorage.getItem('token');
  opts.headers = { ...(opts.headers||{}), 'Content-Type':'application/json', Authorization: token ? `Bearer ${token}` : '' };
  return fetch(`https://gym-backend-aukv.onrender.com${path}`, opts).then(r=>r.json());
}