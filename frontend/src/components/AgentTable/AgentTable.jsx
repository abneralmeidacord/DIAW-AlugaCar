import React from 'react';
import Icon from '../Icon/Icon.jsx';
import Badge from '../Badge/Badge.jsx';
import Empty from '../Empty/Empty.jsx';
import { carOf } from '../../data/cars.js';
import { statusLabels } from '../../data/demo.js';
import { dateLabel, initials } from '../../data/format.js';
import './AgentTable.css';

export default function AgentTable({ orders, users, onOpen }) {
  if (!orders.length)
    return (
      <Empty
        icon="file"
        title="Tudo tranquilo por aqui"
        body="Pedidos destinados à sua organização aparecerão nesta área."
      />
    );
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Cliente / pedido</th>
            <th>Veículo</th>
            <th>Período</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>
                <div className="table-person">
                  <span className="avatar pale">
                    {initials(users.find((u) => u.id === o.userId)?.name)}
                  </span>
                  <div>
                    <strong>{users.find((u) => u.id === o.userId)?.name}</strong>
                    <small>{o.id}</small>
                  </div>
                </div>
              </td>
              <td>
                <strong>
                  {carOf(o.carId).brand} {carOf(o.carId).model}
                </strong>
                <small>{carOf(o.carId).category}</small>
              </td>
              <td>
                {dateLabel(o.start)}
                <small>até {dateLabel(o.end)}</small>
              </td>
              <td>
                <Badge
                  status={o.status}
                  label={
                    o.evaluation?.result === 'POSITIVO' && o.status === 'PENDENTE'
                      ? 'Parecer favorável'
                      : statusLabels[o.status]
                  }
                />
              </td>
              <td>
                <button
                  className="icon-button table-arrow"
                  aria-label={`Abrir pedido ${o.id}`}
                  onClick={() => onOpen(o)}
                >
                  <Icon name="arrow" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
