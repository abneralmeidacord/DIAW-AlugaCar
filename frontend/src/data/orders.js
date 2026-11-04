export const isAgent = (user) => ['empresa', 'banco'].includes(user?.role);
export const canManageOrder = (user, order) =>
  !!user && isAgent(user) && user.org === order.org;
export const canAccessOrder = (user, order) =>
  !!user &&
  (user.role === 'cliente'
    ? order.userId === user.id
    : canManageOrder(user, order) ||
      (user.role === 'banco' &&
        order.credit?.bankOrg === user.org &&
        order.credit?.requested));
export const activeRental = (order) =>
  order.status === 'ALUGADO' || order.contract?.status === 'VIGENTE';
export const canDeleteClient = (id, orders) =>
  !orders.some((o) => o.userId === id && activeRental(o));
export const canEditOrder = (user, order) =>
  canAccessOrder(user, order) &&
  (user.role === 'cliente' || canManageOrder(user, order)) &&
  order.status === 'PENDENTE' &&
  !order.evaluation;
export function transitionOrder(order, action, user, payload = {}) {
  const result = structuredClone(order);
  const now = new Date().toISOString();
  const client = !!user && user.role === 'cliente' && order.userId === user.id;
  let label;
  if (action === 'evaluate') {
    if (!canManageOrder(user, order) || order.status !== 'PENDENTE' || order.evaluation)
      throw new Error('Este pedido não pode receber essa avaliação.');
    if (!['POSITIVO', 'NEGATIVO'].includes(payload.result) || !payload.note?.trim())
      throw new Error('Informe o parecer e a justificativa.');
    result.evaluation = {
      result: payload.result,
      note: payload.note.trim(),
      by: user.id,
      at: now,
    };
    if (payload.result === 'NEGATIVO') result.status = 'REPROVADO';
    label =
      payload.result === 'POSITIVO'
        ? 'Parecer favorável registrado'
        : 'Pedido não aprovado';
  } else if (action === 'formalize') {
    if (
      !canManageOrder(user, order) ||
      order.status !== 'PENDENTE' ||
      order.evaluation?.result !== 'POSITIVO' ||
      order.evaluation.by !== user.id
    )
      throw new Error(
        'O agente que avaliou deve formalizar o contrato após o parecer favorável.'
      );
    result.status = 'AGUARDANDO_ACEITE';
    result.contract = {
      id: order.id.replace('ALG', 'CT'),
      status: 'AGUARDANDO_ACEITE',
      formalizedAt: now,
      formalizedBy: user.id,
      acceptedAt: null,
      terms:
        payload.terms ||
        'Contrato de aluguel demonstrativo. Retirada e devolução em Belo Horizonte, MG. Valores fictícios para apresentação acadêmica.',
    };
    label = 'Contrato formalizado';
  } else if (action === 'accept') {
    if (
      !client ||
      order.status !== 'AGUARDANDO_ACEITE' ||
      order.contract?.status !== 'AGUARDANDO_ACEITE'
    )
      throw new Error('O contrato ainda não está disponível para seu aceite.');
    result.status = 'APROVADO';
    result.contract = { ...order.contract, status: 'ACEITO', acceptedAt: now };
    label = 'Contrato aceito pelo cliente';
  } else if (action === 'rent') {
    if (!client || order.status !== 'APROVADO' || order.contract?.status !== 'ACEITO')
      throw new Error('Aceite o contrato antes de iniciar o aluguel.');
    result.status = 'ALUGADO';
    result.contract = { ...order.contract, status: 'VIGENTE', startedAt: now };
    label = 'Aluguel iniciado';
  } else if (action === 'cancel') {
    if (!client || !canEditOrder(user, order))
      throw new Error(
        'Somente pedidos ainda não avaliados podem ser cancelados nesta demonstração.'
      );
    result.status = 'CANCELADO';
    label = 'Pedido cancelado pelo cliente';
  } else if (action === 'credit') {
    if (
      user?.role !== 'banco' ||
      order.credit?.bankOrg !== user.org ||
      !order.credit.requested ||
      order.credit.status !== 'PENDENTE'
    )
      throw new Error(
        'A solicitação de crédito não pertence a este banco ou já foi analisada.'
      );
    if (!(Number(payload.amount) > 0))
      throw new Error('Informe um valor de crédito maior que zero.');
    result.credit = {
      ...order.credit,
      status: 'CONCEDIDO',
      amount: Number(payload.amount),
      incomeConsidered: Number(payload.income || 0),
      grantedAt: now,
      grantedBy: user.id,
    };
    label = 'Crédito de aluguel concedido';
  } else throw new Error('Ação indisponível.');
  result.events = [...(order.events || []), { label, at: now }];
  return result;
}
