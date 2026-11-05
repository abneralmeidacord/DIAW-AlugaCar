import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  canAccessOrder,
  canManageOrder,
  canEditOrder,
  canDeleteClient,
} from '../src/data/orders.js';
const client = { id: 'c1', role: 'cliente' };
const agent = { id: 'a1', role: 'empresa', org: 'o1' };
const bank = { id: 'b1', role: 'banco', org: 'banco' };
const order = { id: 'p1', userId: 'c1', org: 'o1', status: 'PENDENTE', evaluation: null };
test('a interface oferece apenas os pedidos do titular ou da organização', () => {
  assert.equal(canAccessOrder(client, order), true);
  assert.equal(canAccessOrder({ ...client, id: 'c2' }, order), false);
  assert.equal(canManageOrder(agent, order), true);
  assert.equal(canAccessOrder({ ...agent, org: 'o2' }, order), false);
  assert.equal(canAccessOrder(null, order), false);
});
test('o banco consulta crédito vinculado sem gerenciar aluguel de outra organização', () => {
  const linked = { ...order, credit: { requested: true, bankOrg: 'banco' } };
  assert.equal(canAccessOrder(bank, linked), true);
  assert.equal(canManageOrder(bank, linked), false);
  assert.equal(canEditOrder(bank, linked), false);
  assert.equal(canAccessOrder({ ...bank, org: 'outro' }, linked), false);
});
test('edição só aparece para titular ou organização em pedido não avaliado', () => {
  assert.equal(canEditOrder(client, order), true);
  assert.equal(canEditOrder(agent, order), true);
  assert.equal(
    canEditOrder(client, { ...order, evaluation: { result: 'POSITIVO' } }),
    false
  );
  assert.equal(canEditOrder(client, { ...order, status: 'ALUGADO' }), false);
});
test('aluguel ativo ou contrato vigente bloqueia exclusão na interface', () => {
  assert.equal(canDeleteClient('c1', [{ ...order, status: 'ALUGADO' }]), false);
  assert.equal(
    canDeleteClient('c1', [{ ...order, contract: { status: 'VIGENTE' } }]),
    false
  );
  assert.equal(canDeleteClient('c2', [{ ...order, status: 'ALUGADO' }]), true);
});
