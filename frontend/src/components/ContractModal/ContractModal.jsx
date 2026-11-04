import React, { useState } from 'react';
import Icon from '../Icon/Icon.jsx';
import Brand from '../Brand/Brand.jsx';
import Modal from '../Modal/Modal.jsx';
import Badge from '../Badge/Badge.jsx';
import { carOf } from '../../data/cars.js';
import { organizations } from '../../data/demo.js';
import { money, dateLabel, daysBetween } from '../../data/format.js';
import './ContractModal.css';

export default function ContractModal({ order, client, user, onClose, onAccept }) {
  const [accepted, setAccepted] = useState(false);
  const c = carOf(order.carId);
  return (
    <Modal
      title="Tudo combinado, por escrito."
      subtitle={`${order.contract.id} · Contrato demonstrativo de aluguel`}
      onClose={onClose}
    >
      <div className="contract-document">
        <div className="contract-document-head">
          <Brand />
          <Badge
            status={
              order.contract.status === 'AGUARDANDO_ACEITE'
                ? 'AGUARDANDO_ACEITE'
                : 'APROVADO'
            }
            label={
              order.contract.status === 'AGUARDANDO_ACEITE'
                ? 'Aguardando aceite'
                : order.contract.status === 'VIGENTE'
                  ? 'Vigente'
                  : 'Aceito'
            }
          />
        </div>
        <h3>Contrato de aluguel de automóvel</h3>
        <dl>
          <div>
            <dt>Cliente</dt>
            <dd>{client?.name}</dd>
          </div>
          <div>
            <dt>Organização</dt>
            <dd>{organizations[order.org] || 'Organização responsável'}</dd>
          </div>
          <div>
            <dt>Automóvel</dt>
            <dd>
              {c.brand} {c.model} · {c.year}
            </dd>
          </div>
          <div>
            <dt>Período</dt>
            <dd>
              {dateLabel(order.start)} a {dateLabel(order.end)}
            </dd>
          </div>
          <div>
            <dt>Total estimado</dt>
            <dd>{money(daysBetween(order.start, order.end) * order.daily)}</dd>
          </div>
        </dl>
        <h4>Condições combinadas</h4>
        <p>{order.contract.terms}</p>
        {order.contract.acceptedAt && (
          <p className="contract-accepted">
            <Icon name="check" size={17} />
            Aceito em {new Date(order.contract.acceptedAt).toLocaleString('pt-BR')}.
          </p>
        )}
      </div>
      {user.role === 'cliente' && order.status === 'AGUARDANDO_ACEITE' && (
        <>
          <label className="checkbox-field contract-checkbox">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            <span>Li e concordo com os termos deste contrato de demonstração.</span>
          </label>
          <button className="btn primary full" disabled={!accepted} onClick={onAccept}>
            Aceitar contrato
            <Icon name="check" />
          </button>
          <p className="booking-footnote">
            Depois do aceite, clique em Alugar para ativar a locação.
          </p>
        </>
      )}
    </Modal>
  );
}
