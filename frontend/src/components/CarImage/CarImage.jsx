import React from 'react';
import './CarImage.css';

const fallbackPhoto = '/images/car-fallback.svg';
const studioPhotos = new Map([
  ['bmw', '/images/frota/bmw.png'],
  ['demo-bmw-i4', '/images/frota/demo-bmw-i4.png'],
  ['demo-bmw-x3', '/images/frota/demo-bmw-x3.png'],
  ['demo-macan-gts', '/images/frota/demo-macan-gts.png'],
  ['demo-mercedes-glc', '/images/frota/demo-mercedes-glc.png'],
  ['demo-mitsubishi-eclipse', '/images/frota/demo-mitsubishi-eclipse.png'],
  ['demo-mitsubishi-mirage', '/images/frota/demo-mitsubishi-mirage.png'],
  ['demo-mitsubishi-outlander', '/images/frota/demo-mitsubishi-outlander.png'],
  ['demo-mitsubishi-triton', '/images/frota/demo-mitsubishi-triton.png'],
  ['demo-taycan', '/images/frota/demo-taycan.png'],
  ['demo-volvo-ex30', '/images/frota/demo-volvo-ex30.png'],
  ['mercedes', '/images/frota/mercedes.png'],
  ['mercedes2', '/images/frota/mercedes2.png'],
  ['porsche', '/images/frota/porsche.png'],
  ['volvo', '/images/frota/volvo.png'],
  ['volvo2', '/images/frota/volvo2.png'],
]);

function showFallback(event) {
  const image = event.currentTarget;
  if (image.dataset.fallback) return;
  image.dataset.fallback = 'true';
  delete image.dataset.studio;
  image.src = fallbackPhoto;
}

export default function CarImage({ car, className = '' }) {
  const studioPhoto = studioPhotos.get(car.code ?? car.id);
  const photo = studioPhoto || car.photo;

  return (
    <img
      key={photo}
      className={`car-image ${className}`}
      src={photo || fallbackPhoto}
      data-studio={studioPhoto ? 'true' : undefined}
      data-fallback={photo ? undefined : 'true'}
      alt={`${car.brand} ${car.model}, imagem ilustrativa`}
      referrerPolicy="no-referrer"
      onError={showFallback}
    />
  );
}
