import React from 'react';
import { motion, stagger } from 'motion/react';
import CarCard from '../../components/CarCard/CarCard.jsx';
import Icon from '../../components/Icon/Icon.jsx';
import CarImage from '../../components/CarImage/CarImage.jsx';
import { photos, cars as featuredCars } from '../../data/cars.js';
import { addDays } from '../../data/format.js';
import './HomePage.css';

const heroGroup = {
  visible: { transition: { delayChildren: stagger(0.06) } },
};

const heroItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const revealOnScroll = {
  initial: { opacity: 0, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
};

export default function HomePage({
  cars,
  user,
  navigate,
  booking,
  setBooking,
  locations,
  location,
  onLocationChange,
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
        <motion.div className="hero-content" variants={heroGroup} initial="hidden" animate="visible">
          <motion.p className="hero-kicker" variants={heroItem}>
            <span /> LIBERDADE EM CADA ESCOLHA
          </motion.p>
          <motion.h1 variants={heroItem}>
            Seu próximo
            <br />
            caminho.
            <br />
            <span>Do seu jeito.</span>
          </motion.h1>
          <motion.p className="hero-description" variants={heroItem}>
            Da rotina aos planos que saem do papel.
            <br />
            Encontre o carro que combina com você.
          </motion.p>
          <motion.button className="btn white hero-cta" variants={heroItem} onClick={() => navigate('catalog')}>
            Explorar veículos
            <span>
              <Icon name="diagonal" />
            </span>
          </motion.button>
        </motion.div>
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
      </section>
      <motion.form
        className="hero-search"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14 }}
        onSubmit={(e) => {
          e.preventDefault();
          navigate('catalog');
        }}
      >
        <label className="search-location">
          <Icon name="pin" size={22} />
          <div>
            <span>Onde você vai começar?</span>
            <select
              aria-label="Localidade de retirada"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
            >
              <option value="">Todas as localidades</option>
              {locations.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
          </div>
        </label>
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
      </motion.form>
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
        <b className="mitsubishi-word">MITSUBISHI</b>
      </div>
      <section className="section-container featured-section">
        <motion.div className="section-heading" {...revealOnScroll}>
          <div>
            <p className="eyebrow">UM CARRO PARA CADA MOMENTO</p>
            <h2>Qual é o seu próximo destino?</h2>
          </div>
          <button className="text-link" onClick={() => navigate('catalog')}>
            Ver todos os veículos
            <Icon name="diagonal" size={18} />
          </button>
        </motion.div>
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
      <motion.section className="journey-section" {...revealOnScroll}>
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
      </motion.section>
      <motion.section className="closing-banner" {...revealOnScroll}>
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
      </motion.section>
    </>
  );
}
