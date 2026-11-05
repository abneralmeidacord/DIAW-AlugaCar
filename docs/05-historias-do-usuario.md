## 5. Histórias de usuário

Atualizadas em 04/11/2026. Propostas e pendências estão sinalizadas nos critérios.

### HU01 · Criar conta

Como visitante, quero me cadastrar como cliente, empresa ou banco para acessar o sistema.

**Critérios de aceitação:**

- A tela de acesso oferece cadastro dos três perfis; agentes se cadastram livremente, sem aprovação administrativa.
- Cliente informa dados pessoais e renda; agente informa os dados de sua organização.
- Login é único e a senha é armazenada como hash.

### HU02 · Entrar no sistema

Como cliente ou agente, quero entrar com usuário e senha para acessar as funções do meu perfil.

**Critérios de aceitação:**

- Credenciais válidas liberam as funções do perfil; inválidas mostram erro.
- Acesso protegido exige autenticação; as consultas também verificam titularidade e organização.

### HU03 · Gerenciar cadastro de cliente

Como cliente, quero consultar e atualizar meus dados, incluindo minha renda declarada, e solicitar a exclusão do cadastro.

**Critérios de aceitação:**

- Cadastro contém CPF, nome, endereço e profissão, além de até três vínculos empregatícios com respectivos rendimentos.
- Renda declarada pode ser editada após o cadastro.
- Excluir é bloqueado enquanto houver contrato vigente ou aluguel ativo.
- Tratamento da exclusão quando existe apenas histórico encerrado permanece pendente.

### HU04 · Criar pedido

Como cliente, quero escolher um carro encontrado na pesquisa e solicitar seu aluguel.

**Critérios de aceitação:**

- Pedido referencia um automóvel específico, o cliente autenticado, o período e a organização destinatária.
- Período informado é válido; pedido nasce PENDENTE.
- Proposta para o primeiro atendimento: permitir à organização avaliar o pedido que lhe foi dirigido, mesmo sem contrato anterior.

### HU05 · Consultar pedidos e status

Como cliente ou agente, quero consultar os pedidos aos quais tenho acesso para acompanhar o atendimento.

**Critérios de aceitação:**

- Cliente vê somente seus pedidos.
- Agente vê pedidos e clientes vinculados a contratos vigentes ou anteriores de sua organização; nunca os pedidos de outra organização.
- Acesso a novos pedidos dirigidos à organização é uma exceção proposta, ainda não confirmada.

### HU06 · Modificar pedido

Como cliente ou agente, quero modificar um pedido autorizado para corrigir os dados da solicitação.

**Critérios de aceitação:**

- Alterações exigem permissão por titularidade ou organização e validação dos dados.
- Regras de reavaliação após alteração e pareceres divergentes serão definidas depois; retorno automático a PENDENTE não está decidido.

### HU07 · Cancelar pedido

Como cliente, quero cancelar meu pedido para desistir da solicitação.

**Critérios de aceitação:**

- Cancelamento preserva o registro e sinaliza o pedido como CANCELADO.
- Cancelamento após aceite ou aluguel ativo ainda precisa de definição; não equivale à exclusão do cliente.

### HU08 · Avaliar pedido

Como agente, quero avaliar o pedido recebido para decidir se posso oferecer um contrato de aluguel.

**Critérios de aceitação:**

- Registrar agente responsável, pedido, data, parecer e justificativa.
- Parecer favorável permite a formalização pelo mesmo agente; ainda não representa aceite do cliente.
- Avaliações divergentes e novas análises ficam para definição posterior.

### HU09 · Formalizar contrato de aluguel

Como agente que avaliou o pedido, quero formalizar o contrato para enviá-lo ao cliente.

**Critérios de aceitação:**

- Formalização ocorre após parecer favorável e é feita pelo agente responsável pela avaliação.
- Contrato principal é somente de aluguel; não há fluxo de compra ou transferência de propriedade neste protótipo.
- Contrato fica AGUARDANDO_ACEITE e o cliente pode consultar os termos antes de aceitar.

### HU10 · Consultar renda e conceder crédito de aluguel

Como banco agente, quero consultar a renda declarada do cliente atendido para decidir se concedo crédito de aluguel.

**Critérios de aceitação:**

- Renda vem do cadastro do cliente e pode ser atualizada por ele.
- A consulta respeita o vínculo de atendimento do banco; não há acesso geral à renda de todos os clientes.
- Crédito é opcional, identifica banco e contrato de aluguel; não haverá cálculo automático de aprovação nesta etapa.
- Proposta: guardar rendaConsiderada na concessão para manter a renda usada na decisão. No máximo um crédito por aluguel permanece hipótese.

### HU11 · Pesquisar automóveis

Como cliente, quero procurar carros por categoria ou marca para escolher qual desejo alugar.

**Critérios de aceitação:**

- Pesquisa permite filtrar por categoria e por marca.
- O cliente escolhe um automóvel dos resultados antes de criar o pedido.
- Categoria é um campo simples de Automovel nesta modelagem, sem CRUD separado.

### HU12 · Aceitar contrato

Como cliente, quero consultar e aceitar o contrato que recebi para aprovar a contratação.

**Critérios de aceitação:**

- Somente o cliente do pedido pode aceitar o contrato formalizado para ele.
- Aceite registra data e hora, muda o contrato para ACEITO e o pedido para APROVADO.
- Interpretação do fluxo mínimo: ativação do aluguel acontece na ação Alugar seguinte ao aceite.

### HU13 · Alugar automóvel

Como cliente, quero clicar em Alugar após aceitar o contrato para concluir a locação.

**Critérios de aceitação:**

- A ação exige contrato aceito e pertencente ao cliente autenticado.
- Ativação muda o pedido para ALUGADO e o contrato para VIGENTE.
- Repetir a ação não cria outro contrato ou aluguel para o mesmo pedido.
