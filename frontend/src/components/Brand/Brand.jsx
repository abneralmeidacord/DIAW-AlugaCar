import React from 'react';
import './Brand.css';

export default function Brand({ onClick, inverse = false }) {
  return (
    <button
      className={`brand ${inverse ? 'inverse' : ''}`}
      onClick={onClick}
      aria-label="AlugaCar — início"
    >
      <span className="brand-symbol">
        <svg width="29" height="29" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path d="m4 25 9-19h6l9 19h-7l-5-12-5 12H4Z" fill="currentColor" />
          <path d="M10 21h13" stroke="var(--paper)" strokeWidth="2" />
        </svg>
      </span>
      <span>
        aluga<span className="brand-light">car</span>
        <i>®</i>
      </span>
    </button>
  );
}
