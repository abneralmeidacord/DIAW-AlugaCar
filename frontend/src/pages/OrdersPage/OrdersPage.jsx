import React from 'react';
import OrdersList from '../../components/OrdersList/OrdersList.jsx';
import Icon from '../../components/Icon/Icon.jsx';
import { statusLabels } from '../../data/demo.js';
import './OrdersPage.css';

export default function OrdersPage({
  visibleOrders,
  orderFilter,
  setOrderFilter,
  navigate,
  onOpen,
}) {
  return (
    <section className="section-container workspace-page">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">TUDO NO SEU TEMPO</p>
          <h1>
            Meus pedidos<span>.</span>
          </h1>
          <p>Acompanhe cada etapa até a próxima partida.</p>
        </div>
        <button className="btn primary" onClick={() => navigate('catalog')}>
          Novo pedido
          <Icon name="plus" />
        </button>
      </div>
      <div className="order-tabs">
        {['Todos', 'Em análise', 'Contrato disponível', 'Aluguel ativo'].map((t) => (
          <button
            className={orderFilter === t ? 'active' : ''}
            key={t}
            onClick={() => setOrderFilter(t)}
          >
            {t}
            {t === 'Todos' && <span>{visibleOrders.length}</span>}
          </button>
        ))}
      </div>
      <OrdersList
        orders={visibleOrders.filter(
          (o) => orderFilter === 'Todos' || statusLabels[o.status] === orderFilter
        )}
        onOpen={(o) => onOpen(o)}
        onBrowse={() => navigate('catalog')}
      />
    </section>
  );
}
