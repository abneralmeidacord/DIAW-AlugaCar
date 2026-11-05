const baseUrl = import.meta.env?.VITE_API_URL || '/api';
let csrf;

function profile(values) {
  const { name, cpf, address, profession, cnpj, jobs } = values;
  return { name, cpf, address, profession, cnpj, jobs };
}

async function getCsrf() {
  const response = await fetch(`${baseUrl}/auth/csrf`, { credentials: 'include' });
  if (!response.ok) throw new Error('Não foi possível iniciar a sessão.');
  csrf = await response.json();
  return csrf;
}

async function request(path, options = {}) {
  const method = options.method || 'GET';
  const headers = { ...options.headers };
  if (method !== 'GET') {
    const token = csrf || (await getCsrf());
    headers[token.headerName] = token.token;
  }
  if (options.body && !(options.body instanceof URLSearchParams)) {
    headers['Content-Type'] = 'application/json';
    options = { ...options, body: JSON.stringify(options.body) };
  }
  let response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...options,
      method,
      headers,
      credentials: 'include',
    });
  } catch {
    throw new Error('Não foi possível conectar ao backend. Confira se ele está rodando.');
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const error = new Error(body.message || 'Não foi possível concluir a operação.');
    error.status = response.status;
    if (response.status === 401 || response.status === 403) csrf = undefined;
    throw error;
  }
  return response.status === 204 ? null : response.json();
}

export const api = {
  me: () => request('/perfil'),
  locations: () => request('/carros/localidades'),
  async login(values) {
    await request('/auth/login', {
      method: 'POST',
      body: new URLSearchParams({ login: values.email, senha: values.password }),
    });
    csrf = undefined;
    const user = await this.me();
    if (user.role !== values.role) {
      await this.logout();
      throw new Error('Selecione o perfil correspondente à sua conta.');
    }
    return user;
  },
  register: (values) =>
    request('/auth/register', {
      method: 'POST',
      body: {
        ...profile(values),
        role: values.role,
        email: values.email,
        password: values.password,
      },
    }),
  async logout() {
    await request('/auth/logout', { method: 'POST' });
    csrf = undefined;
  },
  async workspace(user) {
    const [cars, orders, clients, banks] = await Promise.all([
      request('/carros'),
      request('/pedidos'),
      user.role === 'cliente' ? Promise.resolve([]) : request('/clientes'),
      request('/bancos'),
    ]);
    return { cars, orders, users: [user, ...clients], banks };
  },
  saveProfile: (values) => request('/perfil', { method: 'PUT', body: profile(values) }),
  income: (id) => request(`/clientes/${id}/renda`),
  deleteAccount: () => request('/perfil', { method: 'DELETE' }),
  createOrder: (values) => request('/pedidos', { method: 'POST', body: values }),
  editOrder: (id, values) => request(`/pedidos/${id}`, { method: 'PUT', body: values }),
  act(id, action, values = {}) {
    const paths = {
      evaluate: 'avaliar',
      formalize: 'formalizar',
      accept: 'aceitar',
      rent: 'alugar',
      cancel: 'cancelar',
      credit: 'credito',
    };
    const body = action === 'credit' ? { amount: values.amount } : values;
    return request(`/pedidos/${id}/${paths[action]}`, { method: 'POST', body });
  },
};
