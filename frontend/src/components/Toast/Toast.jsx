import React from 'react';
import { motion, useIsPresent } from 'motion/react';
import Icon from '../Icon/Icon.jsx';
import './Toast.css';

export default function Toast({ message, onClose }) {
  const isPresent = useIsPresent();

  return (
    <motion.div
      className="toast"
      role="status"
      inert={!isPresent}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5, transition: { duration: 0.16 } }}
    >
      <span>
        <Icon name="check" size={18} />
      </span>
      {message}
      <button aria-label="Fechar aviso" onClick={onClose}>
        <Icon name="close" size={16} />
      </button>
    </motion.div>
  );
}
