import React from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'motion/react';
import './styles/global.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <MotionConfig reducedMotion="user" transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
    <App />
  </MotionConfig>
);
