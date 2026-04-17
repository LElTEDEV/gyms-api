# SOLID API (GymPass Style)

API REST em Node.js para gerenciamento de usuários, academias e check-ins, construída com foco em princípios SOLID, separação de responsabilidades e testabilidade.

## Sobre o projeto

Este projeto implementa uma API de check-in em academias com:

- cadastro e autenticação de usuários;
- autorização por perfil (`MEMBER` e `ADMIN`);
- busca de academias por nome e proximidade geográfica;
- criação e validação de check-ins com regras de negócio;
- testes unitários e e2e.

O código é organizado em camadas (controllers, use-cases, repositories e factories), facilitando manutenção e evolução.

## Tecnologias utilizadas

- Node.js + TypeScript
- Fastify
- Prisma ORM + PostgreSQL
- Zod (validação de entrada e ambiente)
- JWT (`@fastify/jwt`) + Cookie (`@fastify/cookie`)
- Argon2 (hash de senha)
- Vitest + Supertest
- Docker Compose (PostgreSQL local)

## Arquitetura e organização

Estrutura principal:

- `src/http/controller`: camada HTTP (rotas e handlers)
- `src/use-cases`: regras de negócio
- `src/repository`: contratos e implementações de persistência
- `src/factories`: composição das dependências dos casos de uso
- `src/database`: client Prisma
- `prisma`: schema, migrations e ambiente de testes e2e

Fluxo resumido:

1. A rota recebe a requisição e valida dados com Zod.
2. O controller delega para um use-case.
3. O use-case usa um repository (via interface).
4. O resultado é retornado ao controller, que responde ao cliente.

## Pré-requisitos

- Node.js 22+
- npm 10+
- Docker e Docker Compose (opcional, mas recomendado para banco local)

## Variáveis de ambiente

Crie um arquivo `.env` na raiz:

```env
DATABASE_URL="postgresql://postgresql:postgresql@localhost:5432/yourDB?schema=public"
PORT=3333
NODE_ENV=dev
SECRET="sua_chave_secreta_jwt"
```

## Como executar o projeto

### 1) Instalar dependências

```bash
npm install
```

### 2) Subir banco com Docker

```bash
docker compose up -d
```

### 3) Rodar migrations do Prisma

```bash
npx prisma migrate dev
```

### 4) Iniciar ambiente de desenvolvimento

```bash
npm run dev
```

Servidor disponível em `http://localhost:3333`.

## Build e execução em produção

```bash
npm run build
npm start
```

## Testes

- Testes unitários:

```bash
npm run test
```

## Autenticação e autorização

- O login gera:
  - `token` JWT de acesso (expira em 10 minutos);
  - `refreshToken` em cookie HTTP-only (expira em 7 dias).
- Rotas privadas exigem JWT válido (`verifyJWT`).
- Algumas rotas exigem perfil `ADMIN` (`verifyUserRole("ADMIN")`).

## Regras de negócio implementadas

- Usuário não pode se cadastrar com e-mail duplicado.
- Check-in exige proximidade mínima da academia (validação por distância).
- Usuário não pode fazer mais de um check-in na mesma academia no mesmo dia.
- Check-in só pode ser validado dentro de uma janela de tempo definida.
- Apenas usuários `ADMIN` podem cadastrar academias.

## Rotas da API

### Usuários

- `POST /users`  
  Cria novo usuário.
- `POST /sessions`  
  Autentica e retorna token JWT.
- `PATCH /token/refresh`  
  Gera novo token a partir do refresh token (cookie).
- `GET /me` (privada)  
  Retorna perfil do usuário autenticado.

### Academias

- `GET /gyms/search` (privada)  
  Busca academias por texto (`q`) com paginação (`page`).
- `GET /gyms/nearby` (privada)  
  Lista academias próximas por coordenadas (`latitude`, `longitude`).
- `POST /gyms` (privada, `ADMIN`)  
  Cria uma academia.

### Check-ins

- `POST /gyms/:gymId/check-ins` (privada)  
  Cria check-in do usuário em uma academia.
- `GET /check-in/history` (privada)  
  Histórico paginado de check-ins do usuário.
- `GET /check-in/metrics` (privada)  
  Métricas de check-ins do usuário.
- `PATCH /check-in/:checkInId/validate` (privada)  
  Valida check-in existente.
