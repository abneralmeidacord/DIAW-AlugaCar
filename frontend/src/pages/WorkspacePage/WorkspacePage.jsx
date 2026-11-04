import React from 'react';
import Stat from '../../components/Stat/Stat.jsx';
import AgentTable from '../../components/AgentTable/AgentTable.jsx';
import ClientList from '../../components/ClientList/ClientList.jsx';
import CreditList from '../../components/CreditList/CreditList.jsx';
import Icon from '../../components/Icon/Icon.jsx';
import './WorkspacePage.css';

export default function WorkspacePage({
  user,
  page,
  users,
  visibleOrders,
  agentOrders,
  onOpenOrder,
  onOpenCredit,
}) {
  const titles = {
    clients: 'Seus clientes',
    credits: 'Crédito de aluguel',
    'agent-orders': 'Pedidos recebidos',
    workspace: 'Bom dia, ' + user.name.split(' ')[0],
  };
  const descriptions = {
    clients: 'Clientes atendidos pela sua organização.',
    credits: 'Uma análise de cada vez. Decida com os dados do cliente atendido.',
  };
  const description =
    descriptions[page] ||
    'Acompanhe pedidos, avalie solicitações e prepare a próxima viagem.';
  const showOrders = page === 'workspace' || page === 'agent-orders';

  return (
    <section className="section-container workspace-page">
      <div className="workspace-topline">
        <span className="organization-chip">
          <Icon name={user.role === 'banco' ? 'bank' : 'car'} size={16} />
          {user.name}
        </span>
        <span className="small-text">
          Área {user.role === 'banco' ? 'do banco' : 'da empresa'}
        </span>
      </div>
      <div className="page-title-row">
        <div>
          <p className="eyebrow">
            {page === 'clients'
              ? 'RELACIONAMENTOS QUE MOVEM'
              : 'SUA OPERAÇÃO, MAIS SIMPLES'}
          </p>
          <h1>
            {titles[page]}
            <span>.</span>
          </h1>
          <p>{description}</p>
        </div>
        <span className="workspace-date">
          <Icon name="calendar" size={17} />
          {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
        </span>
      </div>
      {page !== 'clients' && (
        <div className="stats-grid">
          <Stat
            label={page === 'credits' ? 'Solicitações recebidas' : 'Pedidos recebidos'}
            value={visibleOrders.length}
            icon="file"
          />
          <Stat
            label={page === 'credits' ? 'Créditos pendentes' : 'Aguardando análise'}
            value={
              visibleOrders.filter((o) =>
                page === 'credits'
                  ? o.credit?.status === 'PENDENTE'
                  : o.status === 'PENDENTE' && !o.evaluation
              ).length
            }
            icon="clock"
          />
          <Stat
            label="Aluguéis ativos"
            value={visibleOrders.filter((o) => o.status === 'ALUGADO').length}
            icon="car"
          />
        </div>
      )}
      {page === 'clients' && (
        <ClientList
          users={users.filter(
            (u) => u.role === 'cliente' && visibleOrders.some((o) => o.userId === u.id)
          )}
          orders={visibleOrders}
          bank={user.role === 'banco'}
          onOpen={(u) => {
            const order = visibleOrders.find((o) => o.userId === u.id);
            if (user.role === 'banco') onOpenCredit(order);
            else onOpenOrder(order);
          }}
        />
      )}
      {page === 'credits' && (
        <CreditList
          orders={visibleOrders.filter((o) => o.credit?.bankOrg === user.org)}
          users={users}
          onOpen={onOpenCredit}
        />
      )}
      {showOrders && (
        <>
          <div className="subsection-heading">
            <h2>{page === 'workspace' ? 'O que acontece agora' : 'Todos os pedidos'}</h2>
            <span>{agentOrders.length} pedidos da sua organização</span>
          </div>
          <AgentTable orders={agentOrders} users={users} onOpen={onOpenOrder} />
        </>
      )}
      <div className="workspace-note">
        <Icon name="shield" />
        <p>
          Você visualiza somente os atendimentos associados à sua organização. Neste
          protótipo, novos pedidos dirigidos a ela também podem ser avaliados.
        </p>
      </div>
    </section>
  );
}
