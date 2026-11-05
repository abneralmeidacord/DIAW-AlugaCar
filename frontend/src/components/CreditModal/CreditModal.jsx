import React, { useState } from 'react';
import Icon from '../Icon/Icon.jsx';
import Modal from '../Modal/Modal.jsx';
import Field from '../Field/Field.jsx';
import { money, daysBetween, incomeOf } from '../../data/format.js';
import './CreditModal.css';

export default function CreditModal({ car, order, client, onClose, onSubmit }) {
  const [amount, setAmount] = useState(daysBetween(order.start, order.end) * order.daily);
  return (
    <Modal
      title="Crédito para novos caminhos."
      subtitle={`${client?.name} · ${order.id}`}
      onClose={onClose}
    >
      <div className="income-summary">
        <div>
          <small>RENDA MENSAL DECLARADA</small>
          <strong>{money(incomeOf(client))}</strong>
        </div>
        <p>
          Informada pelo cliente no cadastro. A concessão é uma decisão manual do banco.
        </p>
      </div>
      <div className="income-links">
        {(client?.jobs || []).map((j, i) => (
          <div key={i}>
            <span>{j.employer}</span>
            <strong>{money(j.income)}</strong>
          </div>
        ))}
      </div>
      {order.credit?.status === 'CONCEDIDO' ? (
        <div className="credit-result">
          <span className="success-icon">
            <Icon name="check" size={26} />
          </span>
          <h3>Crédito de aluguel concedido</h3>
          <strong>{money(order.credit.amount)}</strong>
          <p>Renda considerada na decisão: {money(order.credit.incomeConsidered)}</p>
          <small>{new Date(order.credit.grantedAt).toLocaleString('pt-BR')}</small>
        </div>
      ) : (
        <form
          className="stack-form"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ amount: Number(amount), income: incomeOf(client) });
          }}
        >
          <div className="review-summary">
            <strong>
              {car.brand} {car.model}
            </strong>
            <span>
              Aluguel estimado: {money(daysBetween(order.start, order.end) * order.daily)}
            </span>
          </div>
          <Field
            label="Valor do crédito concedido"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <button type="submit" className="btn primary full">
            Conceder crédito de aluguel
            <Icon name="check" />
          </button>
          <p className="small-text">
            A renda usada nesta análise ficará registrada na concessão. A aprovação do
            crédito não ativa o aluguel.
          </p>
        </form>
      )}
    </Modal>
  );
}
