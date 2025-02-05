# Gerenciador de Tarefas - Frontend

## Descrição do Projeto

Este é o frontend do projeto de Gerenciador de Tarefas, uma aplicação web que permite aos usuários gerenciar tarefas com autenticação. O frontend foi desenvolvido com Vue.js e Quasar Framework, focando principalmente em dispositivos móveis.

## 🚀 Funcionalidades

- Login/logout de usuários com autenticação JWT
- Solicitação de redefinição de senha
- Troca de senha através de token
- CRUD completo de tarefas (Criar, Ler, Atualizar, Deletar)
- Interface responsiva e intuitiva
- Gerenciamento de estado global com Pinia Store

## 🛠️ Tecnologias

- Vue.js
- Quasar Framework
- Pinia Store
- Docker
- Axios para requisições HTTP

## 📋 Pré-requisitos

- Docker instalado
- Arquivo .env configurado (ver seção de variáveis de ambiente)

### 🐋 Usando Docker

1. Clone o repositório:

git clone https://github.com/GabrielDornelas/task-manager-frontend.git

cd task-manager-frontend

2. Configure o arquivo .env:

cp .env.example .env

(Edite com seus dados)

3. Execute o projeto pelo docker:

docker-compose up

## 🔐 Variáveis de Ambiente

Veja `.env.example` para todas as variáveis necessárias e suas descrições.

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

Variáveis obrigatórias:

- `VITE_API_URL`: URL da API (backend)
- `VITE_APP_TITLE`: Título da aplicação

## 📦 Estrutura do Projeto

src/<br>
├── components/ # Componentes Vue reutilizáveis<br>
├── layouts/ # Layouts da aplicação<br>
├── pages/ # Páginas da aplicação<br>
├── stores/ # Stores Pinia<br>
└── boot/axios.js # Configuração da API<br>

## Funcionalidades Detalhadas

### Autenticação

- Sistema completo de login/logout

- Armazenamento seguro do token JWT
- Renovação automática do token
- Redirecionamento para login quando token expirar

### Gerenciamento de Tarefas

- Listagem de tarefas com filtros e ordenação
- Criação de novas tarefas
- Edição de tarefas existentes
- Exclusão de tarefas
- Marcação de tarefas como concluídas

### Interface Responsiva

- Layout otimizado para dispositivos móveis
- Suporte a gestos touch
- Interface adaptativa para desktop

## 🖱️ Desenvolvimento

### Pré-requisitos para Desenvolvimento

- Node.js >= 18
- npm ou yarn
- Vue CLI

### Comandos Úteis

Instalar dependências
npm install

Executar em modo desenvolvimento
npm run dev

Construir para produção
npm run build

Executar linter
npm run lint

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
