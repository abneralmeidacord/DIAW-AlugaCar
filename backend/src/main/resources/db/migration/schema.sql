-- Execute este arquivo no SQL Editor do Supabase antes de iniciar o backend.
-- O esquema privado não é exposto pela API pública do Supabase.
create schema if not exists alugacar;
revoke all on schema alugacar from public;

create table if not exists alugacar.usuarios (
    id uuid primary key,
    login varchar(254) not null unique,
    senha_hash varchar(100) not null
);

create table if not exists alugacar.clientes (
    id uuid primary key references alugacar.usuarios(id),
    cpf varchar(20) not null,
    nome varchar(150) not null,
    endereco varchar(300) not null,
    profissao varchar(100) not null
);

create table if not exists alugacar.agentes (
    id uuid primary key references alugacar.usuarios(id),
    razao_social varchar(150) not null,
    cnpj varchar(25) not null
);

create table if not exists alugacar.empresas (
    id uuid primary key references alugacar.agentes(id)
);

create table if not exists alugacar.bancos (
    id uuid primary key references alugacar.agentes(id)
);

create table if not exists alugacar.vinculos_empregaticios (
    id uuid primary key,
    cliente_id uuid not null references alugacar.clientes(id),
    entidade_empregadora varchar(150) not null,
    rendimento numeric(14,2) not null check (rendimento >= 0),
    posicao integer not null check (posicao between 0 and 2)
);

create table if not exists alugacar.automoveis (
    id uuid primary key,
    codigo varchar(50) not null unique,
    matricula varchar(50) not null unique,
    ano integer not null,
    marca varchar(50) not null,
    modelo varchar(100) not null,
    placa varchar(20) not null unique,
    categoria varchar(50) not null,
    proprietario_id uuid not null references alugacar.usuarios(id),
    diaria numeric(14,2) not null check (diaria > 0),
    combustivel varchar(50) not null,
    cor varchar(50),
    foto varchar(2000),
    destaque varchar(150),
    localidade varchar(120)
);

create table if not exists alugacar.pedidos_aluguel (
    id uuid primary key,
    cliente_id uuid not null references alugacar.clientes(id),
    automovel_id uuid not null references alugacar.automoveis(id),
    destinatario_id uuid not null references alugacar.agentes(id),
    criado_em timestamp(6) not null,
    data_inicio date not null,
    data_fim date not null,
    diaria numeric(14,2) not null check (diaria > 0),
    localidade varchar(120),
    status varchar(30) not null check (status in ('PENDENTE','AGUARDANDO_ACEITE','APROVADO','ALUGADO','CANCELADO','REPROVADO','FINALIZADO')),
    credito_solicitado boolean not null,
    banco_credito_id uuid references alugacar.bancos(id),
    check (data_fim > data_inicio),
    check (not credito_solicitado or banco_credito_id is not null)
);

create table if not exists alugacar.avaliacoes_financeiras (
    id uuid primary key,
    pedido_id uuid not null references alugacar.pedidos_aluguel(id),
    agente_id uuid not null references alugacar.agentes(id),
    parecer varchar(20) not null check (parecer in ('POSITIVO','NEGATIVO')),
    justificativa varchar(3000) not null,
    avaliada_em timestamp(6) not null
);

create table if not exists alugacar.contratos_aluguel (
    id uuid primary key,
    pedido_id uuid not null unique references alugacar.pedidos_aluguel(id),
    numero varchar(60) not null unique,
    agente_id uuid not null references alugacar.agentes(id),
    formalizado_em timestamp(6) not null,
    aceito_em timestamp(6),
    iniciado_em timestamp(6),
    status varchar(30) not null check (status in ('AGUARDANDO_ACEITE','ACEITO','VIGENTE','ENCERRADO')),
    termos varchar(10000) not null
);

create table if not exists alugacar.contratos_credito (
    id uuid primary key,
    aluguel_id uuid not null unique references alugacar.contratos_aluguel(id),
    banco_id uuid not null references alugacar.bancos(id),
    numero varchar(60) not null unique,
    valor numeric(14,2) not null check (valor > 0),
    data_concessao date not null,
    concedido_em timestamp(6) not null,
    renda_considerada numeric(16,2) not null check (renda_considerada >= 0)
);

create table if not exists alugacar.eventos_pedido (
    id uuid primary key,
    pedido_id uuid not null references alugacar.pedidos_aluguel(id),
    descricao varchar(150) not null,
    registrado_em timestamp(6) not null,
    posicao integer not null
);

create index if not exists idx_pedidos_cliente on alugacar.pedidos_aluguel(cliente_id);
create index if not exists idx_pedidos_destinatario on alugacar.pedidos_aluguel(destinatario_id);
create index if not exists idx_pedidos_banco on alugacar.pedidos_aluguel(banco_credito_id);
revoke all on all tables in schema alugacar from public;

-- Atualiza instalações que já tinham as tabelas de veículos e pedidos.
alter table alugacar.automoveis add column if not exists localidade varchar(120);
alter table alugacar.pedidos_aluguel add column if not exists localidade varchar(120);

-- Ajusta bancos antigos que ainda têm RG ou colunas obrigatórias no cadastro de carros.
-- As colunas antigas de carros continuam guardando os valores já cadastrados.
alter table alugacar.clientes drop column if exists rg;

-- As aspas simples permitem ao Spring ler o bloco inteiro como um comando.
do '
declare
    coluna text;
begin
    for coluna in
        select column_name
        from information_schema.columns
        where table_schema = ''alugacar''
          and table_name = ''automoveis''
          and column_name in (''lugares'', ''cambio'', ''tom'')
          and is_nullable = ''NO''
    loop
        execute format(''alter table alugacar.automoveis alter column %I drop not null'', coluna);
    end loop;
end;
';
