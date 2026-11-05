import React from 'react';
import Icon from '../../components/Icon/Icon.jsx';
import './HowItWorksPage.css';

const steps = [
  {
    icon: 'search',
    title: 'Encontre seu carro',
    description: 'Explore o catálogo por marca ou categoria e escolha um veículo para a sua viagem.',
  },
  {
    icon: 'file',
    title: 'Solicite o aluguel',
    description: 'Informe as datas de retirada e devolução. Acompanhe a análise da empresa em Meus pedidos.',
  },
  {
    icon: 'check',
    title: 'Confirme e alugue',
    description: 'Quando o contrato estiver disponível, confira os termos, aceite e selecione Alugar para ativar a locação.',
  },
];

export default function HowItWorksPage({ navigate }) {
  return (
    <section className="section-container how-it-works">
      <div className="how-intro">
        <p className="eyebrow">GUIA DE ALUGUEL</p>
        <h1>Como funciona</h1>
        <p>Da escolha do veículo à confirmação do aluguel, acompanhe cada etapa pelo AlugaCar.</p>
        <button className="btn primary" onClick={() => navigate('catalog')}>
          Explorar veículos
          <Icon name="diagonal" size={16} />
        </button>
      </div>
      <ol className="how-steps" aria-label="Etapas do aluguel">
        {steps.map(({ icon, title, description }, index) => (
          <li key={title}>
            <div className="how-step-label">
              <Icon name={icon} size={21} />
              <span>Etapa {index + 1}</span>
            </div>
            <h2>{title}</h2>
            <p>{description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
