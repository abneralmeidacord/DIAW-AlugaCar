import React, { useEffect, useEffectEvent, useRef } from 'react';
import { motion, useIsPresent } from 'motion/react';
import Icon from '../Icon/Icon.jsx';
import './Modal.css';

export default function Modal({ title, subtitle, onClose, children, wide = false }) {
  const ref = useRef(null);
  const isPresent = useIsPresent();
  const closeOnEscape = useEffectEvent(() => onClose());

  useEffect(() => {
    if (!isPresent) return;

    const previous = document.activeElement;
    const before = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    const key = (e) => {
      if (e.key === 'Escape') closeOnEscape();
      if (e.key === 'Tab') {
        const list = ref.current?.querySelectorAll(
          'button:not(:disabled),a,input,select,textarea,[tabindex="0"]'
        );
        if (!list?.length) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', key);
    return () => {
      document.body.style.overflow = before;
      document.removeEventListener('keydown', key);
      previous?.focus?.();
    };
  }, [isPresent]);

  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.18 } }}
      onMouseDown={(e) => {
        if (isPresent && e.target === e.currentTarget) onClose();
      }}
    >
      <motion.section
        className={`modal-shell ${wide ? 'wide' : ''}`}
        initial={{ y: 12, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 8, scale: 0.99, transition: { duration: 0.18 } }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        inert={!isPresent}
        tabIndex={-1}
        ref={ref}
      >
        <header className="modal-heading">
          <div>
            <p className="eyebrow">ALUGACAR</p>
            <h2 id="modal-title">{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button className="icon-button" aria-label="Fechar janela" onClick={onClose}>
            <Icon name="close" />
          </button>
        </header>
        {children}
      </motion.section>
    </motion.div>
  );
}
