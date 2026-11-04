import React from 'react';
import Icon from '../Icon/Icon.jsx';
import Modal from '../Modal/Modal.jsx';
import { canDeleteClient } from '../../data/orders.js';
import './DeleteAccountModal.css';

export default function DeleteAccountModal({ user, orders, onClose, onDelete }) {
  const canDelete = canDeleteClient(user.id, orders);
  const hasHistory = orders.some((order) => order.userId === user.id);
  let message = 'Esta ação remove seu cadastro de demonstração deste navegador.';

  if (!canDelete) {
    message =
      'Você tem contrato vigente ou aluguel ativo. O cadastro não pode ser excluído enquanto esse vínculo estiver em andamento.';
  } else if (hasHistory) {
    message =
      'Seu cadastro tem histórico de pedidos. O tratamento da exclusão com histórico encerrado será definido na próxima revisão.';
  }

  return (
    <Modal
      title={canDelete ? 'Excluir seu cadastro?' : 'Existe uma viagem em andamento'}
      onClose={onClose}
    >
      <div className="delete-message">
        <Icon name="shield" size={34} />
        <p>{message}</p>
      </div>
      <div className="modal-actions">
        <button className="btn secondary" onClick={onClose}>
          Voltar
        </button>
        {canDelete && !hasHistory && (
          <button className="btn danger" onClick={onDelete}>
            Excluir cadastro
          </button>
        )}
      </div>
    </Modal>
  );
}
