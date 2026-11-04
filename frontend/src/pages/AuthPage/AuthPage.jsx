import React, { useState, useEffect } from 'react';
import Icon from '../../components/Icon/Icon.jsx';
import Field from '../../components/Field/Field.jsx';
import { photos } from '../../data/cars.js';
import { createCredential, verifyCredential } from '../../data/auth.js';
import './AuthPage.css';

export default function AuthPage({ signup, db, onNavigate, onLogin, onRegister }) {
  const [role, setRole] = useState('cliente');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [values, setValues] = useState({
    name: '',
    email: 'cliente@alugacar.demo',
    password: 'demo123',
    cpf: '',
    rg: '',
    address: '',
    profession: '',
    employer: '',
    income: '',
    cnpj: '',
  });
  useEffect(() => {
    setError('');
    setValues((v) => ({
      ...v,
      email: signup ? '' : `${role}@alugacar.demo`,
      password: signup ? '' : 'demo123',
    }));
  }, [role, signup]);
  const change = (key, value) => setValues((v) => ({ ...v, [key]: value }));
  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (!signup) {
        const account = db.users.find(
          (u) =>
            u.email.toLowerCase() === values.email.trim().toLowerCase() && u.role === role
        );
        if (!account || !(await verifyCredential(account, values.password)))
          throw new Error('Confira seu e-mail, senha e o perfil selecionado.');
        onLogin(account.id);
      } else {
        if (
          db.users.some(
            (u) => u.email.toLowerCase() === values.email.trim().toLowerCase()
          )
        )
          throw new Error('Este e-mail já está cadastrado. Entre na sua conta.');
        if (values.password.length < 6)
          throw new Error('Use uma senha com pelo menos 6 caracteres.');
        const credential = await createCredential(values.password);
        const id = crypto.randomUUID();
        onRegister({
          id,
          role,
          name: values.name.trim(),
          email: values.email.trim().toLowerCase(),
          credential,
          ...(role === 'cliente'
            ? {
                cpf: values.cpf,
                rg: values.rg,
                address: values.address,
                profession: values.profession,
                jobs: values.employer
                  ? [{ employer: values.employer, income: Number(values.income || 0) }]
                  : [],
              }
            : { cnpj: values.cnpj, org: id }),
        });
      }
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
              onClick={() => setRole(r)}
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
              <div className="form-grid">
                <Field label={role === 'cliente' ? 'CPF' : 'CNPJ'}>
                  {input(role === 'cliente' ? 'cpf' : 'cnpj', {
                    placeholder:
                      role === 'cliente' ? '000.000.000-00' : '00.000.000/0000-00',
                  })}
                </Field>
                {role === 'cliente' && (
                  <Field label="RG">{input('rg', { placeholder: 'Seu RG' })}</Field>
                )}
              </div>
            </>
          )}
          <Field label="E-mail">
            {input('email', {
              type: 'email',
              placeholder: 'voce@exemplo.com',
              autoComplete: 'email',
            })}
          </Field>
          <Field
            label="Senha"
            hint={
              signup
                ? 'Pelo menos 6 caracteres. Use uma senha fictícia para esta demonstração.'
                : !db.users.find((u) => u.email === values.email)?.credential
                  ? 'Acesso de demonstração: demo123'
                  : undefined
            }
          >
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
        <div className="auth-demo-note">
          <Icon name="shield" size={17} />
          <p>
            Protótipo visual. Use apenas dados fictícios. A autenticação de produção será
            integrada ao back-end.
          </p>
        </div>
      </div>
    </section>
  );
}
