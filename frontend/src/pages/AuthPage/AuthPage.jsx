import React, { useState } from 'react';
import Icon from '../../components/Icon/Icon.jsx';
import Field from '../../components/Field/Field.jsx';
import { photos } from '../../data/cars.js';
import './AuthPage.css';

export default function AuthPage({
  signup,
  initialRole = 'cliente',
  onNavigate,
  onLogin,
  onRegister,
}) {
  const [role, setRole] = useState(initialRole);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    cpf: '',
    address: '',
    profession: '',
    employer: '',
    income: '',
    cnpj: '',
  });
  const change = (key, value) => setValues((v) => ({ ...v, [key]: value }));
  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const account = {
        ...values,
        role,
        email: values.email.trim().toLowerCase(),
        jobs: values.employer
          ? [{ employer: values.employer, income: Number(values.income || 0) }]
          : [],
      };
      if (signup) await onRegister(account);
      else await onLogin(account);
    } catch (err) {
      setError(err.message || 'Não foi possível concluir o acesso. Tente novamente.');
    } finally {
      setBusy(false);
    }
  };
  const input = (name, props = {}) => (
    <input
      {...props}
      value={values[name]}
      onChange={(e) => change(name, e.target.value)}
      required={props.required !== false}
    />
  );
  return (
    <section className={`auth-layout ${signup ? 'signup' : ''}`}>
      <aside className="auth-visual">
        <img
          src={photos.hero}
          referrerPolicy="no-referrer"
          alt="Uma estrada e novas possibilidades"
        />
        <div className="auth-visual-shade" />
        <div>
          <p className="hero-kicker">
            <span /> SEU PRÓXIMO CAMINHO
          </p>
          <h2>
            Boas viagens
            <br />
            começam com
            <br />
            <em>boas escolhas.</em>
          </h2>
          <p>
            Um carro para seus planos.
            <br />
            Um jeito mais simples de seguir.
          </p>
        </div>
        <span className="auth-visual-caption">ALUGACAR · LIBERDADE PARA ESCOLHER</span>
      </aside>
      <div className="auth-form-area">
        <p className="eyebrow">{signup ? 'VAMOS COMEÇAR?' : 'BOM TER VOCÊ POR AQUI'}</p>
        <h1>{signup ? 'Seu próximo passo.' : 'Bem-vindo de volta.'}</h1>
        <p>
          {signup
            ? 'Crie sua conta e comece a explorar novas possibilidades.'
            : 'Entre para continuar de onde seus planos pararam.'}
        </p>
        <div className="role-tabs" aria-label="Tipo de conta">
          {[
            ['cliente', 'Cliente', 'user'],
            ['empresa', 'Empresa', 'car'],
            ['banco', 'Banco', 'bank'],
          ].map(([r, label, icon]) => (
            <button
              key={r}
              type="button"
              className={role === r ? 'active' : ''}
              onClick={() => {
                setRole(r);
                setError('');
              }}
            >
              <Icon name={icon} size={17} />
              {label}
            </button>
          ))}
        </div>
        <form onSubmit={submit} className="stack-form">
          {signup && (
            <>
              <Field label={role === 'cliente' ? 'Nome completo' : 'Razão social'}>
                {input('name', {
                  placeholder:
                    role === 'cliente'
                      ? 'Como podemos te chamar?'
                      : 'Nome da sua organização',
                  autoComplete: 'name',
                })}
              </Field>
              <Field label={role === 'cliente' ? 'CPF' : 'CNPJ'}>
                {input(role === 'cliente' ? 'cpf' : 'cnpj', {
                  placeholder:
                    role === 'cliente' ? '000.000.000-00' : '00.000.000/0000-00',
                })}
              </Field>
            </>
          )}
          <Field label="E-mail">
            {input('email', {
              type: 'email',
              placeholder: 'voce@exemplo.com',
              autoComplete: 'email',
            })}
          </Field>
          <Field label="Senha" hint={signup ? 'Pelo menos 6 caracteres.' : undefined}>
            {input('password', {
              type: 'password',
              minLength: 6,
              placeholder: 'Sua senha',
              autoComplete: signup ? 'new-password' : 'current-password',
            })}
          </Field>
          {signup && role === 'cliente' && (
            <>
              <div className="form-grid">
                <Field label="Endereço">
                  {input('address', { placeholder: 'Rua, número, cidade' })}
                </Field>
                <Field label="Profissão">
                  {input('profession', { placeholder: 'Sua profissão' })}
                </Field>
              </div>
              <div className="form-grid">
                <Field label="Entidade empregadora">
                  {input('employer', {
                    placeholder: 'Empresa ou atividade',
                    required: false,
                  })}
                </Field>
                <Field label="Renda mensal declarada">
                  {input('income', {
                    type: 'number',
                    min: 0,
                    step: '0.01',
                    placeholder: '0,00',
                    required: false,
                  })}
                </Field>
              </div>
            </>
          )}
          {error && (
            <p className="form-error" role="alert">
              <Icon name="info" size={17} />
              {error}
            </p>
          )}
          <button className="btn primary full" type="submit" disabled={busy}>
            {busy
              ? 'Só um instante…'
              : signup
                ? 'Criar minha conta'
                : 'Entrar na minha conta'}
            <Icon name="arrow" size={19} />
          </button>
        </form>
        <p className="auth-switch">
          {signup ? 'Já tem uma conta?' : 'Ainda não faz parte?'}{' '}
          <button onClick={() => onNavigate(signup ? 'login' : 'signup')}>
            {signup ? 'Entrar' : 'Crie sua conta'}
          </button>
        </p>
        <div className="auth-security-note">
          <Icon name="shield" size={17} />
          <p>Seus dados são protegidos. O acesso à sua conta exige autenticação.</p>
        </div>
      </div>
    </section>
  );
}
