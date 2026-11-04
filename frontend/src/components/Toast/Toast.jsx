import React from 'react';
import Icon from '../Icon/Icon.jsx';
import './Toast.css';

export default function Toast({ message, onClose }) {
  return (
    <div className="toast" role="status">
      <span>
        <Icon name="check" size={18} />
      </span>
      {message}
      <button aria-label="Fechar aviso" onClick={onClose}>
        <Icon name="close" size={16} />
      </button>
    </div>
  );
}
