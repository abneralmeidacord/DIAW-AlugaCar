import React from 'react';
import Icon from '../Icon/Icon.jsx';
import Empty from '../Empty/Empty.jsx';
import { money, initials } from '../../data/format.js';
import './ClientList.css';

export default function ClientList({ users, orders, bank, onOpen }) {
  return users.length ? (
    <div className="client-grid">
      {users.map((u) => (
        <article key={u.id} className="client-card">
          <span className="avatar large">{initials(u.name)}</span>
          <h3>{u.name}</h3>
          <p>{u.email}</p>
          <div className="client-card-info">
            <span>
              {orders.filter((o) => o.userId === u.id).length} atendimentos vinculados
            </span>
            {bank && u.income != null && (
              <strong>Renda declarada: {money(u.income)}</strong>
            )}
          </div>
          <button className="text-link" onClick={() => onOpen(u)}>
            Ver atendimento
            <Icon name="arrow" size={17} />
          </button>
        </article>
      ))}
    </div>
  ) : (
    <Empty
      icon="users"
      title="Seus próximos clientes estarão aqui"
      body="São exibidos apenas os clientes vinculados aos atendimentos da sua organização."
    />
  );
}
