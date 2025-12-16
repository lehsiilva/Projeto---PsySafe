# Guia de Início Rápido - PsySafe

Este guia vai te colocar rodando em menos de 10 minutos!

## Pré-requisitos

Certifique-se de ter instalado:

- Java 17 ou superior ([Download](https://adoptium.net/))
- Maven 3.6+ ([Download](https://maven.apache.org/download.cgi))
- Node.js 18+ e npm ([Download](https://nodejs.org/))
- PostgreSQL 13+ ([Download](https://www.postgresql.org/download/))
- Git ([Download](https://git-scm.com/downloads))

### Verificar Instalações

```bash
java -version    # Deve mostrar Java 17+
mvn -version     # Deve mostrar Maven 3.6+
node -version    # Deve mostrar v18+
npm -version     # Deve mostrar 8+
psql --version   # Deve mostrar PostgreSQL 13+
```

## Setup Rápido (5 passos)

### Clone o Repositório

```bash
git clone <url-do-repositorio>
cd psysafe
```

### Configure o Banco de Dados

**Windows (PowerShell):**
```powershell
# Abra o PostgreSQL
psql -U postgres

# No prompt do PostgreSQL:
CREATE DATABASE psysafe;
\c psysafe
\i Artefatos/BD.sql
\q
```

**Linux/Mac:**
```bash
# Abra o PostgreSQL
psql -U postgres

# No prompt do PostgreSQL:
CREATE DATABASE psysafe;
\c psysafe
\i Artefatos/BD.sql
\q
```

### Configure as Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp Codigo/.env.example Codigo/.env

# Edite o arquivo .env com suas credenciais
# Windows: notepad Codigo\.env
# Linux/Mac: nano Codigo/.env
```

**Exemplo de .env:**
```env
# Database
DB_URL=jdbc:postgresql://localhost:5432/psysafe
DB_USER=postgres
DB_PASSWORD=sua_senha_postgres

# JWT
JWT_SECRET=sua_chave_secreta_muito_segura_aqui_123456789

# Server
PORT=4567

# LLM (Opcional - para funcionalidades de IA)
ANTHROPIC_API_KEY=sua_chave_anthropic_opcional
```

### Inicie o Backend

**Abra um terminal e execute:**

```bash
# Compile o projeto
mvn clean install

# Inicie o servidor
java -jar target/psysafe-1.0-SNAPSHOT-exec.jar
```

Você deve ver:
```
[main] INFO org.eclipse.jetty.server.Server - Started @xxxx ms
```

O backend estará rodando em: **http://localhost:4567**

### 5️Inicie o Frontend

**Abra um NOVO terminal e execute:**

```bash
cd Codigo/frontend

# Instale as dependências (primeira vez apenas)
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Você deve ver:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

O frontend estará rodando em: **http://localhost:5173**

## Pronto! Acesse a Aplicação

Abra seu navegador e acesse: **http://localhost:5173**

## Dados de Teste

Se você executou o script `BD.sql`, já existem usuários de teste:

### Gestor
- **Email:** gestor@psysafe.com
- **Senha:** gestor123

### Funcionário
- **Email:** funcionario@psysafe.com
- **Senha:** func123

## Verificação Rápida

### Teste o Backend

```bash
# Teste se o backend está respondendo
curl http://localhost:4567/api/health

# Ou abra no navegador:
# http://localhost:4567/api/health
```

### Teste o Frontend

1. Acesse http://localhost:5173
2. Você deve ver a página de login
3. Faça login com um dos usuários de teste
4. Você deve ser redirecionado para o dashboard

## 🐛 Problemas Comuns

### Backend não inicia

**Erro: "Port 4567 already in use"**
```bash
# Windows: Encontre e mate o processo na porta 4567
netstat -ano | findstr :4567
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:4567 | xargs kill -9
```

**Erro: "Connection to database failed"**
- Verifique se o PostgreSQL está rodando
- Verifique as credenciais no arquivo `.env`
- Verifique se o banco `psysafe` foi criado

### Frontend não inicia

**Erro: "Cannot find module"**
```bash
# Delete node_modules e reinstale
rm -rf node_modules package-lock.json
npm install
```

**Erro: "Port 5173 already in use"**
```bash
# O Vite automaticamente tentará a próxima porta disponível
# Ou você pode especificar outra porta:
npm run dev -- --port 3000
```

### Erro de CORS

Se você ver erros de CORS no console do navegador:

1. Verifique se o backend está rodando em `localhost:4567`
2. Verifique se o frontend está configurado corretamente em `frontend/.env`:

```env
VITE_API_URL=http://localhost:4567
```

3. Reinicie ambos backend e frontend

## Próximos Passos

- [SETUP.md](SETUP.md) - Setup detalhado com explicações
- [TEST-DATA.md](TEST-DATA.md) - Como popular com mais dados de teste
- [README.md](../README.md) - Documentação completa da API
- Explore a aplicação e suas funcionalidades

## Precisa de Ajuda?

1. Consulte o [SETUP.md](SETUP.md) para instruções mais detalhadas
2. Verifique a seção de [Problemas Comuns](#-problemas-comuns)
3. Abra uma issue no repositório

---

 **Dica:** Mantenha dois terminais abertos - um para o backend e outro para o frontend!
