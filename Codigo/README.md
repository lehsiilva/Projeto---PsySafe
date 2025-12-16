# PsySafe

Sistema de gestão de saúde mental e segurança psicossocial no ambiente corporativo.

## Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Stack Tecnológico](#stack-tecnológico)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Guias de Setup](#guias-de-setup)
- [Documentação](#documentação)
- [Funcionalidades](#funcionalidades)
- [Equipe](#equipe)

## Sobre o Projeto

PsySafe é uma plataforma completa para gestão de saúde mental corporativa, oferecendo:

- **Questionários Psicométricos**: Avaliação de riscos psicossociais
- **Dashboard Analítico**: Visualização de métricas e indicadores
- **Sistema de Denúncias**: Canal seguro e anônimo
- **Ações Corretivas**: Planejamento e acompanhamento de intervenções
- **Análise por IA**: Integração com LLM para insights avançados

## Stack Tecnológico

### Backend
- **Linguagem**: Java 17+
- **Framework**: Spark Java (Servidor web leve)
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT (JSON Web Tokens)
- **Build Tool**: Maven
- **Bibliotecas Principais**:
  - Gson (JSON)
  - BCrypt (Criptografia de senhas)
  - PostgreSQL JDBC Driver

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Gerenciamento de Estado**: Context API
- **Roteamento**: React Router
- **Bibliotecas UI**: 
  - Lucide React (Ícones)
  - React DatePicker

## Estrutura do Projeto

```
psysafe/
├── Artefatos/                    # Documentação e artefatos do projeto
│   ├── BD.sql                   # Script do banco de dados
│   ├── DER PsySafe (4).pdf      # Diagrama Entidade-Relacionamento
│   ├── Tabela RF (1).pdf        # Requisitos Funcionais
│   └── README.md
│
├── Codigo/                       # Código-fonte
│   ├── frontend/                # Aplicação React
│   │   ├── src/
│   │   │   ├── components/      # Componentes reutilizáveis
│   │   │   ├── contexts/        # Context API (Auth, etc)
│   │   │   ├── pages/           # Páginas da aplicação
│   │   │   │   └── dashboard/   # Páginas do dashboard
│   │   │   ├── services/        # Chamadas à API
│   │   │   └── styles/          # Estilos globais
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── tsconfig.json
│   │
│   ├── assets/                  # Assets estáticos
│   ├── .env.example             # Exemplo de variáveis de ambiente
│   ├── QUICK-START.md           # Guia rápido de início
│   ├── SETUP.md                 # Setup detalhado
│   └── TEST-DATA.md             # Dados de teste
│
├── src/main/java/com/psysafe/   # Backend Java
│   ├── controller/              # Controladores REST
│   ├── dao/                     # Data Access Objects
│   ├── database/                # Configuração do banco
│   ├── dto/                     # Data Transfer Objects
│   ├── model/                   # Modelos de domínio
│   ├── response/                # Classes de resposta
│   ├── service/                 # Lógica de negócio
│   ├── util/                    # Utilitários (JWT, Gson, etc)
│   └── App.java                 # Aplicação principal
│
├── Divulgacao/                  # Material de apresentação
│   ├── Apresentacao/
│   │   ├── Sprint1- PsySafe.pdf
│   │   ├── Sprint2- PsySafe.pdf
│   │   └── Sprint3- PsySafe.pdf
│   └── Video/
│
├── Documentacao/                # Documentação técnica
├── pom.xml                      # Configuração Maven
└── README.md                    # Este arquivo
```

## Guias de Setup

### Início Rápido (5 minutos)

```bash
# 1. Clone o repositório
git clone <repo-url>
cd psysafe

# 2. Configure o banco de dados
psql -U postgres
CREATE DATABASE psysafe;
\c psysafe
\i Artefatos/BD.sql

# 3. Configure variáveis de ambiente
cp Codigo/.env.example Codigo/.env
# Edite Codigo/.env com suas credenciais

# 4. Inicie o backend (Terminal 1)
mvn clean install
java -jar target/psysafe-1.0-SNAPSHOT-exec.jar

# 5. Inicie o frontend (Terminal 2)
cd Codigo/frontend
npm install
npm run dev

# 6. Acesse http://localhost:5173
```

Para mais detalhes, consulte:
- **[QUICK-START.md](Codigo/QUICK-START.md)** - Guia rápido
- **[SETUP.md](Codigo/SETUP.md)** - Setup completo e detalhado
- **[TEST-DATA.md](Codigo/TEST-DATA.md)** - Dados de teste

## Documentação

### Endpoints da API

#### Autenticação

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Registro**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Nome do Usuário",
  "email": "usuario@exemplo.com",
  "password": "senha123",
  "role": "FUNCIONARIO"
}
```

#### Questionários

**Listar Questionários**
```http
GET /api/questionarios
Authorization: Bearer <token>
```

**Agendar Questionário**
```http
POST /api/questionarios/agendar
Authorization: Bearer <token>
Content-Type: application/json

{
  "questionarioId": 1,
  "dataInicio": "2024-01-15T00:00:00",
  "dataFim": "2024-01-30T23:59:59",
  "departamentos": [1, 2],
  "funcionarios": [1, 2, 3]
}
```

**Responder Questionário**
```http
POST /api/questionarios/{agendamentoId}/responder
Authorization: Bearer <token>
Content-Type: application/json

{
  "respostas": [
    {
      "perguntaId": 1,
      "valor": 3
    }
  ]
}
```

#### Denúncias

**Criar Denúncia**
```http
POST /api/denuncias
Authorization: Bearer <token>
Content-Type: application/json

{
  "titulo": "Título da denúncia",
  "descricao": "Descrição detalhada",
  "categoria": "ASSEDIO",
  "anonimo": true
}
```

**Listar Denúncias**
```http
GET /api/denuncias
Authorization: Bearer <token>
```

#### Estatísticas

**Visão Geral**
```http
GET /api/stats/overview
Authorization: Bearer <token>
```

**Estatísticas Pessoais**
```http
GET /api/stats/personal
Authorization: Bearer <token>
```

**Estatísticas por Departamento**
```http
GET /api/stats/departamentos
Authorization: Bearer <token>
```

#### Empresa

**Obter Informações da Empresa**
```http
GET /api/empresa
Authorization: Bearer <token>
```

**Atualizar Empresa**
```http
PUT /api/empresa
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome": "Nome da Empresa",
  "cnpj": "00.000.000/0000-00",
  "endereco": "Endereço completo"
}
```

#### Ações Corretivas

**Listar Ações**
```http
GET /api/acoes-corretivas
Authorization: Bearer <token>
```

**Criar Ação Corretiva**
```http
POST /api/acoes-corretivas
Authorization: Bearer <token>
Content-Type: application/json

{
  "titulo": "Título da ação",
  "descricao": "Descrição detalhada",
  "prioridade": "ALTA",
  "responsavelId": 1,
  "prazo": "2024-12-31T23:59:59"
}
```

## Funcionalidades

### Para Funcionários
-  Responder questionários psicométricos
-  Visualizar histórico de respostas
-  Fazer denúncias anônimas
-  Acompanhar estatísticas pessoais
-  Atualizar perfil

### Para Gestores
- Agendar questionários para equipes
- Visualizar resultados agregados
- Analisar estatísticas por departamento
- Gerenciar denúncias
- Criar e acompanhar ações corretivas
- Gerar relatórios

### Para Administradores
- Gerenciar empresa e usuários
- Configurar questionários e perguntas
- Visualizar visão geral do sistema
- Análise com suporte de IA (LLM)
- Exportar dados e relatórios

## Segurança

- Autenticação via JWT
- Senhas criptografadas com BCrypt
- Denúncias anônimas protegidas
- Controle de acesso baseado em roles
- Validação de dados em todas as requisições

## Testes

```bash
# Backend (quando implementado)
mvn test

# Frontend
cd Codigo/frontend
npm test
```

## Build para Produção

```bash
# Backend
mvn clean package
# Gera: target/psysafe-1.0-SNAPSHOT-exec.jar

# Frontend
cd Codigo/frontend
npm run build
# Gera: dist/
```

## Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença especificada no arquivo [LICENSE](LICENSE).

## Equipe

Desenvolvido como projeto acadêmico - G05

## Contato

Para dúvidas ou sugestões, entre em contato através das issues do projeto.

---

⭐ Deixe uma estrela se este projeto foi útil para você!
