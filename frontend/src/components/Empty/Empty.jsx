import React from 'react';
import Icon from '../Icon/Icon.jsx';
import './Empty.css';

export default function Empty({ icon = 'car', title, body, action, onAction }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon name={icon} size={32} />
      </span>
      <h3>{title}</h3>
      <p>{body}</p>
      {action && (
        <button className="btn primary" onClick={onAction}>
          {action}
          <Icon name="arrow" />
        </button>
      )}
    </div>
  );
}
