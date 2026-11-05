import React from 'react';
import './CarImage.css';

function showFallback(event) {
  const image = event.currentTarget;
  if (image.dataset.fallback) return;
  image.dataset.fallback = 'true';
  image.src = '/images/car-fallback.svg';
}

export default function CarImage({ car, className = '' }) {
  return (
    <img
      className={`car-image ${className}`}
      src={car.photo || '/images/car-fallback.svg'}
      alt={`${car.brand} ${car.model}, imagem ilustrativa`}
      referrerPolicy="no-referrer"
      onError={showFallback}
    />
  );
}
