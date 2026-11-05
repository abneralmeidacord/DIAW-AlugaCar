import React from 'react';
import Icon from '../Icon/Icon.jsx';
import CarImage from '../CarImage/CarImage.jsx';
import Badge from '../Badge/Badge.jsx';
import Empty from '../Empty/Empty.jsx';
import { carTone, carOf } from '../../data/cars.js';
import { organizations, statusLabels } from '../../data/demo.js';
import { money, dateLabel, daysBetween } from '../../data/format.js';
import './OrdersList.css';

export default function OrdersList({ cars, orders, onOpen, onBrowse }) {
  if (!orders.length)
    return (
      <Empty
        icon="file"
        title="Novos caminhos esperam por você"
        body="Seus pedidos aparecem aqui. Escolha um carro para começar."
        action="Explorar carros"
        onAction={onBrowse}
      />
    );
  return (
    <div className="orders-list">
      {orders.map((o) => {
        const c = carOf(o.carId, cars);
        return (
          <article className="order-card" key={o.id}>
            <div className={`order-photo tone-${carTone(c.category)}`}>
              <CarImage car={c} />
            </div>
            <div className="order-card-main">
              <div className="order-card-header">
                <span className="small-text">{o.id}</span>
                <Badge status={o.status} label={statusLabels[o.status]} />
              </div>
              <h2>
                {c.brand} {c.model}
              </h2>
              <p className="small-text">
                {o.orgName || organizations[o.org] || 'Sua organização'} · Belo Horizonte
              </p>
              <div className="order-summary">
                <span>
                  <Icon name="calendar" size={17} />
                  {dateLabel(o.start)} — {dateLabel(o.end)}
                </span>
                <span>
                  <strong>{money(daysBetween(o.start, o.end) * o.daily)}</strong> /{' '}
                  {daysBetween(o.start, o.end)} diárias
                </span>
              </div>
            </div>
            <button
              className={`btn ${o.status === 'AGUARDANDO_ACEITE' ? 'primary' : 'secondary'}`}
              onClick={() => onOpen(o)}
            >
              {o.status === 'AGUARDANDO_ACEITE'
                ? 'Ver contrato'
                : o.status === 'APROVADO'
                  ? 'Alugar agora'
                  : 'Ver pedido'}
              <Icon name="arrow" size={18} />
            </button>
          </article>
        );
      })}
    </div>
  );
}
