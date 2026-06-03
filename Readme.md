# 🚀 TC Blogging Backend

API REST desenvolvida em Node.js + TypeScript, com Express, TypeORM e PostgreSQL.

## Tecnologias

- Node.js
- TypeScript
- Express
- TypeORM
- PostgreSQL
- Zod
- JWT
- Bcryptjs
- Docker e Docker Compose

## Estrutura do projeto

```bash
src/
├── database/
│   ├── migrations/
│   └── typeorm.ts
├── enum/
│   └── user-role.enum.ts
├── env/
│   └── index.ts
├── erros/
│   ├── autth.ts
│   ├── error.ts
│   ├── not-found.ts
│   └── regra-negocio.ts
├── middlewares/
│   ├── error.middleware.ts
│   ├── not-found-router.middleware.ts
│   └── verify-auth.middleware.ts
├── modules/
│   ├── auth/
│   ├── post/
│   ├── user/
│   └── router.ts
├── types/
│   └── express.d.ts
├── app.ts
└── server.ts
```

## Configuracao de ambiente

Crie o arquivo .env na raiz com base em .env.example:

```env
NODE_ENV=development

API_PORT=3000

DB_PORT=5432
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=tc_blog

JWT_SECRET=your_secret_key
```

Observacoes:

- Para execucao com Docker, mantenha DB_PORT=5432 para compatibilidade com o container do Postgres.
- A aplicacao valida as variaveis em tempo de inicializacao.

## Como executar

### Ambiente local

1. Instalar dependencias:

```bash
npm install
```

2. Compilar o projeto (necessario antes das migrations):

```bash
npm run build
```

3. Rodar migrations:

```bash
npm run migration:run
```

4. Subir a API em desenvolvimento:

```bash
npm run dev
```

### Docker

```bash
docker compose up --build
```

O container da API executa migrations automaticamente na inicializacao.

## Scripts

- npm run dev: sobe API com watch.
- npm run build: compila TypeScript para dist/.
- npm run start: inicia API compilada.
- npm run migration:run: executa migrations usando dist/database/typeorm.js.
- npm run docker:start: aguarda o banco, executa migration e sobe a API.

## Banco de dados

As tabelas sao criadas pela migration CreateTables1779748545908.

Usuario padrao criado na migration:

- login: admin
- senha: 123456
- role: admin

## Regras de autenticacao e perfil

- JWT no cabecalho Authorization no formato Bearer TOKEN.
- Perfis disponiveis: admin e teacher.
- admin acessa todas as rotas protegidas.
- teacher acessa rotas protegidas de post.

## Endpoints

Base URL local: http://localhost:3000

### Health check

```http
GET /health
```

### Autenticacao

```http
POST /api/auth/login
```

Body:

```json
{
  "login": "admin",
  "password": "123456"
}
```

Observacao: o campo login utiliza o username do usuario.

### Usuarios

- POST /api/users (publico) - cria usuario.
- GET /api/users?page=1&limit=10 (admin) - lista usuarios.
- GET /api/users/me (autenticado) - retorna usuario logado.
- PUT /api/users/me (autenticado) - atualiza usuario logado.
- DELETE /api/users/me (autenticado) - remove usuario logado.

Body de criacao de usuario (POST /api/users):

```json
{
  "name": "Nome usuario",
  "username": "alias",
  "password": "senha",
  "email": "email@dominio.com",
  "role": "admin"
}
```

Body de atualizacao (PUT /api/users/me):

```json
{
  "name": "Novo nome",
  "password": "nova_senha",
  "isActive": true
}
```

### Posts

- GET /api/posts?page=1&limit=10 (publico) - lista posts.
- GET /api/posts/search?page=1&limit=10&search=texto (publico) - busca por titulo/conteudo.
- GET /api/posts/:id (publico) - busca post por id.
- POST /api/posts (teacher/admin) - cria post.
- PUT /api/posts/:id (teacher/admin) - atualiza post.
- DELETE /api/posts/:id (teacher/admin) - remove post.

Body de criacao de post:

```json
{
  "title": "Meu post",
  "content": "Conteudo do post"
}
```

Body de atualizacao de post:

```json
{
  "title": "Novo titulo",
  "content": "Conteudo atualizado",
  "isActive": true
}
```

## Formato de resposta

As respostas seguem o padrao abaixo (o campo data pode nao existir em rotas de delete):

```json
{
  "message": "descricao",
  "data": {}
}
```

## Autores

- RM371918 - Carlos Eduardo Mendonça da Silva
- RM371258 - Douglas Lacerda da Conceíção
- RM372690 - Henrique Paulucci Vieira
- RM371313 - Paulo Henrique Lopes
- RM372340 - Wesley Freitas de Lima
