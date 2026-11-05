import { test } from 'node:test';
import assert from 'node:assert/strict';
test('login envia cookie e CSRF; a próxima mutação renova o token', async () => {
  const previous = globalThis.fetch;
  const calls = [];
  const answers = [
    { token: 'before', headerName: 'X-CSRF-TOKEN' },
    null,
    { id: 'c1', role: 'cliente' },
    { token: 'after', headerName: 'X-CSRF-TOKEN' },
    { status: 'ALUGADO' },
  ];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    const body = answers.shift();
    return new Response(body === null ? null : JSON.stringify(body), {
      status: body === null ? 204 : 200,
    });
  };
  try {
    const { api } = await import('../src/services/api.js?login-test');
    await api.login({ email: 'cliente@teste.com', password: 'segredo', role: 'cliente' });
    await api.act('p1', 'rent');
    assert.equal(calls[1].options.headers['X-CSRF-TOKEN'], 'before');
    assert.equal(calls[1].options.body.get('senha'), 'segredo');
    assert.equal(calls[2].url, '/api/perfil');
    assert.equal(calls[4].options.headers['X-CSRF-TOKEN'], 'after');
    assert.equal(calls[4].url, '/api/pedidos/p1/alugar');
    assert.ok(calls.every((call) => call.options.credentials === 'include'));
  } finally {
    globalThis.fetch = previous;
  }
});
test('cadastro e atualização não enviam identidade, organização ou hash fornecidos pela tela', async () => {
  const previous = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return new Response(
      JSON.stringify(
        url.endsWith('/csrf') ? { token: 'token', headerName: 'X-CSRF-TOKEN' } : {}
      )
    );
  };
  try {
    const { api } = await import('../src/services/api.js?profile-test');
    const data = {
      id: 'fake',
      org: 'foreign',
      credential: { hash: 'fake' },
      name: 'Exemplo',
      role: 'cliente',
      email: 'a@b.com',
      password: 'senha123',
      rg: 'legado',
      jobs: [],
    };
    await api.register(data);
    const registration = JSON.parse(calls[1].options.body);
    assert.equal(registration.password, 'senha123');
    assert.equal(registration.rg, undefined);
    assert.equal(registration.org, undefined);
    assert.equal(registration.id, undefined);
    assert.equal(registration.credential, undefined);
    await api.saveProfile(data);
    const update = JSON.parse(calls[2].options.body);
    assert.equal(update.role, undefined);
    assert.equal(update.password, undefined);
    await api.act('p1', 'credit', { amount: 100, income: 999999 });
    assert.deepEqual(JSON.parse(calls[3].options.body), { amount: 100 });
  } finally {
    globalThis.fetch = previous;
  }
});
test('erros da API são devolvidos à tela, sem simular sucesso local', async () => {
  const previous = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ message: 'Acesso não autorizado.' }), { status: 401 });
  try {
    const { api } = await import('../src/services/api.js?error-test');
    await assert.rejects(
      api.me(),
      (error) => error.status === 401 && error.message === 'Acesso não autorizado.'
    );
  } finally {
    globalThis.fetch = previous;
  }
});
