# Validação da implementação

04/11/2026.

| Verificação | Resultado local |
| --- | --- |
| Build React + Vite | Passou |
| Testes do frontend | 7 passaram: cliente HTTP, CSRF, erros e permissões da interface |
| Compilação Java 25 de fontes e testes | Passou usando as bibliotecas disponíveis no cache local; ver ressalva abaixo |
| Testes unitários `ModeloTest` | 4 passaram com JUnit e bibliotecas em cache |
| `mvn test` com Spring Boot 4.0.9 | Bloqueado: Maven Central não pôde ser acessado e a versão exigida não estava no cache |
| Testes HTTP `FluxoApiTest` | Escritos; execução completa depende da resolução Maven |
| Banco Supabase real | Não conectado: credenciais do projeto não foram fornecidas/configuradas |
| CI H2 + PostgreSQL + frontend | Configurado localmente em `.github/workflows/validacao.yml`; ainda não executado |
| Publicação no GitHub | Bloqueada: a integração retornou 403 (`Resource not accessible by integration`) ao criar a branch. Arquivos permanecem locais; CI ainda não executado. |

O ambiente contém JDK 25.0.4 e Maven 3.9.16. A primeira tentativa Maven também encontrou o cache padrão sem permissão de escrita. Uma segunda tentativa com cache temporário gravável confirmou o bloqueio de resolução de `repo.maven.apache.org`. O projeto permanece em Spring Boot **4.0.9**, sem substituir a versão exigida por outra disponível no cache.

A compilação alternativa e os testes de modelo são verificações parciais. Não comprovam inicialização do contexto Spring Boot 4.0.9, funcionamento HTTP ou validação do esquema PostgreSQL. O CI executa os testes completos primeiro com H2 e depois com PostgreSQL 17, incluindo `schema.sql` e `ddl-auto=validate`.

`ModeloTest` verifica soma da renda, separação entre aceite e ativação, idempotência da ativação, bloqueio de alterações após avaliação e omissão da renda considerada para empresa/banco alheio. `FluxoApiTest` adiciona dez cenários HTTP com autenticação por sessão e CSRF.

Para concluir a validação no ambiente final: preencher `backend/.env`, aplicar `schema.sql`, executar `mvn test`, iniciar o backend e percorrer o fluxo cliente → empresa → cliente → banco pelo frontend. Os diagramas PNG v2 foram preservados; as diferenças estão registradas no modelo v3.
