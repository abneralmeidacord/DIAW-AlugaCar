import React from 'react';
import Icon from '../Icon/Icon.jsx';
import './Stat.css';

export default function Stat({ label, value, icon }) {
  return (
    <div className="stat-card">
      <div>
        <span>{label}</span>
        <strong>{String(value).padStart(2, '0')}</strong>
      </div>
      <span className="stat-icon">
        <Icon name={icon} size={24} />
      </span>
    </div>
  );
}
