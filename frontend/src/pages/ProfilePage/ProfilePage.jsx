import React, { useState, useEffect } from 'react';
import Icon from '../../components/Icon/Icon.jsx';
import Field from '../../components/Field/Field.jsx';
import { money, incomeOf, initials } from '../../data/format.js';
import { canDeleteClient } from '../../data/orders.js';
import './ProfilePage.css';

export default function ProfilePage({ user, orders, onSave, onDelete }) {
  const [data, setData] = useState(() => structuredClone(user));
  const [tab, setTab] = useState('personal');
  useEffect(() => setData(structuredClone(user)), [user.id]);
  const change = (key, value) => setData((d) => ({ ...d, [key]: value }));
  const jobChange = (i, key, value) =>
    setData((d) => ({
      ...d,
      jobs: (d.jobs || []).map((j, n) =>
        n === i ? { ...j, [key]: key === 'income' ? Number(value) : value } : j
      ),
    }));
  return (
    <section className="section-container profile-page">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">UM CADASTRO QUE ACOMPANHA VOCÊ</p>
          <h1>
            Meu cadastro<span>.</span>
          </h1>
          <p>Mantenha seus dados e sua renda declarada atualizados.</p>
        </div>
        <span className="avatar large">{initials(user.name)}</span>
      </div>
      <div className="profile-layout">
        <aside className="profile-sidebar">
          <button
            className={tab === 'personal' ? 'active' : ''}
            onClick={() => setTab('personal')}
          >
            <Icon name="user" />
            Dados {user.role === 'cliente' ? 'pessoais' : 'da organização'}
            <Icon name="arrow" size={16} />
          </button>
          {user.role === 'cliente' && (
            <button
              className={tab === 'income' ? 'active' : ''}
              onClick={() => setTab('income')}
            >
              <Icon name="bank" />
              Rendimentos
              <Icon name="arrow" size={16} />
            </button>
          )}
          <div>
            <Icon name="shield" size={22} />
            <p>Seus dados são usados nos seus atendimentos e na análise do seu pedido.</p>
          </div>
        </aside>
        <form
          className="profile-form stack-form"
          onSubmit={(e) => {
            e.preventDefault();
            onSave(data);
          }}
        >
          {tab === 'personal' ? (
            <>
              <div className="form-section-heading">
                <h2>{user.role === 'cliente' ? 'Dados pessoais' : 'Sua organização'}</h2>
                <p>Suas informações para seguir com tranquilidade.</p>
              </div>
              <div className="form-grid">
                <Field
                  label={user.role === 'cliente' ? 'Nome completo' : 'Razão social'}
                  value={data.name || ''}
                  onChange={(e) => change('name', e.target.value)}
                  required
                />
                <Field
                  label="E-mail"
                  value={data.email}
                  type="email"
                  readOnly
                  hint="E-mail usado no acesso à conta."
                />
              </div>
              {user.role === 'cliente' ? (
                <>
                  <div className="form-grid">
                    <Field
                      label="CPF"
                      value={data.cpf || ''}
                      onChange={(e) => change('cpf', e.target.value)}
                      required
                    />
                    <Field
                      label="RG"
                      value={data.rg || ''}
                      onChange={(e) => change('rg', e.target.value)}
                      required
                    />
                  </div>
                  <Field
                    label="Endereço"
                    value={data.address || ''}
                    onChange={(e) => change('address', e.target.value)}
                    required
                  />
                  <Field
                    label="Profissão"
                    value={data.profession || ''}
                    onChange={(e) => change('profession', e.target.value)}
                    required
                  />
                </>
              ) : (
                <Field
                  label="CNPJ"
                  value={data.cnpj || ''}
                  onChange={(e) => change('cnpj', e.target.value)}
                  required
                />
              )}
            </>
          ) : (
            <>
              <div className="form-section-heading">
                <h2>Rendimentos declarados</h2>
                <p>
                  Informe até três vínculos. O total é a soma dos rendimentos declarados.
                </p>
              </div>
              {(data.jobs || []).map((job, i) => (
                <div className="job-row" key={i}>
                  <span className="job-number">0{i + 1}</span>
                  <Field
                    label="Entidade empregadora"
                    value={job.employer}
                    onChange={(e) => jobChange(i, 'employer', e.target.value)}
                    required
                  />
                  <Field
                    label="Rendimento mensal"
                    type="number"
                    min="0"
                    step="0.01"
                    value={job.income}
                    onChange={(e) => jobChange(i, 'income', e.target.value)}
                    required
                  />
                  <button
                    className="icon-button"
                    type="button"
                    aria-label={`Remover vínculo ${i + 1}`}
                    onClick={() =>
                      setData((d) => ({ ...d, jobs: d.jobs.filter((_, n) => n !== i) }))
                    }
                  >
                    <Icon name="trash" />
                  </button>
                </div>
              ))}
              {(data.jobs || []).length < 3 && (
                <button
                  className="btn secondary add-job"
                  type="button"
                  onClick={() =>
                    setData((d) => ({
                      ...d,
                      jobs: [...(d.jobs || []), { employer: '', income: 0 }],
                    }))
                  }
                >
                  <Icon name="plus" size={18} />
                  Adicionar vínculo
                </button>
              )}
              <div className="income-summary">
                <div>
                  <small>RENDA MENSAL TOTAL</small>
                  <strong>{money(incomeOf(data))}</strong>
                </div>
                <p>
                  O banco vinculado ao atendimento pode consultar essa renda para analisar
                  seu crédito de aluguel.
                </p>
              </div>
            </>
          )}
          <div className="profile-form-footer">
            <span>
              <Icon name="shield" size={16} />
              Dados de demonstração
            </span>
            <button className="btn primary" type="submit">
              Salvar alterações
              <Icon name="check" size={18} />
            </button>
          </div>
        </form>
      </div>
      {user.role === 'cliente' && (
        <div className="delete-zone">
          <div>
            <h3>Exclusão de cadastro</h3>
            <p>
              {canDeleteClient(user.id, orders)
                ? 'A exclusão será verificada conforme o histórico dos seus pedidos.'
                : 'Você possui contrato vigente ou aluguel ativo. A exclusão fica bloqueada.'}
            </p>
          </div>
          <button className="btn danger-outline" onClick={onDelete}>
            <Icon name="trash" size={17} />
            Excluir cadastro
          </button>
        </div>
      )}
    </section>
  );
}
