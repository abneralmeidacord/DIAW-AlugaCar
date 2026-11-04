import React, { useState } from 'react';
import Icon from '../Icon/Icon.jsx';
import CarImage from '../CarImage/CarImage.jsx';
import Modal from '../Modal/Modal.jsx';
import Field from '../Field/Field.jsx';
import { organizations } from '../../data/demo.js';
import { money, addDays, daysBetween } from '../../data/format.js';
import './CarModal.css';

export default function CarModal({ car, booking, onClose, onSubmit }) {
  const [start, setStart] = useState(booking.start);
  const [end, setEnd] = useState(booking.end);
  const [credit, setCredit] = useState(false);
  const [error, setError] = useState('');
  const days = daysBetween(start, end);
  return (
    <Modal
      wide
      title={`${car.brand} ${car.model}`}
      subtitle={`${car.category} · ${car.year} · ${organizations[car.org]}`}
      onClose={onClose}
    >
      <div className="car-detail-grid">
        <div>
          <div className={`detail-car-image tone-${car.tone}`}>
            <span className="detail-tag">{car.tag}</span>
            <CarImage car={car} />
          </div>
          <div className="detail-spec-grid">
            {[
              ['users', `${car.seats} pessoas`],
              ['gear', car.gear],
              ['fuel', car.fuel],
              ['car', car.power],
            ].map(([icon, label]) => (
              <div key={icon}>
                <Icon name={icon} size={24} />
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div className="detail-caption">
            <Icon name="pin" />
            <div>
              <strong>Belo Horizonte, MG</strong>
              <p>Retirada e devolução na Aurora Mobilidade.</p>
            </div>
          </div>
        </div>
        <form
          className="booking-form stack-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (!start || !end || start < addDays(0) || end <= start) {
              setError('Escolha uma devolução posterior à retirada e um período futuro.');
              return;
            }
            onSubmit(car, { start, end, credit });
          }}
        >
          <div className="booking-price">
            <strong>{money(car.price)}</strong>
            <span>/ diária</span>
          </div>
          <p className="small-text">Escolha o período dos seus planos.</p>
          <div className="form-grid">
            <Field
              label="Retirada"
              type="date"
              value={start}
              min={addDays(0)}
              onChange={(e) => setStart(e.target.value)}
              required
            />
            <Field
              label="Devolução"
              type="date"
              value={end}
              min={start}
              onChange={(e) => setEnd(e.target.value)}
              required
            />
          </div>
          <div className="price-breakdown">
            <span>
              {days} diárias × {money(car.price)}
            </span>
            <strong>{money(days * car.price)}</strong>
          </div>
          <div className="price-total">
            <span>Total estimado</span>
            <strong>{money(days * car.price)}</strong>
          </div>
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={credit}
              onChange={(e) => setCredit(e.target.checked)}
            />
            <div>
              <strong>Quero solicitar crédito de aluguel</strong>
              <span>
                O Banco Horizonte poderá analisar a renda declarada no meu cadastro para
                este atendimento.
              </span>
            </div>
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button className="btn primary full" type="submit">
            Solicitar aluguel
            <Icon name="arrow" />
          </button>
          <p className="booking-footnote">
            <Icon name="shield" size={16} />
            Você acompanha a análise antes de aceitar o contrato.
          </p>
        </form>
      </div>
    </Modal>
  );
}
