import React from 'react';
import CarCard from '../../components/CarCard/CarCard.jsx';
import Icon from '../../components/Icon/Icon.jsx';
import Empty from '../../components/Empty/Empty.jsx';
import { userName } from '../../data/format.js';
import { carLocations, defaultLocation } from '../../data/cars.js';
import './CatalogPage.css';

export default function CatalogPage({
  cars,
  user,
  favorites,
  openCar,
  favorite,
  filters,
  setFilters,
}) {
  const { search, category, brand, location, sort, favoritesOnly } = filters;
  const filteredCars = cars
    .filter(
      (c) =>
        (category === 'Todos' || c.category === category) &&
        (brand === 'Todas' || c.brand === brand) &&
        (!location || (c.location || defaultLocation) === location) &&
        `${c.brand} ${c.model} ${c.category}`
          .toLowerCase()
          .includes(search.toLowerCase()) &&
        (!favoritesOnly || favorites.includes(user?.id + ':' + c.id))
    )
    .sort((a, b) =>
      sort === 'lowest' ? a.price - b.price : sort === 'highest' ? b.price - a.price : 0
    );
  return (
    <section className="section-container catalog-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">SUA PRÓXIMA BOA ESCOLHA</p>
          <h1>
            Um carro para
            <br />
            <span>cada caminho.</span>
          </h1>
          <p>Olá, {userName(user)}. Encontre o modelo que combina com seus planos.</p>
        </div>
        <div className="catalog-side-note">
          <span>
            <Icon name="pin" />
            {location || 'Localidades disponíveis'}
          </span>
          <small>Retirada na organização responsável</small>
        </div>
      </div>
      <div className="catalog-tools">
        <label className="search-input">
          <Icon name="search" />
          <input
            placeholder="Busque por modelo ou marca"
            aria-label="Pesquisar carros"
            value={search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </label>
        <label className="select-filter">
          <span>Marca</span>
          <select
            aria-label="Filtrar por marca"
            value={brand}
            onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
          >
            {['Todas', ...new Set(cars.map((c) => c.brand))].map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>
        <label className="select-filter">
          <span>Localidade</span>
          <select
            aria-label="Filtrar por localidade"
            value={location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          >
            <option value="">Todas</option>
            {carLocations(cars, location).map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>
        </label>
        <button
          className={`filter-button ${favoritesOnly ? 'selected' : ''}`}
          onClick={() => setFilters({ ...filters, favoritesOnly: !favoritesOnly })}
        >
          <Icon name="heart" />
          Favoritos
        </button>
      </div>
      <div className="catalog-subtools">
        <div className="category-tabs">
          {[...new Set(['Todos', ...cars.map((c) => c.category)])].map((c) => (
            <button
              key={c}
              className={category === c ? 'active' : ''}
              onClick={() => setFilters({ ...filters, category: c })}
            >
              {c === 'Todos' ? 'Todos os carros' : c}
            </button>
          ))}
        </div>
        <label className="sort-control">
          <span>Ordenar:</span>
          <select
            aria-label="Ordenar carros"
            value={sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          >
            <option value="recommended">Destaques</option>
            <option value="lowest">Menor diária</option>
            <option value="highest">Maior diária</option>
          </select>
        </label>
      </div>
      <div className="results-label">
        <span>{filteredCars.length} veículos encontrados</span>
        <span>
          <Icon name="shield" size={15} /> Sua próxima viagem começa com uma boa escolha.
        </span>
      </div>
      {filteredCars.length ? (
        <div className="car-grid">
          {filteredCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              saved={favorites.includes(user.id + ':' + car.id)}
              onFavorite={favorite}
              onOpen={openCar}
            />
          ))}
        </div>
      ) : (
        <Empty
          icon="search"
          title="Nenhum carro por aqui"
          body="Tente outra localidade, marca, categoria ou termo de pesquisa."
          action="Limpar filtros"
          onAction={() => {
            setFilters({
              ...filters,
              search: '',
              brand: 'Todas',
              location: '',
              category: 'Todos',
              favoritesOnly: false,
            });
          }}
        />
      )}
      <div className="catalog-help">
        <Icon name="info" />
        <p>
          Valores e disponibilidade são ilustrativos. O pedido passa pela análise do
          agente antes da contratação.
        </p>
      </div>
    </section>
  );
}
