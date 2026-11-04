import { test } from "node:test";
import assert from "node:assert/strict";
import {
  canAccessOrder,
  canManageOrder,
  canEditOrder,
  canDeleteClient,
  transitionOrder,
} from "../src/data/orders.js";
const client = { id: "c1", role: "cliente" },
  stranger = { id: "c2", role: "cliente" },
  agent = { id: "a1", role: "empresa", org: "o1" },
  otherAgent = { id: "a2", role: "empresa", org: "o2" },
  bank = { id: "b1", role: "banco", org: "banco" };
const order = () => ({
  id: "ALG-1",
  userId: "c1",
  org: "o1",
  status: "PENDENTE",
  evaluation: null,
  contract: null,
  events: [],
});
test("cliente só consulta o próprio pedido; organização alheia não acessa", () => {
  assert.equal(canAccessOrder(client, order()), true);
  assert.equal(canAccessOrder(stranger, order()), false);
  assert.equal(canAccessOrder(otherAgent, order()), false);
  assert.equal(canManageOrder(agent, order()), true);
});
test("não permite aceitar ou alugar antes da formalização", () => {
  assert.throws(() => transitionOrder(order(), "accept", client));
  assert.throws(() => transitionOrder(order(), "rent", client));
});
test("fluxo completo exige parecer, mesmo agente, aceite e Alugar em ações separadas", () => {
  const original = order();
  const evaluated = transitionOrder(original, "evaluate", agent, {
    result: "POSITIVO",
    note: "Parecer favorável.",
  });
  assert.equal(original.evaluation, null);
  assert.equal(evaluated.status, "PENDENTE");
  assert.throws(() =>
    transitionOrder(evaluated, "formalize", { ...agent, id: "a3" }),
  );
  const formalized = transitionOrder(evaluated, "formalize", agent);
  assert.equal(formalized.status, "AGUARDANDO_ACEITE");
  assert.throws(() => transitionOrder(formalized, "rent", client));
  const accepted = transitionOrder(formalized, "accept", client);
  assert.equal(accepted.status, "APROVADO");
  assert.equal(accepted.contract.status, "ACEITO");
  const rented = transitionOrder(accepted, "rent", client);
  assert.equal(rented.status, "ALUGADO");
  assert.equal(rented.contract.status, "VIGENTE");
  assert.throws(() => transitionOrder(rented, "rent", client));
});
test("outro cliente e agente não podem aceitar contrato do cliente", () => {
  const a = transitionOrder(order(), "evaluate", agent, {
    result: "POSITIVO",
    note: "OK",
  });
  const f = transitionOrder(a, "formalize", agent);
  assert.throws(() => transitionOrder(f, "accept", stranger));
  assert.throws(() => transitionOrder(f, "accept", agent));
});
test("parecer negativo impede formalização", () => {
  const n = transitionOrder(order(), "evaluate", agent, {
    result: "NEGATIVO",
    note: "Período não disponível.",
  });
  assert.equal(n.status, "REPROVADO");
  assert.throws(() => transitionOrder(n, "formalize", agent));
});
test("editar e cancelar não acionam reanálise não definida", () => {
  assert.equal(canEditOrder(client, order()), true);
  const a = transitionOrder(order(), "evaluate", agent, {
    result: "POSITIVO",
    note: "OK",
  });
  assert.equal(canEditOrder(client, a), false);
  assert.throws(() => transitionOrder(a, "cancel", client));
  const c = transitionOrder(order(), "cancel", client);
  assert.equal(c.status, "CANCELADO");
  assert.equal(c.events.length, 1);
});
test("exclusão é bloqueada por aluguel ativo OU contrato vigente, só do cliente em questão", () => {
  assert.equal(
    canDeleteClient("c1", [{ ...order(), status: "ALUGADO" }]),
    false,
  );
  assert.equal(
    canDeleteClient("c1", [{ ...order(), contract: { status: "VIGENTE" } }]),
    false,
  );
  assert.equal(
    canDeleteClient("c2", [{ ...order(), status: "ALUGADO" }]),
    true,
  );
  assert.equal(
    canDeleteClient("c1", [{ ...order(), status: "CANCELADO" }]),
    true,
  );
});
test("banco acessa somente crédito vinculado e não formaliza aluguel de outra organização", () => {
  const o = {
    ...order(),
    credit: { requested: true, bankOrg: "banco", status: "PENDENTE" },
  };
  assert.equal(canAccessOrder(bank, order()), false);
  assert.equal(canAccessOrder(bank, o), true);
  assert.equal(canManageOrder(bank, o), false);
  assert.throws(() =>
    transitionOrder(o, "evaluate", bank, { result: "POSITIVO", note: "OK" }),
  );
});
test("concessão registra renda da decisão e não ativa nem aprova o aluguel", () => {
  const o = {
    ...order(),
    credit: { requested: true, bankOrg: "banco", status: "PENDENTE" },
  };
  const granted = transitionOrder(o, "credit", bank, {
    amount: 950,
    income: 6500,
  });
  assert.equal(granted.credit.incomeConsidered, 6500);
  assert.equal(granted.credit.amount, 950);
  assert.equal(granted.status, "PENDENTE");
  assert.throws(() =>
    transitionOrder(granted, "credit", bank, { amount: 950, income: 7000 }),
  );
  assert.throws(() =>
    transitionOrder(
      o,
      "credit",
      { ...bank, org: "outro" },
      { amount: 950, income: 6500 },
    ),
  );
});
