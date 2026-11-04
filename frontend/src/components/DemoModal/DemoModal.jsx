import React from 'react';
import Icon from '../Icon/Icon.jsx';
import Modal from '../Modal/Modal.jsx';
import './DemoModal.css';

export default function DemoModal({ onClose, onLogin }) {
  return (
    <Modal
      title="Qual caminho você quer explorar?"
      subtitle="Troque de perfil para acompanhar o fluxo completo. Os dados da demonstração são compartilhados entre estes perfis neste navegador."
      onClose={onClose}
    >
      <div className="demo-profiles">
        {[
          [
            'cliente',
            'user',
            'Sou cliente',
            'Escolher um carro, acompanhar pedidos, aceitar e alugar.',
          ],
          [
            'empresa',
            'car',
            'Sou uma empresa',
            'Avaliar pedidos e formalizar contratos da Aurora Mobilidade.',
          ],
          [
            'banco',
            'bank',
            'Sou um banco',
            'Consultar renda e analisar solicitações de crédito vinculadas.',
          ],
        ].map(([id, icon, title, body]) => (
          <button
            key={id}
            onClick={() => {
              onLogin(id);
            }}
          >
            <span className="demo-profile-icon">
              <Icon name={icon} size={27} />
            </span>
            <div>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
            <Icon name="arrow" />
          </button>
        ))}
      </div>
      <div className="modal-tip">
        <Icon name="info" />
        <span>
          Use somente dados fictícios. Esta é uma simulação visual, sem operações reais.
        </span>
      </div>
    </Modal>
  );
}
