import React from 'react';
import CarImage from '../CarImage/CarImage.jsx';
import Modal from '../Modal/Modal.jsx';
import { dateLabel } from '../../data/format.js';
import './ConfirmCancelModal.css';

export default function ConfirmCancelModal({ car, order, onClose, onCancel }) {
  return (
    <Modal
      title="Cancelar este pedido?"
      subtitle="O registro continuará no seu histórico, com o status Cancelado."
      onClose={onClose}
    >
      <div className="confirmation-car">
        <CarImage car={car} />
        <div>
          <strong>
            {car.brand} {car.model}
          </strong>
          <p>
            {dateLabel(order.start)} — {dateLabel(order.end)}
          </p>
        </div>
      </div>
      <div className="modal-actions">
        <button className="btn secondary" onClick={onClose}>
          Manter pedido
        </button>
        <button className="btn danger" onClick={onCancel}>
          Cancelar pedido
        </button>
      </div>
    </Modal>
  );
}
