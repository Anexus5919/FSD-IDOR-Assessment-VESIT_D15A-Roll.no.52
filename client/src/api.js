const API_BASE = 'http://localhost:5000/api';

export function getSession() {
  const raw = localStorage.getItem('profilehub_session');
  return raw ? JSON.parse(raw) : null;
}

export function saveSession(session) {
  localStorage.setItem('profilehub_session', JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem('profilehub_session');
}

async function request(path, options = {}) {
  const session = getSession();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (session?.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  return data;
}

export const api = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getProfile: (id) => request(`/profiles/${id}`),
};
