import React from 'react';
import Icon from '../Icon/Icon.jsx';
import CarImage from '../CarImage/CarImage.jsx';
import { money } from '../../data/format.js';
import './CarCard.css';

export default function CarCard({ car, onOpen, onFavorite, saved }) {
  return (
    <article className={`car-card tone-${car.tone}`}>
      <div className="car-card-top">
        <span>{car.category}</span>
        <button
          className={`favorite-button ${saved ? 'saved' : ''}`}
          aria-label={`${saved ? 'Remover dos' : 'Adicionar aos'} favoritos: ${car.model}`}
          onClick={() => onFavorite(car)}
        >
          <Icon name="heart" size={18} />
        </button>
      </div>
      <button
        className="car-visual"
        onClick={() => onOpen(car)}
        aria-label={`Ver ${car.brand} ${car.model}`}
      >
        <CarImage car={car} />
      </button>
      <div className="car-card-content">
        <div>
          <p>{car.brand}</p>
          <h3>{car.model}</h3>
        </div>
        <div className="car-specs">
          <span>
            <Icon name="users" size={15} />
            {car.seats} pessoas
          </span>
          <span>
            <Icon name="gear" size={15} />
            {car.gear}
          </span>
          <span>
            <Icon name="fuel" size={15} />
            {car.fuel}
          </span>
        </div>
        <div className="car-card-bottom">
          <div>
            <small>A PARTIR DE</small>
            <strong>
              {money(car.price)}
              <span>/ dia</span>
            </strong>
          </div>
          <button
            className="round-arrow"
            aria-label={`Escolher ${car.model}`}
            onClick={() => onOpen(car)}
          >
            <Icon name="diagonal" size={21} />
          </button>
        </div>
      </div>
    </article>
  );
}
