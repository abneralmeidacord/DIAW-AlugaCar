import React from 'react';
import CarCard from '../../components/CarCard/CarCard.jsx';
import Icon from '../../components/Icon/Icon.jsx';
import CarImage from '../../components/CarImage/CarImage.jsx';
import { photos, cars as featuredCars } from '../../data/cars.js';
import { addDays } from '../../data/format.js';
import './HomePage.css';

export default function HomePage({
  cars,
  user,
  navigate,
  booking,
  setBooking,
  favorites,
  openCar,
  favorite,
}) {
  return (
    <>
      <section className="home-hero">
        <img
          className="hero-photo"
          src={photos.hero}
          referrerPolicy="no-referrer"
          alt="Porsche prata em uma estrada cercada por árvores"
        />
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="hero-kicker">
            <span /> LIBERDADE EM CADA ESCOLHA
          </p>
          <h1>
            Seu próximo
            <br />
            caminho.
            <br />
            <span>Do seu jeito.</span>
          </h1>
          <p className="hero-description">
            Da rotina aos planos que saem do papel.
            <br />
            Encontre o carro que combina com você.
          </p>
          <button className="btn white hero-cta" onClick={() => navigate('catalog')}>
            Explorar veículos
            <span>
              <Icon name="diagonal" />
            </span>
          </button>
        </div>
        <div className="hero-caption">
          <span className="caption-line" />
          <div>
            <small>PARA QUEM AMA O CAMINHO</small>
            <p>
              Mais do que ir.
              <br />É sobre como você chega.
            </p>
          </div>
        </div>
        <span className="hero-pagination">
          <b>01</b> / 03
        </span>
      </section>
      <form
        className="hero-search"
        onSubmit={(e) => {
          e.preventDefault();
          navigate('catalog');
        }}
      >
        <div className="search-location">
          <Icon name="pin" size={22} />
          <div>
            <span>Onde você vai começar?</span>
            <strong>
              Belo Horizonte, MG
              <Icon name="chevron" size={14} />
            </strong>
          </div>
        </div>
        <label>
          <Icon name="calendar" />
          <div>
            <span>Retirada</span>
            <input
              aria-label="Data de retirada"
              type="date"
              min={addDays(0)}
              value={booking.start}
              onChange={(e) => setBooking({ ...booking, start: e.target.value })}
            />
          </div>
        </label>
        <label>
          <Icon name="calendar" />
          <div>
            <span>Devolução</span>
            <input
              aria-label="Data de devolução"
              type="date"
              min={booking.start}
              value={booking.end}
              onChange={(e) => setBooking({ ...booking, end: e.target.value })}
            />
          </div>
        </label>
        <button className="btn primary" type="submit">
          Encontrar meu carro
          <Icon name="search" size={19} />
        </button>
      </form>
      <div className="brand-strip" aria-label="Marcas no catálogo">
        <span>
          BOAS ESCOLHAS
          <br />
          COMEÇAM AQUI.
        </span>
        <b className="porsche-word">PORSCHE</b>
        <b className="bmw-word">BMW</b>
        <b className="mercedes-word">Mercedes-Benz</b>
        <b className="volvo-word">VOLVO</b>
      </div>
      <section className="section-container featured-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">UM CARRO PARA CADA MOMENTO</p>
            <h2>Qual é o seu próximo destino?</h2>
          </div>
          <button className="text-link" onClick={() => navigate('catalog')}>
            Ver todos os veículos
            <Icon name="diagonal" size={18} />
          </button>
        </div>
        <div className="car-grid">
          {cars.slice(0, 3).map((car) => (
            <CarCard
              key={car.id}
              car={car}
              onOpen={openCar}
              onFavorite={favorite}
              saved={favorites.includes(user?.id + ':' + car.id)}
            />
          ))}
        </div>
      </section>
      <section className="journey-section" id="how-it-works">
        <div className="journey-intro">
          <p className="eyebrow">MENOS BUROCRACIA. MAIS CAMINHO.</p>
          <h2>
            Seu aluguel,
            <br />
            em bons passos.
          </h2>
          <p>
            Você escolhe. A gente conecta.
            <br />O próximo destino fica por sua conta.
          </p>
          <button className="btn primary" onClick={() => navigate('signup')}>
            Começar agora
            <Icon name="arrow" />
          </button>
        </div>
        <div className="journey-steps">
          {[
            [
              '01',
              'Escolha seu carro',
              'Explore por marca ou categoria e encontre o modelo para os seus planos.',
              'search',
            ],
            [
              '02',
              'Envie seu pedido',
              'Informe o período e acompanhe a análise da organização.',
              'file',
            ],
            [
              '03',
              'Aceite. Alugue. Vá.',
              'Confira o contrato, aceite os termos e ative seu aluguel.',
              'diagonal',
            ],
          ].map(([n, title, body, icon]) => (
            <div className="journey-step" key={n}>
              <span className="step-icon">
                <Icon name={icon} size={24} />
              </span>
              <div>
                <small>{n} /</small>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="closing-banner">
        <div>
          <p className="eyebrow">O CAMINHO É SEU</p>
          <h2>
            Faça planos.
            <br />
            Nós temos o carro.
          </h2>
          <button className="btn white" onClick={() => navigate('catalog')}>
            Encontre seu próximo carro
            <Icon name="diagonal" />
          </button>
        </div>
        <div className="closing-car">
          <CarImage car={cars[1] || featuredCars[1]} />
          <span>Conforto para ir além. Liberdade para escolher.</span>
        </div>
      </section>
    </>
  );
}
