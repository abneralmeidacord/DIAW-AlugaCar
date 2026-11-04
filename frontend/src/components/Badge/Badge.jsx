import React from 'react';
import './Badge.css';

export default function Badge({ status, label }) {
  return (
    <span className={`badge ${status?.toLowerCase()}`}>
      <span />
      {label}
    </span>
  );
}
