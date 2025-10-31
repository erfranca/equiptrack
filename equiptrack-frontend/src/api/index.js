const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function getToken() {
  return localStorage.getItem('token') || '';
}

async function http(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const t = getToken();
    if (t) headers['Authorization'] = `Bearer ${t}`;
  }
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const msg = data?.error || data?.message || res.statusText;
    throw new Error(msg);
  }
  return res.json();
}

export const api = {
  login: (email, password) => http('/api/auth/login', { method: 'POST', body: { email, password }, auth: false }),
  me: () => http('/api/auth/me'),
  listClients: () => http('/api/clients'),
  createClient: (payload) => http('/api/clients', { method: 'POST', body: payload }),
  listAccessories: () => http('/api/accessories'),
  listDefects: () => http('/api/defects'),
  createEquipment: (payload) => http('/api/equipments', { method: 'POST', body: payload }),
  searchEquipments: (query) => http(`/api/equipments${query}`),
  getEquipment: (id) => http(`/api/equipments/${id}`),
}
