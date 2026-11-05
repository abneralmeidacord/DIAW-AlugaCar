import React, { useState } from 'react';
import Icon from '../Icon/Icon.jsx';
import Modal from '../Modal/Modal.jsx';
import Field from '../Field/Field.jsx';
import { dateLabel } from '../../data/format.js';
import './FormalizeModal.css';

export default function FormalizeModal({ car, order, onClose, onSubmit }) {
  const [terms, setTerms] = useState(
    'Retirada e devolução na unidade de Belo Horizonte, MG. O veículo deve ser devolvido no período combinado e nas condições de retirada. Valores e condições fictícios, exclusivos para demonstração acadêmica.'
  );
  return (
    <Modal
      title="Prepare o próximo caminho."
      subtitle="Formalize o contrato e envie os termos para o cliente."
      onClose={onClose}
    >
      <form
        className="stack-form"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ terms });
        }}
      >
        <div className="review-summary">
          <strong>Contrato de aluguel · {order.id.replace('ALG', 'CT')}</strong>
          <span>
            {car.brand} {car.model}
          </span>
          <span>
            {dateLabel(order.start)} — {dateLabel(order.end)}
          </span>
        </div>
        <Field label="Termos do contrato">
          <textarea
            rows={6}
            required
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
          />
        </Field>
        <p className="small-text">
          O cliente receberá o contrato para leitura e aceite. O aluguel ainda não estará
          ativo.
        </p>
        <button type="submit" className="btn primary full">
          Enviar contrato para aceite
          <Icon name="arrow" />
        </button>
      </form>
    </Modal>
  );
}
