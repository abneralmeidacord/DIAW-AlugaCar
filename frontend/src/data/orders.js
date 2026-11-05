const isAgent = (user) => ['empresa', 'banco'].includes(user?.role);
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
const activeRental = (order) =>
  order.status === 'ALUGADO' || order.contract?.status === 'VIGENTE';
export const canDeleteClient = (id, orders) =>
  !orders.some((o) => o.userId === id && activeRental(o));
export const canEditOrder = (user, order) =>
  canAccessOrder(user, order) &&
  (user.role === 'cliente' || canManageOrder(user, order)) &&
  order.status === 'PENDENTE' &&
  !order.evaluation;
