import { carTone, defaultLocation } from '../../data/cars.js';
import React from 'react';
import Icon from '../Icon/Icon.jsx';
import CarImage from '../CarImage/CarImage.jsx';
import Modal from '../Modal/Modal.jsx';
import Badge from '../Badge/Badge.jsx';
import { organizations, statusLabels } from '../../data/demo.js';
import { money, dateLabel, daysBetween, initials } from '../../data/format.js';
import { canManageOrder, canEditOrder } from '../../data/orders.js';
import './OrderModal.css';

export default function OrderModal({
  car,
  order,
  user,
  client,
  onClose,
  onAction,
  onModal,
}) {
  const isClient = user.role === 'cliente';
  const manage = canManageOrder(user, order);
  const progress = { ALUGADO: 4, APROVADO: 3, AGUARDANDO_ACEITE: 2 };
  const step = progress[order.status] ?? (order.evaluation ? 1 : 0);
  const messages = {
    AGUARDANDO_ACEITE: {
      title: 'Seu contrato está disponível',
      body: 'Confira o contrato com calma. O aluguel só será ativado após seu aceite e a ação Alugar.',
    },
    APROVADO: {
      title: 'Tudo pronto para partir',
      body: 'O contrato já foi aceito. Clique em Alugar para ativar a locação.',
    },
    ALUGADO: {
      title: 'Boa viagem!',
      body: 'Contrato vigente. Você pode acompanhar o período e consultar os termos por aqui.',
    },
    CANCELADO: {
      title: 'Pedido cancelado',
      body: 'O registro permanece no histórico para sua consulta.',
    },
    REPROVADO: {
      title: 'Solicitação não aprovada',
      body: order.evaluation?.note || 'Confira o parecer registrado pelo agente.',
    },
  };
  const nextStep = messages[order.status] || {
    title: order.evaluation
      ? 'Parecer favorável registrado'
      : 'Seu pedido está em análise',
    body: order.evaluation
      ? 'O agente responsável já pode formalizar o contrato de aluguel.'
      : 'A organização responsável avaliará os dados e o período solicitado.',
  };
  return (
    <Modal
      wide
      title="Seu próximo caminho, em detalhes."
      subtitle={order.id}
      onClose={onClose}
    >
      <div className="order-detail-top">
        <div className={`order-detail-image tone-${carTone(car.category)}`}>
          <CarImage car={car} />
        </div>
        <div>
          <Badge status={order.status} label={statusLabels[order.status]} />
          <h3>
            {car.brand} {car.model}
          </h3>
          <p>{order.orgName || organizations[order.org] || 'Organização responsável'}</p>
          <p>Retirada e devolução em {order.location || defaultLocation}</p>
          <div className="order-detail-period">
            <Icon name="calendar" size={18} />
            {dateLabel(order.start)} — {dateLabel(order.end)}
          </div>
          <strong className="order-detail-total">
            {money(daysBetween(order.start, order.end) * order.daily)}
            <small> / {daysBetween(order.start, order.end)} diárias</small>
          </strong>
        </div>
      </div>
      <div className="rental-progress">
        {[
          'Pedido enviado',
          'Análise do agente',
          'Contrato disponível',
          'Contrato aceito',
          'Aluguel ativo',
        ].map((label, i) => (
          <div className={i <= step ? 'done' : ''} key={label}>
            <span>{i < step ? <Icon name="check" size={14} /> : i + 1}</span>
            <small>{label}</small>
          </div>
        ))}
      </div>
      <div className="order-detail-columns">
        <section>
          <h3>{isClient ? 'Histórico do pedido' : 'Cliente do pedido'}</h3>
          {!isClient && (
            <div className="request-client">
              <span className="avatar">{initials(client?.name)}</span>
              <div>
                <strong>{client?.name}</strong>
                <p>{client?.email}</p>
                <small>{client?.profession || 'Cliente cadastrado'}</small>
              </div>
            </div>
          )}
          <div className="timeline">
            {(order.events || []).map((event, i) => (
              <div key={i}>
                <span />
                <div>
                  <strong>{event.label}</strong>
                  <small>
                    {new Date(event.at).toLocaleDateString('pt-BR')} ·{' '}
                    {new Date(event.at).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="order-next-step">
          <p className="eyebrow">PRÓXIMO PASSO</p>
          <h3>{nextStep.title}</h3>
          <p>{nextStep.body}</p>
          {order.evaluation && (
            <div className="evaluation-summary">
              <Icon name="file" size={17} />
              <span>{order.evaluation.note}</span>
            </div>
          )}
          {isClient && order.contract && (
            <button
              className={`btn ${order.status === 'AGUARDANDO_ACEITE' ? 'primary' : 'secondary'} full`}
              onClick={() => onModal('contract')}
            >
              <Icon name="file" size={18} />
              {order.status === 'AGUARDANDO_ACEITE'
                ? 'Ler e aceitar contrato'
                : 'Consultar contrato'}
            </button>
          )}
          {isClient && order.status === 'APROVADO' && (
            <button className="btn primary full" onClick={() => onAction(order, 'rent')}>
              Alugar agora
              <Icon name="diagonal" />
            </button>
          )}
          {manage && order.status === 'PENDENTE' && !order.evaluation && (
            <button className="btn primary full" onClick={() => onModal('evaluate')}>
              Avaliar pedido
              <Icon name="arrow" />
            </button>
          )}
          {manage &&
            order.status === 'PENDENTE' &&
            order.evaluation?.result === 'POSITIVO' &&
            order.evaluation.by === user.id && (
              <button className="btn primary full" onClick={() => onModal('formalize')}>
                Formalizar contrato
                <Icon name="file" />
              </button>
            )}
          {user.role === 'banco' && order.credit?.bankOrg === user.org && (
            <button className="btn secondary full" onClick={() => onModal('credit')}>
              Consultar solicitação de crédito
              <Icon name="bank" />
            </button>
          )}
        </section>
      </div>
      {canEditOrder(user, order) && (
        <div className="order-secondary-actions">
          <button className="text-link" onClick={() => onModal('editOrder')}>
            <Icon name="edit" size={16} />
            Modificar período
          </button>
          {isClient && (
            <button
              className="text-link danger-text"
              onClick={() => onModal('confirmCancel')}
            >
              Cancelar pedido
            </button>
          )}
        </div>
      )}
    </Modal>
  );
}
