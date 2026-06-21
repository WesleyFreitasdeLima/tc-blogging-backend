# 🚀 TC Blogging Backend

API REST para um sistema de blog, desenvolvida como parte do Tech Challenge da FIAP. Construída com Node.js, Express, TypeScript e PostgreSQL, seguindo princípios de arquitetura limpa e boas práticas de desenvolvimento.

## Arquitetura do Sistema

A aplicação adota uma arquitetura em camadas, distribuindo as responsabilidades em módulos como usuários, posts e autenticação. Utiliza TypeORM como ORM para a interação com o banco de dados PostgreSQL e Zod para a validação de esquemas e variáveis de ambiente. A autenticação é baseada em JWT (JSON Web Token). O ciclo de vida do software é automatizado por meio de uma esteira de integração e entrega contínuas (CI/CD).

### Tecnologias Principais

- **Node.js**: Ambiente de execução JavaScript.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
- **Express**: Framework web para criação da API REST.
- **TypeORM**: ORM para interação com o banco de dados.
- **PostgreSQL**: Banco de dados relacional.
- **Zod**: Biblioteca para validação de esquemas e dados.
- **JWT (jsonwebtoken)**: Para geração e validação de tokens de autenticação.
- **Bcryptjs**: Para hashing de senhas.
- **Docker e Docker Compose**: Para containerização da aplicação e do banco de dados.
- **GitHub Actions**: Automação da pipeline de CI/CD (Testes, Build e Deploy).
- **Jest**: Framework de testes utilizado para testes unitários e de integração.
- **Supertest**: Ferramenta para simulação de requisições HTTP e validação dos endpoints da API durante os testes de integração.
- **Docker Hub**: Registro para armazenamento e versionamento das imagens Docker.
- **Render**: Plataforma de nuvem utilizada para a hospedagem da aplicação e banco de dados no ambiente de produção.

### Estrutura do Projeto

A estrutura de pastas do projeto é organizada para promover a modularidade e a separação de conceitos:

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

### Estrutura de Testes

A estrutura de testes do projeto é organizada por módulos da aplicação, facilitando a manutenção, reutilização de dados de teste e cobertura dos principais fluxos da API.

```bash
tests/
├── _factories/
│   ├── post.factory.ts
│   └── user.factory.ts
├── _helpers/
├── auth/
│   ├── login.test.ts
├── posts/
├── users/
├── setup.ts
├── cleanup.ts
```

## Configuração de Ambiente

1.  Crie um arquivo `.env` na raiz do projeto.
2.  Copie o conteúdo abaixo e preencha com suas configurações.

```env
# Ambiente (development, production, test)
NODE_ENV=development

# Porta da API
API_PORT=3000

# Configurações do Banco de Dados
DB_PORT=5432
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=tc_blog

# Chave secreta para JWT (use um valor longo e aleatório)
JWT_SECRET=sua_chave_secreta_jwt_aqui

# Credenciais do usuário administrador inicial
ADMIN_USER_NAME=Administrador
ADMIN_USER_USERNAME=admin
ADMIN_USER_EMAIL=teste@teste.com
ADMIN_USER_PASSWORD=sua_senha_forte_aqui
```

> **⚠️ Aviso de Segurança:**
>
> - Nunca utilize senhas fracas ou dados padrão em ambiente de produção.
> - A variável `JWT_SECRET` deve ser uma string longa e complexa, armazenada de forma segura.
> - As credenciais do administrador (`ADMIN_USER_*`) são usadas na primeira migração para criar o usuário inicial. Garanta que sejam seguras.

## Como Executar

### Ambiente de Desenvolvimento (Local)

1.  **Instalar dependências:**
    ```bash
    npm install
    ```
2.  **Compilar o projeto (necessário antes de rodar as migrations):**
    ```bash
    npm run build
    ```
3.  **Executar as migrations:**
    ```bash
    npm run migration:run
    ```
4.  **Iniciar a API em modo de desenvolvimento:**
    ```bash
    npm run start:dev
    ```

### Com Docker

O Docker Compose irá construir a imagem da aplicação, subir o container do PostgreSQL e executar as migrações automaticamente na inicialização.

```bash
docker compose up --build
```

## Scripts Disponíveis

- `npm run start:dev`: Inicia a API em modo de desenvolvimento com 'watch'.
- `npm run build`: Compila o código TypeScript para JavaScript no diretório `dist/`.
- `npm run start:prod`: Executa as migrações do banco de dados e inicia a aplicação a partir do código compilado (para produção).
- `npm run migration:run`: Executa as migrações do banco de dados.
- `npm run test`: Executa os testes unitários e de integração.
- `npm run test:coverage`: Gera o relatório de cobertura dos testes.

## Uso da API (Endpoints)

A URL base para acesso local é `http://localhost:3000`.

### Autenticação e Autorização

- O token JWT deve ser enviado no cabeçalho `Authorization` no formato `Bearer TOKEN`.
- **Perfis de usuário:** `admin` e `teacher`.
- O perfil `admin` tem acesso a todas as rotas protegidas.
- O perfil `teacher` pode criar, editar e remover `posts`.

### Endpoints Públicos

- `GET /api/posts/:id`: Health check da API.
- `POST /api/users`: Cria um novo usuário.
- `GET /api/posts`: Lista posts com paginação.
- `GET /api/posts/search`: Busca posts por título ou conteúdo.
- `GET /api/posts/:id`: Busca um post pelo seu ID.

### Endpoints Protegidos

- `POST /api/auth/login`: Realiza o login e retorna um `accessToken`.
- `GET /api/users`: (Admin) Lista todos os usuários com paginação.
- `GET /api/users/me`: (Autenticado) Retorna os dados do usuário logado.
- `PUT /api/users/me`: (Autenticado) Atualiza os dados do usuário logado.
- `DELETE /api/users/me`: (Autenticado) Remove o usuário logado.
- `POST /api/posts`: (Admin/Teacher) Cria um novo post.
- `PUT /api/posts/:id`: (Admin/Teacher) Atualiza um post existente.
- `DELETE /api/posts/:id`: (Admin/Teacher) Remove um post existente.

### Exemplos de Body (JSON)

**Login (`POST /api/auth/login`)**
```json
{
  "login": "admin",
  "password": "your_strong_password"
}
```

**Criação de Usuário (`POST /api/users`)**
```json
{
  "name": "Nome do Usuário",
  "username": "username",
  "password": "senha_forte",
  "email": "email@dominio.com",
  "role": "teacher"
}
```

**Criação de Post (`POST /api/posts`)**
```json
{
  "title": "Título do Meu Post",
  "content": "Conteúdo detalhado do post."
}
```

## CI/CD (Integração e Entrega Contínua)

O processo de CI/CD deste projeto utiliza o GitHub Actions e é composto pelas seguintes etapas:

1. **Checkout**: Clona o repositório.
2. **Setup**: Configura o ambiente Node.js e instala as dependências.
3. **Test**: Executa os testes automatizados.
4. **Build & Push**: Constrói a imagem Docker da aplicação e a envia para o Docker Hub (executado apenas na branch master).
5. **Deploy**: Aciona o webhook do Render para atualizar a aplicação com a imagem mais recente (executado apenas na branch master).

## Relato de Experiências e Desafios

Durante o desenvolvimento deste projeto, a equipe enfrentou e superou diversos desafios técnicos que contribuíram para o amadurecimento da solução:
*   **Divisão de tarefas**: Para organizar a divisão de tarefas e as implementações do projeto de forma profissional, adotamos o controle de versão com Git e a gestão de issues no GitHub. Isso garantiu que a adição de novas features e as correções ocorressem de maneira estruturada, incremental e sempre com a revisão de toda a equipe.

*   **Configuração de Módulos ES com TypeScript e TypeORM**: A transição para ES Modules no Node.js apresentou desafios de compatibilidade, especialmente com bibliotecas como o TypeORM que dependem de decorators e `reflect-metadata`. Foi necessário um ajuste fino no `tsconfig.json` e na forma como as importações são resolvidas (utilizando a extensão `.js` nos imports relativos) para garantir o funcionamento correto.

*   **Validação e Segurança de Variáveis de Ambiente**: Para garantir a robustez e a segurança da aplicação desde a inicialização, foi implementada a validação de variáveis de ambiente com Zod. Isso previne erros em tempo de execução causados por configurações ausentes ou inválidas e força a definição de segredos importantes.

*   **Criação de Usuário Administrador via Migrations**: A criação do usuário administrador inicial foi automatizada na primeira migração do TypeORM. Para evitar credenciais fixas no código-fonte (hardcoding), a configuração deste usuário foi externalizada para variáveis de ambiente, permitindo uma configuração segura e flexível para cada ambiente de implantação.

*   **Estruturação de Middlewares e Tratamento de Erros**: Foi desenvolvida uma arquitetura de middlewares para autenticação, autorização e um sistema centralizado para tratamento de erros. A criação de classes de erro customizadas (`AppError`, `AppAuthNegate`, etc.) permitiu a captura e formatação de respostas de erro de forma padronizada e consistente em toda a API.

## Autores

- **RM371918** - Carlos Eduardo Mendonça da Silva
- **RM371258** - Douglas Lacerda da Conceíção
- **RM372690** - Henrique Paulucci Vieira
- **RM371313** - Paulo Henrique Lopes
- **RM372340** - Wesley Freitas de Lima
