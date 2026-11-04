import React, { useState, useEffect } from 'react';
import Icon from '../Icon/Icon.jsx';
import Brand from '../Brand/Brand.jsx';
import { initials, userName } from '../../data/format.js';
import './Header.css';

export default function Header({ user, page, navigate, onDemo, logout }) {
  const [mobile, setMobile] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    setMobile(false);
    setMenu(false);
  }, [page]);
  let navigation = [
    ['home', 'Início'],
    ['catalog', 'Explorar carros'],
  ];

  if (user?.role === 'cliente') {
    navigation.push(['orders', 'Meus pedidos']);
  } else if (user) {
    navigation = [
      ['workspace', 'Visão geral'],
      ['agent-orders', 'Pedidos'],
      ['clients', 'Clientes'],
    ];
    if (user.role === 'banco') navigation.push(['credits', 'Crédito de aluguel']);
  }
  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand onClick={() => navigate('home')} />
        <nav className={mobile ? 'open' : ''} aria-label="Navegação principal">
          {navigation.map(([key, label]) => (
            <button
              key={key}
              className={page === key ? 'active' : ''}
              onClick={() => navigate(key)}
            >
              {label}
            </button>
          ))}
          {!user && (
            <button
              onClick={() =>
                document
                  .getElementById('how-it-works')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Como funciona
            </button>
          )}
        </nav>
        <div className="header-actions">
          <button className="demo-button" onClick={onDemo}>
            <span /> Explorar demo
          </button>
          {user ? (
            <div className="account-menu">
              <button
                className="avatar-button"
                onClick={() => setMenu(!menu)}
                aria-expanded={menu}
              >
                <span className="avatar">{initials(user.name)}</span>
                <span className="account-name">{userName(user)}</span>
                <Icon name="chevron" size={15} />
              </button>
              {menu && (
                <div className="account-dropdown">
                  <span>{user.email}</span>
                  <button onClick={() => navigate('profile')}>
                    <Icon name="user" />
                    Meu cadastro
                  </button>
                  <button onClick={onDemo}>
                    <Icon name="users" />
                    Trocar perfil da demo
                  </button>
                  <button
                    onClick={() => {
                      setMenu(false);
                      logout();
                    }}
                  >
                    <Icon name="logout" />
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="login-link" onClick={() => navigate('login')}>
                Entrar
              </button>
              <button className="btn primary small" onClick={() => navigate('signup')}>
                Criar conta
                <Icon name="diagonal" size={16} />
              </button>
            </>
          )}
          <button
            className="icon-button mobile-menu"
            onClick={() => setMobile(!mobile)}
            aria-label="Abrir menu"
            aria-expanded={mobile}
          >
            <Icon name={mobile ? 'close' : 'menu'} />
          </button>
        </div>
      </div>
    </header>
  );
}
