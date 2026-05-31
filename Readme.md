# 🚀 TC Blogging Backend

API REST desenvolvida em Node.js + TypeScript utilizando arquitetura em camadas, TypeORM, PostgreSQL e Docker.

---

# 📚 Tecnologias Utilizadas

- Node.js: Runtime JavaScript utilizado no backend para execução de alta performance.
- TypeScript: Superset do JavaScript que adiciona tipagem estática, aumentando a segurança e organização do código.
- Zod: Biblioteca de validação de esquemas para garantir a integridade dos dados recebidos.
- Express: Framework minimalista para criação de APIs e gerenciamento de rotas.
- JWT (JSON Web Token): Utilizado para autenticação e controle de acesso baseado em tokens.
- Bcryptjs: Biblioteca para hash e proteção de senhas de usuários.
- TypeORM: ORM que facilita a comunicação com o banco de dados utilizando objetos em vez de SQL puro.
- PostgreSQL: Banco de dados relacional robusto e confiável.
- Docker: Ferramenta para criação de ambientes isolados e padronizados.
- Docker Compose: Utilizado para orquestrar múltiplos containers de forma simples.

---

# 📁 Estrutura do Projeto

```bash
src/
├── database/
│   ├── migrations/
│   └── typeorm.ts
│
├── enun/
│   └── user-role.enum.ts
│
├── env/
│   └── index.ts
│
├── entities/
│   ├── interfaces/
│   │   ├── post.interface.ts
│   │   └── user.interface.ts
│   ├── post.entity.ts
│   └── user.entity.ts
│
├── erros/
│   ├── autth.ts
│   ├── error.ts
│   ├── not-found.ts
│   └── regra-negocio.ts
│
├── middlewares/
│   ├── error.middleware.ts
│   ├── not-found-router.middleware.ts
│   └── verify-auth.middleware.ts
│
├── modules/
│   ├── auth/
│   │   ├── factories/
│   │   │    └── auth-controller.factory.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.routes.ts
│   │   └── auth.service.ts
│   │
│   ├── post/
│   │   ├── factories/
│   │   │    └── post-controller.factory.ts
│   │   ├── interfaces/
│   │   │    ├── post-repository.interface.ts
│   │   │    └── post.interface.ts
│   │   ├── post.controller.ts
│   │   ├── post.entity.ts
│   │   ├── post.repository.ts
│   │   ├── post.routes.ts
│   │   └── post.service.ts
│   │
│   ├── user/
│   │   ├── factories/
│   │   │    └── user-controller.factory.ts
│   │   ├── interfaces/
│   │   │    ├── user-repository.interface.ts
│   │   │    └── user.interface.ts
│   │   ├── user.controller.ts
│   │   ├── user.entity.ts
│   │   ├── user.repository.ts
│   │   ├── user.routes.ts
│   │   └── user.service.ts
│   │
│   └── router.ts
│
├── types/
│   └── express.d.ts
│
├── app.ts
└── server.ts
```

---

# ⚙️ Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto com a estrutura abaixo:

```env
NODE_ENV=development|production|test

API_PORT=3000

DB_PORT=your_db_port
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

JWT_SECRET=your_secret_key
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

## Executar as migrations

```bash
npm run migration:run
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
| role      | varchar |
| is_active | boolean |

## User Default

Login: admin

Password: 123456

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
GET /api/users
```

### Query Parameters

| Parâmetro | Tipo   | Obrigatório | Padrão | Descrição                                   |
| --------- | ------ | ----------- | ------ | ------------------------------------------- |
| page      | number | Não         | 1      | Número da página.                           |
| limit     | number | Não         | 10     | Quantidade de registros por página.         |
| search    | string | Não         | -      | Texto para filtrar username, name or email. |

---

## Buscar user por ID

```http
GET /api/users/:id
```

---

## Criar user

```http
POST /api/users
```

### Body

```json
{
  "name": "Nome usuário",
  "username": "Alias usuário",
  "password": "Senha usuário",
  "email": "E-mail usuário",
  "role": "admin" | "teacher",
}
```

---

## Atualizar user

```http
PUT /api/users/:id
```

---

## Deletar user

```http
DELETE /api/users/:id
```

---

## Buscar posts

```http
GET /api/posts
```

### Query Parameters

| Parâmetro | Tipo   | Obrigatório | Padrão | Descrição                           |
| --------- | ------ | ----------- | ------ | ----------------------------------- |
| page      | number | Não         | 1      | Número da página.                   |
| limit     | number | Não         | 10     | Quantidade de registros por página. |

---

## Buscar post por palavra chave

```http
GET /api/posts/search
```

### Query Parameters

| Parâmetro | Tipo   | Obrigatório | Padrão | Descrição                                                           |
| --------- | ------ | ----------- | ------ | ------------------------------------------------------------------- |
| page      | number | Não         | 1      | Número da página.                                                   |
| limit     | number | Não         | 10     | Quantidade de registros por página.                                 |
| search    | string | Não         | -      | Texto para filtrar título ou contéudo dos post, username ou e-mail. |

---

## Buscar post por ID

```http
GET /api/posts/:id
```

---

## Criar post

```http
POST /api/posts
```

### Body

```json
{
  "title": "Meu post",
  "content": "Conteúdo do post"
}
```

---

## Atualizar post

```http
PUT /api/posts/:id
```

---

## Deletar post

```http
DELETE /api/posts/:id
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
