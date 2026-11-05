# AlugaCar

Sistema de aluguel de carros do Laboratório 02 de DIAW: **Java 25 + Spring Boot 4.0.9/MVC**, **React + Vite** e **Supabase/PostgreSQL**.

- [Backend: configuração, API e regras](backend/README.md)
- [Frontend: executar e apresentar](frontend/APRESENTACAO.md)
- [Histórias de usuário](docs/05-historias-do-usuario.md)
- [Modelos de implementação v3](docs/06-modelos-implementacao-v3.md)
- [Validação e limitações da entrega](docs/07-validacao-backend.md)

## Desenvolvimento local

Com JDK 25 e Maven, execute em `backend/`:

```powershell
mvn test
mvn spring-boot:run "-Dspring-boot.run.profiles=local"
```

Em outro terminal, execute em `frontend/`:

```powershell
npm install
npm run dev
```

Abra `http://localhost:5173`. O perfil local usa H2 e cria contas de demonstração; o perfil padrão exige as credenciais do Supabase em `backend/.env`. Consulte as instruções do backend para aplicar o SQL e configurar a conexão real.
