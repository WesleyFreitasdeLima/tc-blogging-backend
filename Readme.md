# 🚀 TC Blogging Backend

API REST desenvolvida em Node.js + TypeScript utilizando arquitetura em camadas, TypeORM, PostgreSQL e Docker.

---

# 📚 Tecnologias Utilizadas

- Node.js
- TypeScript
- Zod
- Express
- TypeORM
- PostgreSQL
- Docker
- Docker Compose

---

# 📁 Estrutura do Projeto

```bash
src/
├── database/
│   ├── migrations/
│   └── typeorm.ts
│
├── entities/
│   ├── interfaces/
│   │   ├── post.interface.ts
│   │   └── user.interface.ts
│   ├── post.entity.ts
│   └── user.entity.ts
│
├── env/
│   └── index.ts
│
├── erros/
│   ├── error.ts
│   └── not-found.ts
│
├── http/
│   ├── controllers/
│   │   ├── post/
│   │   │   ├── factories/
│   │   │   │    └── post-controller.factory.ts
│   │   │   ├── post.controller.ts
│   │   │   └── post.routes.ts
│   │   │
│   │   └── user/
│   │       ├── factories/
│   │       │   └── user-controller.factory.ts
│   │       ├── user.controller.ts
│   │       └── user.routes.ts
│   └── middlewares/
│       └── error.middleware.ts
│
├── repositories/
│   ├── interfaces/
│   │   ├── post-repository.interface.ts
│   │   └── user-repository.interface.ts
│   ├── post.repository.ts
│   └── user.repository.ts
│
├── services/
│   ├── post.service.ts
│   └── user.service.ts
│
├── app.ts
└── server.ts
```

---

# ⚙️ Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto com a estrutura abaixo:

```env
NODE_ENV=development

API_PORT=3000

DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=bd_tc_blogging
```

Ou faça uma cópia do arquivo `.env.example` na raiz do projeto com o nome `.env` e altera os dados conforme a necessidade.

---

# 🐳 Executando com Docker

## Subir containers

```bash
docker compose up --build
```

---

# ▶️ Scripts Disponíveis

## Ambiente de desenvolvimento

```bash
npm run dev
```

## Build da aplicação

```bash
npm run build
```

## Executar aplicação compilada

```bash
npm run start
```

## Inicialização Docker

```bash
npm run docker:start
```

---

# 🗄️ Banco de Dados

O projeto utiliza PostgreSQL com TypeORM.

As tabelas são criadas através de migrations.

---

# 📌 Entidade User

| Campo     | Tipo    |
| --------- | ------- |
| id        | integer |
| name      | varchar |
| username  | varchar |
| password  | varchar |
| email     | varchar |
| is_active | boolean |

# 📌 Entidade Post

| Campo      | Tipo      |
| ---------- | --------- |
| id         | integer   |
| title      | varchar   |
| content    | text      |
| created_at | timestamp |
| created_by | integer   |
| updated_at | timestamp |
| updated_by | integer   |
| is_active  | boolean   |

---

# 📡 Endpoints

## Buscar users

```http
GET /users
```

---

## Buscar user por ID

```http
GET /users/:id
```

---

## Criar user

```http
POST /users
```

### Body

```json
{
  "name": "Nome usuário",
  "username": "Alias usuário",
  "password": "Senha usuário",
  "email": "E-mail usuário"
}
```

---

## Atualizar user

```http
PUT /users/:id
```

---

## Deletar user

```http
DELETE /users/:id
```

---

## Buscar posts

```http
GET /posts
```

---

## Buscar post por ID

```http
GET /posts/:id
```

---

## Criar post

```http
POST /posts
```

### Body

```json
{
  "title": "Meu post",
  "content": "Conteúdo do post",
  "createdBy": 1
}
```

---

## Atualizar post

```http
PUT /posts/:id
```

---

## Deletar post

```http
DELETE /posts/:id
```

---

# ✅ Funcionalidades

- CRUD de Users e Posts
- Integração com PostgreSQL
- Migrations automáticas
- Dockerização da aplicação
- TypeORM
- Arquitetura em camadas
- TypeScript tipado

---

# 👨‍💻 Autor

- RM371918 - Carlos Eduardo Mendonça da Silva
- RM371258 - Douglas Lacerda da Conceíção
- RM372690 - Henrique Paulucci Vieira
- RM371313 - Paulo Henrique Lopes
- RM372340 - Wesley Freitas de Lima
