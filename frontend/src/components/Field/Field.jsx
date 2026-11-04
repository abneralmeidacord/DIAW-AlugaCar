import React from 'react';
import './Field.css';

export default function Field({ label, children, hint, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children || <input {...props} />} {hint && <small>{hint}</small>}
    </label>
  );
}
