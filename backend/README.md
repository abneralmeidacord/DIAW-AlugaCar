# AlugaCar — backend

Java 25, Spring Boot 4.0.9, Maven, Spring MVC, Spring Security, JPA e PostgreSQL do Supabase. O React usa a API REST; entidades JPA nunca são devolvidas diretamente ao navegador.

## Onde encontrar cada parte

| Pasta        | Responsabilidade                                   |
| ------------ | -------------------------------------------------- |
| `controller` | Recebe a chamada HTTP e chama o service            |
| `service`    | Aplica as regras e acessa o banco pelo JPA        |
| `entity`     | Representa as tabelas e suas relações              |
| `model`      | Define o JSON que a API recebe e devolve           |
| `exception`  | Traduz os erros em respostas HTTP                  |

No cadastro de carro, a rota `POST /api/carros` chega ao `AutomovelController`. O `AutomovelService` associa o proprietário autenticado e salva o carro pelo `EntityManager` do JPA.

A classe `AlugaCarApplication` configura as rotas protegidas e a sessão de login. O `UsuarioService` fornece ao Spring Security o usuário e o hash da senha pela interface `UserDetailsService`.

## Executar com Supabase

1. No SQL Editor do Supabase, execute `src/main/resources/db/migration/schema.sql`. Em um banco novo, ele cria as tabelas diretamente com os campos atuais. Se você aplicou só o primeiro script antigo, pare o backend e execute o mesmo arquivo para atualizar seu banco. A atualização apaga os valores de RG e preserva as contas e os carros. Se você já aplicou os dois scripts antigos, pode pular este passo.
2. Nesta pasta, copie `.env.example` para `.env` e preencha a URL JDBC, o usuário e a senha do banco. Use **Connect → Session pooler**, porta **5432**, com `sslmode=require`. As variáveis não são chaves públicas/anon do Supabase: são as credenciais PostgreSQL do servidor.
3. Confira `JAVA_HOME` apontando para um JDK 25. Execute:

```powershell
mvn test
mvn clean spring-boot:run
```

O arquivo `.env` é lido como propriedades Java: use linhas `CHAVE=valor`, sem `export` e sem aspas envolvendo os valores. Variáveis exportadas no sistema também funcionam. Não coloque a senha do banco em nenhuma variável `VITE_*`.

O backend escuta em `http://localhost:8080`. Em outro terminal:

```powershell
cd ../frontend
npm install
npm run dev
```

Abra `http://localhost:5173`. O Vite encaminha `/api` ao backend. Para hospedagem, mantenha frontend e API sob a mesma origem por proxy reverso; em HTTPS, configure `COOKIE_SECURE=true`. `FRONTEND_ORIGIN` aceita origens separadas por vírgulas. Não use `*` com cookies.

O Hibernate valida o esquema na inicialização. Com `DB_INIT_MODE=never`, aplique o arquivo pelo SQL Editor. A opção `DB_INIT_MODE=always` executa `schema.sql` na inicialização do backend com PostgreSQL.

## Executar localmente sem as credenciais

```powershell
mvn spring-boot:run "-Dspring-boot.run.profiles=local"
```

O perfil **local** usa H2 em arquivo `backend/data/`, sem conectar ao Supabase. É uma alternativa de desenvolvimento; o perfil padrão continua exigindo PostgreSQL. Os testes usam H2 em memória com dados isolados e transações revertidas.

Se o banco H2 da demo foi criado antes da remoção do RG e ainda exige os campos antigos, pare o backend e renomeie `backend/data/alugacar.mv.db` para `alugacar-backup.mv.db` na mesma pasta. A próxima execução do perfil local cria um novo banco de demonstração. Seus dados anteriores ficam no backup.

O perfil local cria três contas e seis automóveis caso não existam:

| Perfil  | Login                   | Senha local |
| ------- | ----------------------- | ----------- |
| Cliente | `cliente@alugacar.demo` | `demo123`   |
| Empresa | `empresa@alugacar.demo` | `demo123`   |
| Banco   | `banco@alugacar.demo`   | `demo123`   |

O fluxo começa na escolha do automóvel. O botão de demo do frontend escolhe o perfil da tela de login. No Supabase, a criação das contas de demonstração é desativada por padrão (`APP_SEED_DEMO=false`). Também é possível cadastrar as organizações pela tela e cadastrar sua frota pelo endpoint protegido `POST /api/carros`.

## Autenticação e chamadas HTTP

O login usa Spring Security com senha BCrypt, sessão no servidor e cookie HttpOnly. A senha não fica no armazenamento do navegador. Login, cadastro e demais mutações exigem CSRF.

1. Faça `GET /api/auth/csrf`, guarde os cookies e leia `token` e `headerName`.
2. Faça `POST /api/auth/login` como `application/x-www-form-urlencoded`, com campos `login` e `senha`, incluindo o header CSRF e os cookies.
3. Após o login, obtenha um novo token CSRF. Consulte `/api/perfil`.
4. Envie cookies em todas as consultas e inclua o token nas mutações. O frontend já faz esse fluxo em `src/services/api.js`.

`POST /api/auth/register` recebe JSON. Exemplo de cliente:

```json
{
  "role": "cliente",
  "name": "Cliente Exemplo",
  "email": "cliente@exemplo.com",
  "password": "senha-ficticia",
  "cpf": "000.000.000-00",
  "address": "Rua de exemplo, 10, Belo Horizonte",
  "profession": "Estudante",
  "jobs": [{ "employer": "Empresa exemplo", "income": 2500.0 }]
}
```

Empresa e banco usam `role` igual a `empresa` ou `banco`, `name` como razão social e `cnpj`; não precisam de aprovação. O login é o e-mail normalizado, único entre todos os perfis. A resposta não contém senha nem hash. Cada conta de agente representa a organização do diagrama.

## Endpoints

| Método             | Caminho                                            | Uso                                                |
| ------------------ | -------------------------------------------------- | -------------------------------------------------- |
| GET                | `/api/health`                                      | Verificação pública da aplicação                   |
| GET                | `/api/auth/csrf`                                   | Iniciar/renovar proteção CSRF                      |
| POST               | `/api/auth/register`                               | Criar cliente, empresa ou banco                    |
| POST               | `/api/auth/login`                                  | Login por formulário; retorna 204                  |
| POST               | `/api/auth/logout`                                 | Encerrar sessão                                    |
| GET / PUT / DELETE | `/api/perfil`                                      | Consultar, atualizar ou excluir o próprio cadastro |
| GET                | `/api/carros?marca=Volvo&categoria=SUV&busca=XC60` | Pesquisar a frota                                  |
| POST               | `/api/carros`                                      | Agente cadastra um carro de sua organização        |
| GET                | `/api/bancos`                                      | Organizações bancárias disponíveis                 |
| GET                | `/api/clientes`                                    | Clientes dos atendimentos autorizados              |
| GET                | `/api/clientes/{id}/renda`                         | Banco consulta renda de cliente vinculado          |
| GET / POST         | `/api/pedidos`                                     | Consultar pedidos autorizados/criar pedido         |
| GET / PUT          | `/api/pedidos/{id}`                                | Consultar/alterar período                          |
| POST               | `/api/pedidos/{id}/cancelar`                       | Cliente cancela pedido ainda não avaliado          |
| POST               | `/api/pedidos/{id}/avaliar`                        | Agente registra parecer e justificativa            |
| POST               | `/api/pedidos/{id}/formalizar`                     | Mesmo agente formaliza os termos                   |
| POST               | `/api/pedidos/{id}/aceitar`                        | Cliente aceita; pedido APROVADO                    |
| POST               | `/api/pedidos/{id}/alugar`                         | Cliente ativa; pedido ALUGADO e contrato VIGENTE   |
| POST               | `/api/pedidos/{id}/credito`                        | Banco vinculado concede crédito                    |

Pedidos recebem `{ "carId": "UUID", "start": "2026-12-01", "end": "2026-12-03", "credit": false }`. Se houver crédito, informe `credit: true` e `bankId`. Sem `bankId`, o servidor só escolhe automaticamente quando existe exatamente um banco cadastrado. Cliente, organização e diária são derivados pelo servidor; não vêm do navegador.

Alterações recebem `start` e `end`. Avaliação recebe `result` (`POSITIVO`/`NEGATIVO`) e `note`. Formalização recebe `terms`. Concessão recebe `amount`; **rendaConsiderada é lida do banco, nunca do JSON do cliente**. Datas de negócio usam `America/Sao_Paulo`; instantes de auditoria são armazenados em UTC.

`POST /api/carros` recebe `code`, `matricula`, `year`, `brand`, `model`, `plate`, `category`, `price`, `fuel`, `color`, `photo` e `tag`. O proprietário é o agente autenticado.

## Decisões e propostas

| Tema                     | Comportamento implementado                                                                                                                                                                                             |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Primeiro atendimento     | `APP_ALLOW_FIRST_CONTACT=true` permite atender pedidos dirigidos à organização sem contrato anterior. É a proposta do protótipo, ainda sujeita a confirmação. `false` exige vínculo por contrato VIGENTE ou ENCERRADO. |
| Renda                    | Soma de até três vínculos. Dados financeiros de outros clientes ficam disponíveis apenas ao banco vinculado; a empresa recebe dados mínimos e não recebe a renda considerada.                                          |
| Alteração e cancelamento | Somente antes da avaliação. Não há reavaliação automática ou cancelamento após aceite/ativação.                                                                                                                        |
| Exclusão                 | Bloqueada por aluguel ativo/contrato vigente e, provisoriamente, por qualquer histórico. Sem histórico, exclui cliente e vínculos e encerra a sessão.                                                                  |
| Crédito                  | Exige contrato de aluguel formalizado; mantém um crédito por aluguel como hipótese do diagrama. Concessão manual e sem ativação automática do aluguel.                                                                 |
| Repetição de Alugar      | Retorna o aluguel existente. Bloqueio transacional do pedido e unicidade do contrato evitam nova criação.                                                                                                              |
| Categoria                | Campo de Automovel, sem CRUD separado.                                                                                                                                                                                 |

## Testes e modelo

`FluxoApiTest` cobre HTTP com login e CSRF reais, unicidade de login, hash, três vínculos, filtros, isolamento entre contas/organizações, estados do contrato, aluguel idempotente, exclusão e concessão com renda do servidor. Execute `mvn test` com acesso ao Maven Central. O perfil H2 não substitui a validação da migração em PostgreSQL/Supabase.

Os diagramas originais foram preservados em `docs/`. `docs/06-modelos-implementacao-v3.md` registra a versão de implementação e `docs/07-validacao-backend.md` registra o que foi possível verificar nesta entrega.

Referências oficiais: [Spring Boot 4.0](https://docs.spring.io/spring-boot/4.0/system-requirements.html) e [Supabase com Spring Boot](https://supabase.com/docs/guides/getting-started/quickstarts/spring-boot).
