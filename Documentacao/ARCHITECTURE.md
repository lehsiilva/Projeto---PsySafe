# Arquitetura do Sistema - PsySafe

## Índice

- [Visão Geral](#visão-geral)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitetura de Camadas](#arquitetura-de-camadas)
- [Fluxo de Dados](#fluxo-de-dados)
- [Segurança](#segurança)
- [Infraestrutura Azure](#infraestrutura-azure)
- [Decisões Arquiteturais](#decisões-arquiteturais)

## Visão Geral

O PsySafe é construído seguindo uma **arquitetura em camadas** com separação clara entre frontend e backend, utilizando Azure como provedor de cloud para banco de dados e serviços de IA.

### Princípios Arquiteturais

1. **Separação de Responsabilidades**: Frontend/Backend completamente desacoplados
2. **Stateless Backend**: API REST sem estado, autenticação via JWT
3. **Cloud-First**: Infraestrutura gerenciada no Azure
4. **IA como Serviço**: Integração com Azure OpenAI para features avançadas
5. **Banco Relacional**: PostgreSQL para garantir consistência e integridade

##  Stack Tecnológico

### Backend

```yaml
Framework: Apache Spark Java (Micro-framework web)
Versão Java: 17+
Porta: 4567
Build Tool: Maven
Estrutura: MVC (Model-View-Controller)
```

#### Principais Bibliotecas

| Biblioteca | Versão | Uso |
|------------|--------|-----|
| Spark Java | 2.9.4 | Framework web |
| Gson | 2.10.1 | Serialização JSON |
| PostgreSQL JDBC | 42.6.0 | Driver banco de dados |
| BCrypt | 0.10.2 | Hash de senhas |
| JWT (jjwt) | 0.11.5 | Tokens de autenticação |
| HikariCP | 5.0.1 | Connection pooling |

#### Por Que Spark Java?

-  **Leveza**: JAR executável de ~15MB
-  **Performance**: Alta performance para APIs REST
-  **Simplicidade**: Sintaxe clara e direta
-  **Produção-Ready**: Usado em produção por empresas grandes
-  **Java Puro**: Sem overhead de frameworks pesados

### Frontend

```yaml
Framework: React 18
Linguagem: TypeScript
Build Tool: Vite
Porta: 5173
Styling: Tailwind CSS
Estado: Context API
```

#### Principais Bibliotecas

| Biblioteca | Versão | Uso |
|------------|--------|-----|
| React | 18.2.0 | UI Framework |
| TypeScript | 5.2.2 | Type safety |
| Vite | 5.0.0 | Build tool |
| React Router | 6.20.0 | Roteamento |
| Axios | 1.6.2 | HTTP client |
| Tailwind CSS | 3.3.5 | Styling |
| Lucide React | 0.292.0 | Ícones |
| React DatePicker | - | Seleção de datas |

#### Por Que Vite?

-  **Fast**: Hot Module Replacement instantâneo
-  **Bundle Otimizado**: Tree-shaking eficiente
-  **Zero Config**: Funciona out-of-the-box
-  **TypeScript Nativo**: Suporte completo

### Banco de Dados

```yaml
SGBD: PostgreSQL
Versão: 15+
Cloud: Azure Database for PostgreSQL
Gestão: pgAdmin 4
```

#### Características

- **ACID Compliant**: Transações seguras
- **Views Materializadas**: Para relatórios complexos
- **Triggers**: Alertas automáticos
- **JSON Support**: Armazenamento flexível quando necessário
- **Full-Text Search**: Para busca em denúncias

### Cloud & IA

```yaml
Provider: Microsoft Azure
Database: Azure PostgreSQL
AI: Azure OpenAI Service
Modelo: GPT-5.1 Mini
```

##  Arquitetura de Camadas

### Diagrama Geral

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Pages     │  │ Components  │  │  Services   │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
│          │                │                 │            │
│          └────────────────┴─────────────────┘            │
│                          ▼                                │
│                    HTTP/HTTPS (JWT)                      │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  BACKEND (Spark Java)                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │            Controllers (REST API)                 │  │
│  │  /auth  /questionarios  /denuncias  /stats       │  │
│  └────────────────────┬─────────────────────────────┘  │
│                       ▼                                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Services (Lógica)                    │  │
│  │  AuthService  QuestionarioService  StatsService  │  │
│  └────────────────────┬─────────────────────────────┘  │
│                       ▼                                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │            DAO (Data Access)                      │  │
│  │  AuthDAO  QuestionarioDAO  RespostaDAO           │  │
│  └────────────────────┬─────────────────────────────┘  │
│                       ▼                                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │            Database Connection                    │  │
│  │              (HikariCP Pool)                      │  │
│  └────────────────────┬─────────────────────────────┘  │
└────────────────────────┼─────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│             AZURE POSTGRESQL DATABASE                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Tables     │  │    Views     │  │   Triggers   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼ (Quando necessário)
┌─────────────────────────────────────────────────────────┐
│              AZURE OPENAI SERVICE                        │
│                  (GPT-5.1 Mini)                          │
│          Geração de Ações Corretivas                    │
└─────────────────────────────────────────────────────────┘
```

### Camada Frontend

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (Button, Card, etc)
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── DashboardLayout.tsx
├── pages/              # Páginas da aplicação
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   └── dashboard/      # Páginas do dashboard
│       ├── GestorDashboard.tsx
│       ├── FuncionarioDashboard.tsx
│       ├── Questionarios.tsx
│       └── Estatisticas.tsx
├── contexts/           # Context API
│   └── AuthContext.tsx # Gerenciamento de auth
├── services/           # Chamadas à API
│   ├── apiClient.ts    # Cliente HTTP base
│   ├── authService.ts
│   ├── questionarioService.ts
│   └── denunciaService.ts
└── styles/             # Estilos globais
```

### Camada Backend

```
src/main/java/com/psysafe/
├── App.java                    # Entry point + rotas
├── controller/                 # Controllers REST
│   ├── AuthController.java
│   ├── QuestionarioController.java
│   ├── DenunciaController.java
│   └── StatsController.java
├── service/                    # Lógica de negócio
│   ├── AuthService.java
│   ├── QuestionarioService.java
│   ├── LLMService.java        # Integração Azure OpenAI
│   └── StatsService.java
├── dao/                        # Data Access Objects
│   ├── AuthUserDAO.java
│   ├── QuestionarioDAO.java
│   └── RespostaDAO.java
├── model/                      # Modelos de domínio
│   ├── AuthUser.java
│   ├── Questionario.java
│   └── Resposta.java
├── dto/                        # Data Transfer Objects
│   ├── LoginRequestDTO.java
│   └── QuestionarioDTO.java
├── util/                       # Utilitários
│   ├── JwtUtil.java           # Geração/validação JWT
│   └── GsonUtil.java          # Configuração Gson
└── database/
    └── Database.java          # Connection manager
```

##  Fluxo de Dados

### 1. Fluxo de Autenticação

```
┌─────────┐                           ┌─────────┐
│ Browser │                           │ Backend │
└────┬────┘                           └────┬────┘
     │                                      │
     │  POST /api/auth/login               │
     │  {email, password}                  │
     ├────────────────────────────────────▶│
     │                                      │
     │                              Valida credenciais
     │                              Gera JWT token
     │                                      │
     │  200 OK                              │
     │  {token, user}                       │
     │◀────────────────────────────────────┤
     │                                      │
     │ Armazena token                       │
     │ (localStorage/memory)                │
     │                                      │
     │  GET /api/questionarios              │
     │  Authorization: Bearer <token>      │
     ├────────────────────────────────────▶│
     │                                      │
     │                              Valida JWT
     │                              Busca dados
     │                                      │
     │  200 OK                              │
     │  [questionarios...]                  │
     │◀────────────────────────────────────┤
     │                                      │
```

### 2. Fluxo de Resposta a Questionário

```
Usuario → Frontend → Backend → Database → Azure OpenAI → Alertas
  │          │          │          │            │            │
  │ Acessa   │          │          │            │            │
  │──────────▶          │          │            │            │
  │          │ GET /questionarios  │            │            │
  │          │──────────▶          │            │            │
  │          │          │ SELECT   │            │            │
  │          │          │──────────▶            │            │
  │          │◀─────────┴──────────┘            │            │
  │◀─────────┘          │          │            │            │
  │          │          │          │            │            │
  │ Responde │          │          │            │            │
  │──────────▶ POST     │          │            │            │
  │          │ /respostas│          │            │            │
  │          │──────────▶          │            │            │
  │          │          │ INSERT   │            │            │
  │          │          │──────────▶            │            │
  │          │          │          │ TRIGGER   │            │
  │          │          │          │ calcula   │            │
  │          │          │          │ IRP       │            │
  │          │          │          │───────────┤            │
  │          │          │          │           │            │
  │          │          │          │ Se IRP>75 │            │
  │          │          │          │───────────┼───────────▶│
  │          │          │          │           │ Gera ação  │
  │          │          │          │           │ corretiva  │
  │          │          │          │◀──────────┴────────────┘
  │          │          │          │ INSERT    │
  │          │          │          │ alerta    │
  │          │◀─────────┴──────────┴───────────┘
  │◀─────────┘          │
```

### 3. Fluxo de Geração de Ação Corretiva (IA)

```
Alerta Crítico → Backend → Azure OpenAI → Ação Corretiva
      │             │            │               │
      │ Detectado   │            │               │
      │─────────────▶            │               │
      │             │ Coleta     │               │
      │             │ contexto   │               │
      │             │────────────▶               │
      │             │ Prompt     │               │
      │             │ estruturado│               │
      │             │────────────▶               │
      │             │            │ GPT-5.1 Mini  │
      │             │            │ analisa       │
      │             │◀───────────┤               │
      │             │ Sugestões  │               │
      │             │────────────┴──────────────▶│
      │             │           INSERT           │
      │             │           acao_corretiva   │
```

##  Segurança

### Autenticação JWT

#### Estrutura do Token

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "usuario@empresa.com",
    "role": "gestor",
    "iat": 1700000000,
    "exp": 1700086400
  },
  "signature": "..."
}
```

#### Geração (Backend)

```java
// JwtUtil.java
public static String generateToken(AuthUser user) {
    return Jwts.builder()
        .setSubject(user.getId().toString())
        .claim("email", user.getEmail())
        .claim("role", user.getRole())
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
        .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
        .compact();
}
```

#### Validação (Backend)

```java
public static Claims validateToken(String token) {
    return Jwts.parser()
        .setSigningKey(SECRET_KEY)
        .parseClaimsJws(token)
        .getBody();
}
```

### Controle de Acesso (RBAC)

```
┌─────────────┬───────────┬─────────┬──────────────┐
│   Recurso   │   Admin   │ Gestor  │ Funcionário  │
├─────────────┼───────────┼─────────┼──────────────┤
│ Questionários│ CRUD     │ R       │ R            │
│ Agendamentos │ CRUD     │ CRUD    │ R            │
│ Respostas    │ R        │ R (team)│ CRU (própria)│
│ Estatísticas │ R (all)  │ R (team)│ R (própria)  │
│ Denúncias    │ CRUD     │ RU      │ CR           │
│ Usuários     │ CRUD     │ R       │ -            │
│ Empresa      │ CRUD     │ R       │ -            │
└─────────────┴───────────┴─────────┴──────────────┘

C = Create | R = Read | U = Update | D = Delete
```

### Segurança de Senhas

```java
// BCrypt com salt rounds = 10
String hashedPassword = BCrypt.hashpw(plainPassword, BCrypt.gensalt(10));

// Validação
boolean isValid = BCrypt.checkpw(plainPassword, hashedPassword);
```

### Proteção de Rotas (Frontend)

```typescript
// ProtectedRoute.tsx
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};
```

##  Infraestrutura Azure

### Recursos Utilizados

#### Azure Database for PostgreSQL

```yaml
Tier: Flexible Server
vCores: 2-4 (escala automática)
Storage: 32GB-128GB (escala automática)
Backup: Diário (7 dias retenção)
SSL: Obrigatório
Região: East US ou Brazil South
```

**Benefícios**:
-  Alta disponibilidade (99.99% SLA)
-  Backups automáticos
-  Patches automáticos
-  Escalabilidade vertical sem downtime

#### Azure OpenAI Service

```yaml
Modelo: GPT-5.1 Mini
Deployment: psysafe-gpt-mini
Max Tokens: 2048
Temperature: 0.7
API Version: 2024-08-01
```

**Casos de Uso**:
1. **Ações Corretivas**: Geração de estratégias personalizadas
2. **Análise de Sentimento**: Em denúncias e respostas abertas
3. **Sugestões Preventivas**: Baseado em padrões históricos

### Diagrama de Infraestrutura

```
Internet
   │
   ▼
┌──────────────────────────────────────┐
│      Azure Load Balancer             │
└────────────┬─────────────────────────┘
             │
      ┌──────┴──────┐
      ▼             ▼
┌─────────┐   ┌─────────┐
│  App 1  │   │  App 2  │  (Spark Java)
└────┬────┘   └────┬────┘
     │             │
     └──────┬──────┘
            │
            ▼
┌───────────────────────────────────────┐
│   Azure PostgreSQL Flexible Server   │
│  ┌────────────────────────────────┐  │
│  │      Primary (Read/Write)      │  │
│  └────────────┬───────────────────┘  │
│               │ Replication           │
│  ┌────────────▼───────────────────┐  │
│  │      Replica (Read-Only)       │  │
│  └────────────────────────────────┘  │
└───────────────────────────────────────┘
            │
            │ (Quando necessário)
            ▼
┌───────────────────────────────────────┐
│      Azure OpenAI Service             │
│      Endpoint: GPT-5.1 Mini           │
└───────────────────────────────────────┘
```

##  Decisões Arquiteturais

### 1. Por Que Spark Java em Vez de Spring Boot?

| Critério | Spark Java | Spring Boot |
|----------|------------|-------------|
| **Tamanho JAR** | ~15MB | ~50-100MB |
| **Tempo de startup** | <1s | 5-10s |
| **Memória** | ~100MB | ~300MB+ |
| **Complexidade** | Baixa | Média/Alta |
| **Curva de aprendizado** | Suave | Íngreme |

**Decisão**: Para um projeto acadêmico/MVP, Spark Java oferece simplicidade sem sacrificar funcionalidade.

### 2. Por Que React em Vez de Vue/Angular?

-  **Maior comunidade**: Mais recursos e bibliotecas
-  **TypeScript**: Suporte de primeira classe
-  **Vite**: Build extremamente rápido
-  **Tailwind CSS**: Integração perfeita
-  **Ecosistema maduro**: Soluções prontas para problemas comuns

### 3. Por Que PostgreSQL em Vez de NoSQL?

-  **ACID**: Transações consistentes (crítico para dados de saúde)
-  **Relacional**: Relacionamentos complexos entre entidades
-  **Views**: Relatórios complexos pré-calculados
-  **Triggers**: Alertas automáticos
-  **JSON**: Suporta dados semi-estruturados quando necessário

### 4. Por Que Azure em Vez de AWS/GCP?

-  **Azure OpenAI**: Integração nativa com GPT
-  **Créditos acadêmicos**: Azure for Students
-  **Postgres gerenciado**: Ótimo custo-benefício
-  **Datacenters no Brasil**: Latência baixa

### 5. Context API vs Redux/Zustand?

- **Simplicidade**: Menos boilerplate
- **Nativo**: Sem dependência externa
- **Suficiente**: Para o escopo do projeto
- **Limitado**: Para estados muito complexos

**Decisão**: Context API é suficiente para auth e dados simples. Redux seria overkill.

##  Build e Deploy

### Build Backend

```bash
# Compilar e gerar JAR
mvn clean package

# Executar
java -jar target/psysafe-1.0-SNAPSHOT-exec.jar
```

### Build Frontend

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
# Gera dist/ com assets otimizados
```

### Deploy

```bash
# Backend (Azure App Service)
az webapp deploy \
  --resource-group psysafe-rg \
  --name psysafe-api \
  --src-path target/psysafe-1.0-SNAPSHOT-exec.jar

# Frontend (Azure Static Web Apps)
az staticwebapp create \
  --name psysafe-frontend \
  --resource-group psysafe-rg \
  --source ./frontend
```

## Próximos Passos

Para entender melhor o sistema:

1. **Banco de Dados**: Leia [DATABASE.md](DATABASE.md)
2. **API**: Consulte [API-ENDPOINTS.md](API-ENDPOINTS.md)
3. **Analytics**: Veja [ANALYTICS.md](ANALYTICS.md)
4. **Azure OpenAI**: Leia [AZURE-INTEGRATION.md](AZURE-INTEGRATION.md)

---

**Última Atualização**: Novembro 2025 
**Versão**: 1.0
