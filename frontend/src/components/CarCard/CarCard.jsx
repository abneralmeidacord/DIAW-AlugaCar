import React from 'react';
import { motion } from 'motion/react';
import Icon from '../Icon/Icon.jsx';
import CarImage from '../CarImage/CarImage.jsx';
import { carTone } from '../../data/cars.js';
import { money } from '../../data/format.js';
import './CarCard.css';

export default function CarCard({ car, onOpen, onFavorite, saved }) {
  return (
    <motion.article
      className={`car-card tone-${carTone(car.category)}`}
      layout="position"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      whileHover={{ y: -4 }}
    >
      <div className="car-card-top">
        <span>{car.category}</span>
        <motion.button
          className={`favorite-button ${saved ? 'saved' : ''}`}
          aria-label={`${saved ? 'Remover dos' : 'Adicionar aos'} favoritos: ${car.model}`}
          aria-pressed={saved}
          whileTap={{ scale: 0.9 }}
          onClick={() => onFavorite(car)}
        >
          <Icon name="heart" size={18} />
        </motion.button>
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
            <Icon name="calendar" size={15} />
            {car.year}
          </span>
          <span>
            <Icon name="fuel" size={15} />
            {car.fuel}
          </span>
          {car.color && (
            <span>
              <Icon name="spark" size={15} />
              {car.color}
            </span>
          )}
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
    </motion.article>
  );
}
