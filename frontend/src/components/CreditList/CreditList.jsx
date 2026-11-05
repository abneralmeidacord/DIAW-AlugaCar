import React from 'react';
import Icon from '../Icon/Icon.jsx';
import Badge from '../Badge/Badge.jsx';
import Empty from '../Empty/Empty.jsx';
import { carOf } from '../../data/cars.js';
import { money, daysBetween, incomeOf } from '../../data/format.js';
import './CreditList.css';

export default function CreditList({ cars, orders, users, onOpen }) {
  return orders.length ? (
    <div className="credit-list">
      {orders.map((o) => {
        const u = users.find((x) => x.id === o.userId);
        return (
          <article className="credit-card" key={o.id}>
            <span className="credit-icon">
              <Icon name="bank" size={26} />
            </span>
            <div>
              <span className="small-text">{o.id}</span>
              <h3>{u?.name}</h3>
              <p>
                {carOf(o.carId, cars).brand} {carOf(o.carId, cars).model} ·{' '}
                {daysBetween(o.start, o.end)} diárias
              </p>
            </div>
            <div className="credit-income">
              <small>RENDA DECLARADA</small>
              <strong>{money(incomeOf(u))}</strong>
            </div>
            <Badge
              status={o.credit.status === 'CONCEDIDO' ? 'APROVADO' : 'PENDENTE'}
              label={
                o.credit.status === 'CONCEDIDO'
                  ? 'Crédito concedido'
                  : 'Aguardando análise'
              }
            />
            <button className="btn secondary" onClick={() => onOpen(o)}>
              {o.credit.status === 'CONCEDIDO' ? 'Ver concessão' : 'Analisar crédito'}
              <Icon name="arrow" size={17} />
            </button>
          </article>
        );
      })}
    </div>
  ) : (
    <Empty
      icon="bank"
      title="Nenhuma solicitação de crédito"
      body="Novas solicitações vinculadas ao seu banco aparecerão aqui."
    />
  );
}
