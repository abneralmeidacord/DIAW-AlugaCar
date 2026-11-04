import React from 'react';
import Icon from '../Icon/Icon.jsx';
import Brand from '../Brand/Brand.jsx';
import './Footer.css';

export default function Footer({ user, navigate, onDemo }) {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div>
          <Brand inverse onClick={() => navigate('home')} />
          <p>
            Escolhas simples.
            <br />
            Caminhos extraordinários.
          </p>
        </div>
        <div>
          <small>ENCONTRE SEU CAMINHO</small>
          <button onClick={() => navigate('catalog')}>Explorar veículos</button>
          <button
            onClick={() =>
              navigate(user?.role === 'cliente' ? 'orders' : user ? 'workspace' : 'login')
            }
          >
            Acompanhar pedidos
          </button>
        </div>
        <div>
          <small>JÁ FAZ PARTE?</small>
          <button onClick={() => navigate(user ? 'profile' : 'signup')}>
            {user ? 'Meu cadastro' : 'Criar uma conta'}
          </button>
          <button onClick={() => onDemo()}>Conhecer os perfis</button>
        </div>
        <div className="footer-note">
          <span>
            <i /> Protótipo de demonstração
          </span>
          <p>
            Dados, preços e contratos fictícios.
            <br />
            Projeto acadêmico · DIAW · 2026
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 AlugaCar. Um novo jeito de seguir.</span>
        <span>
          Feito para os próximos caminhos.
          <Icon name="diagonal" size={15} />
        </span>
      </div>
    </footer>
  );
}
