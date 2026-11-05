import React from 'react';
import Icon from '../../components/Icon/Icon.jsx';
import './JoinPage.css';

export default function JoinPage() {
  return (
    <section className="section-container join-page">
      <header className="join-intro">
        <p className="eyebrow">PERFIS DE AGENTE</p>
        <h1>Venha fazer parte</h1>
        <p>Conheça o papel das empresas e dos bancos no AlugaCar.</p>
      </header>
      <div className="join-profiles">
        <article>
          <Icon name="car" size={24} />
          <h2>Empresa</h2>
          <p>
            Para locadoras e empresas que oferecem veículos para aluguel. A empresa analisa os
            pedidos recebidos e formaliza os contratos dos pedidos aprovados para que os clientes
            possam aceitar os termos.
          </p>
        </article>
        <article>
          <Icon name="bank" size={24} />
          <h2>Banco</h2>
          <p>
            Para instituições financeiras que oferecem crédito para aluguel de veículos. O banco
            analisa as solicitações que recebe, consulta a renda declarada dos clientes vinculados
            e registra a concessão do crédito.
          </p>
        </article>
      </div>
    </section>
  );
}
