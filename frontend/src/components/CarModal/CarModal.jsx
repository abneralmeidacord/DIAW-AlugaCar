import React, { useState } from 'react';
import Icon from '../Icon/Icon.jsx';
import CarImage from '../CarImage/CarImage.jsx';
import Modal from '../Modal/Modal.jsx';
import Field from '../Field/Field.jsx';
import { carTone, defaultLocation } from '../../data/cars.js';
import { organizations } from '../../data/demo.js';
import { money, addDays, daysBetween } from '../../data/format.js';
import './CarModal.css';

export default function CarModal({ car, booking, banks = [], onClose, onSubmit }) {
  const [start, setStart] = useState(booking.start);
  const [end, setEnd] = useState(booking.end);
  const [credit, setCredit] = useState(false);
  const [bankId, setBankId] = useState(banks[0]?.id || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const days = daysBetween(start, end);
  return (
    <Modal
      wide
      title={`${car.brand} ${car.model}`}
      subtitle={`${car.category} · ${car.year} · ${car.orgName || organizations[car.org]}`}
      onClose={onClose}
    >
      <div className="car-detail-grid">
        <div>
          <div className={`detail-car-image tone-${carTone(car.category)}`}>
            <span className="detail-tag">{car.tag}</span>
            <CarImage car={car} />
          </div>
          <div className="detail-spec-grid">
            {[
              ['calendar', car.year],
              ['car', car.plate],
              ['fuel', car.fuel],
              ['spark', car.color],
            ]
              .filter(([, label]) => label)
              .map(([icon, label]) => (
                <div key={icon}>
                  <Icon name={icon} size={24} />
                  <span>{label}</span>
                </div>
              ))}
          </div>
          <div className="detail-caption">
            <Icon name="pin" />
            <div>
              <strong>{car.location || defaultLocation}</strong>
              <p>Retirada e devolução na {car.orgName || 'organização responsável'}.</p>
            </div>
          </div>
        </div>
        <form
          className="booking-form stack-form"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!start || !end || start < addDays(0) || end <= start) {
              setError('Escolha uma devolução posterior à retirada e um período futuro.');
              return;
            }
            setBusy(true);
            try {
              await onSubmit(car, { start, end, credit, bankId: credit ? bankId : null });
            } finally {
              setBusy(false);
            }
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
              disabled={!banks.length}
              onChange={(e) => setCredit(e.target.checked)}
            />
            <div>
              <strong>Quero solicitar crédito de aluguel</strong>
              <span>
                O banco escolhido poderá analisar a renda declarada no meu cadastro para
                este atendimento.
              </span>
            </div>
          </label>
          {credit && (
            <Field label="Banco para análise">
              <select
                value={bankId}
                onChange={(event) => setBankId(event.target.value)}
                required
              >
                {banks.map((bank) => (
                  <option key={bank.id} value={bank.id}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </Field>
          )}
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button className="btn primary full" type="submit" disabled={busy}>
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
