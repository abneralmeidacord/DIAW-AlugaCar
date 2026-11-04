import React, { useState } from 'react';
import Icon from '../Icon/Icon.jsx';
import Modal from '../Modal/Modal.jsx';
import Field from '../Field/Field.jsx';
import { carOf } from '../../data/cars.js';
import { money, dateLabel, daysBetween } from '../../data/format.js';
import './EvaluationModal.css';

export default function EvaluationModal({ order, client, onClose, onSubmit }) {
  const [result, setResult] = useState('POSITIVO');
  const [note, setNote] = useState('');
  return (
    <Modal
      title="Uma análise para o próximo passo."
      subtitle={`${order.id} · ${client?.name}`}
      onClose={onClose}
    >
      <form
        className="stack-form"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ result, note });
        }}
      >
        <div className="review-summary">
          <strong>
            {carOf(order.carId).brand} {carOf(order.carId).model}
          </strong>
          <span>
            {dateLabel(order.start)} — {dateLabel(order.end)}
          </span>
          <span>Total: {money(daysBetween(order.start, order.end) * order.daily)}</span>
        </div>
        <Field label="Parecer">
          <select value={result} onChange={(e) => setResult(e.target.value)}>
            <option value="POSITIVO">Favorável à contratação</option>
            <option value="NEGATIVO">Não favorável à contratação</option>
          </select>
        </Field>
        <Field label="Justificativa">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required
            rows={4}
            placeholder="Registre os motivos do parecer para o cliente."
          />
        </Field>
        <p className="small-text">
          O parecer favorável libera a formalização. O cliente ainda precisa aceitar o
          contrato e clicar em Alugar.
        </p>
        <button className="btn primary full" type="submit">
          Registrar avaliação
          <Icon name="check" />
        </button>
      </form>
    </Modal>
  );
}
