import React, { useState } from 'react';
import Icon from '../Icon/Icon.jsx';
import Modal from '../Modal/Modal.jsx';
import Field from '../Field/Field.jsx';
import { money, addDays, daysBetween } from '../../data/format.js';
import './EditOrderModal.css';

export default function EditOrderModal({ order, onClose, onSave }) {
  const [start, setStart] = useState(order.start);
  const [end, setEnd] = useState(order.end);
  const [error, setError] = useState('');
  return (
    <Modal
      title="Ajuste seus planos."
      subtitle="Altere o período do pedido ainda não avaliado."
      onClose={onClose}
    >
      <form
        className="stack-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (end <= start || start < addDays(0)) {
            setError('Confira as datas. A devolução deve ser posterior à retirada.');
            return;
          }
          onSave({ start, end });
        }}
      >
        <div className="form-grid">
          <Field
            label="Retirada"
            type="date"
            value={start}
            min={addDays(0)}
            onChange={(e) => setStart(e.target.value)}
            required
          />
          <Field
            label="Devolução"
            type="date"
            value={end}
            min={start}
            onChange={(e) => setEnd(e.target.value)}
            required
          />
        </div>
        <div className="price-total">
          <span>Total atualizado</span>
          <strong>{money(daysBetween(start, end) * order.daily)}</strong>
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button className="btn primary full" type="submit">
          Salvar período
          <Icon name="check" />
        </button>
      </form>
    </Modal>
  );
}
