# AlugaCar — protótipo visual navegável

Frontend em React + Vite para o Laboratório 02 de DIAW. O protótipo usa dados fictícios no navegador para apresentar as telas e os estados antes da integração real com Spring Boot/MVC e Supabase/PostgreSQL.

## Executar

Requer Node.js 22.12 ou superior. Instale as dependências com `npm install` e execute `npm run dev`. Para gerar a versão de apresentação: `npm run build`.

- `dist/`: versão estática para hospedagem.
- `AlugaCar_Prototipo.html`: versão portátil com React, JavaScript e CSS incorporados; abra no Chrome ou Edge. Fotografias e fontes externas precisam de internet. Imagens têm alternativa local se não carregarem.
- `npm test`: verifica o fluxo do contrato, acessos por organização, crédito e bloqueio de exclusão.

## Organização do código

| Pasta ou arquivo | Responsabilidade |
| --- | --- |
| `public/images/` | Imagens locais, incluindo o carro usado quando uma foto não carrega |
| `public/fonts/` | Pasta reservada para fontes locais; as fontes atuais continuam no Google Fonts |
| `src/data/` | Carros, dados da demonstração, formatação, armazenamento, autenticação e regras dos pedidos |
| `src/pages/` | Telas com seus arquivos JSX e CSS específicos |
| `src/components/` | Componentes reutilizados e modais, cada um em sua própria pasta |
| `src/styles/global.css` | Cores, tipografia, botões, formulários e estilos compartilhados |
| `src/App.jsx` | Navegação, estado compartilhado e ações que atualizam os dados |

Por exemplo, `src/components/CarCard/` contém `CarCard.jsx` e `CarCard.css`.
O arquivo `.jsx` é JavaScript com a marcação do React. O mesmo padrão é usado nas páginas,
como `src/pages/CatalogPage/CatalogPage.jsx` e `CatalogPage.css`.

Para alterar algo usado em várias telas, edite `global.css` ou o componente responsável.
Para diferenciar apenas uma tela, edite seu CSS. Os estilos compartilhados não precisam
ser copiados para cada página. Login e cadastro compartilham `AuthPage`; as áreas de
empresa e banco compartilham `WorkspacePage`.

## Apresentar o fluxo

1. Na página inicial, clique em **Explorar demo** e selecione **Sou cliente**.
2. Pesquise por marca/categoria, escolha um carro e envie o pedido.
3. Troque para **Sou uma empresa**. Abra o pedido, registre parecer favorável e formalize o contrato.
4. Volte a **Sou cliente**, abra o contrato, marque o aceite e confirme.
5. O pedido fica **APROVADO**, mas o aluguel ainda não está ativo. Clique em **Alugar agora** para torná-lo **ALUGADO**, com contrato **VIGENTE**.
6. Em **Meu cadastro**, edite dados e até três vínculos. O total da renda é calculado pela soma dos rendimentos.
7. Tente excluir um cliente com aluguel ativo: a ação fica bloqueada.
8. Para conhecer o crédito, selecione a opção ao criar o pedido. No perfil **Sou um banco**, consulte a renda e conceda o valor manualmente. A renda considerada fica registrada; o crédito não ativa o aluguel.

Os acessos demonstrativos são `cliente@alugacar.demo`, `empresa@alugacar.demo` e `banco@alugacar.demo`, todos com senha `demo123`. Também é possível cadastrar um perfil fictício. Credenciais de novos cadastros são derivadas com PBKDF2 para esta simulação; não equivalem à autenticação de produção. Não use dados pessoais nem senhas reais.

## Alinhamento com a modelagem

| Modelagem                         | Telas e comportamento                                                                                      |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Usuario, Cliente, Empresa e Banco | Login e cadastro com seleção de perfil; áreas próprias                                                     |
| VinculoEmpregaticio `0..3`        | Cadastro e edição de rendimentos; soma da renda declarada                                                  |
| Automovel                         | Catálogo, filtros de categoria/marca e detalhes do veículo                                                 |
| PedidoAluguel                     | Criar, consultar, editar período antes da avaliação e cancelar pedido não avaliado                         |
| Agente / organização destinatária | Lista restrita aos pedidos dirigidos à organização                                                         |
| AvaliacaoFinanceira               | Parecer e justificativa, com registro do agente responsável                                                |
| ContratoAluguel                   | Mesmo agente avalia e formaliza; cliente lê, aceita e depois ativa o aluguel                               |
| ContratoCredito                   | Banco recebe solicitação vinculada e registra concessão e renda considerada                                |
| Pacotes                           | `src/data/`, `src/pages/`, `src/components/` e `src/styles/`; futura API substitui as operações locais |

## Decisões de demonstração e pendências

- Acesso ao primeiro pedido de um cliente novo usa a proposta de atender pedidos dirigidos à organização, mesmo sem contrato anterior. A permissão permanece uma proposta para validação.
- A soma dos vínculos como renda total segue a proposta da modelagem; não é um motor de análise de crédito.
- No protótipo, o pedido encaminha uma solicitação opcional ao Banco Horizonte. A relação de uma empresa com um banco concedente continua uma simplificação a revisar no modelo.
- Após avaliação, edição/reanálise fica indisponível. Pareceres divergentes serão definidos depois.
- Cancelamento após aceite/início do aluguel e exclusão de cadastro com histórico encerrado permanecem pendentes; não são executados pela demonstração.
- Não há compra, transferência de propriedade, cobrança ou transação financeira real.
- Controle de acesso no frontend demonstra a experiência, mas não constitui segurança de produção. A futura API Spring precisa aplicar autorização, autenticação e persistência no servidor.

## Direção visual

As referências fornecidas orientam os cards arredondados, o contraste de verde escuro com fundo claro, a fotografia ampla, o destaque azul e a hierarquia tipográfica. A versão é responsiva e tem formulários identificados, foco visível, diálogos com Escape e navegação por teclado.

Fotografias ilustrativas: Porsche/Autoweek (hero), Enterprise (Porsche), Alfaris (Mercedes), Hertz MiniLease (Volvo), ImgBin (BMW). As URLs estão em `src/data/cars.js`. Não há vínculo comercial com essas marcas; todos os preços são fictícios.
