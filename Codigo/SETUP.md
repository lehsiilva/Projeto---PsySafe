# Setup Completo - PsySafe

Guia detalhado para configuração do ambiente de desenvolvimento.

## Índice

- [Requisitos do Sistema](#requisitos-do-sistema)
- [Instalação das Dependências](#instalação-das-dependências)
- [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
- [Configuração do Backend](#configuração-do-backend)
- [Configuração do Frontend](#configuração-do-frontend)
- [Scripts Úteis](#scripts-úteis)
- [Troubleshooting](#troubleshooting)

## Requisitos do Sistema

### Hardware Mínimo
- **CPU:** 2 cores
- **RAM:** 4GB (8GB recomendado)
- **Disco:** 5GB livres

### Software Necessário

| Software | Versão Mínima | Versão Recomendada |
|----------|---------------|-------------------|
| Java JDK | 17 | 21 |
| Maven | 3.6 | 3.9+ |
| Node.js | 18 | 20 LTS |
| npm | 8 | 10+ |
| PostgreSQL | 13 | 15+ |
| Git | 2.30 | Latest |

## 🔧 Instalação das Dependências

### 1. Java JDK

**Windows:**
```bash
# Download: https://adoptium.net/
# Instale e verifique:
java -version
javac -version
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install openjdk-17-jdk
java -version
```

**macOS:**
```bash
brew install openjdk@17
java -version
```

### 2. Maven

**Windows:**
```bash
# Download: https://maven.apache.org/download.cgi
# Extraia e adicione ao PATH
# Verifique:
mvn -version
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt install maven
mvn -version
```

**macOS:**
```bash
brew install maven
mvn -version
```

### 3. Node.js e npm

**Windows/macOS:**
```bash
# Download: https://nodejs.org/
# Instale o LTS e verifique:
node -version
npm -version
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs
node -version
npm -version
```

### 4. PostgreSQL

**Windows:**
```bash
# Download: https://www.postgresql.org/download/windows/
# Durante instalação, defina senha para usuário postgres
# Verifique:
psql --version
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
psql --version
```

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
psql --version
```

## 🗄️ Configuração do Banco de Dados

### Passo 1: Inicie o PostgreSQL

**Windows:**
- O serviço deve iniciar automaticamente
- Ou abra "Serviços" e inicie "postgresql-x64-XX"

**Linux:**
```bash
sudo systemctl start postgresql
sudo systemctl status postgresql
```

**macOS:**
```bash
brew services start postgresql@15
```

### Passo 2: Acesse o PostgreSQL

```bash
# Windows/macOS/Linux
psql -U postgres

# Se pedir senha, use a que você definiu na instalação
```

### Passo 3: Crie o Banco de Dados

No prompt do PostgreSQL (`postgres=#`):

```sql
-- Criar banco de dados
CREATE DATABASE psysafe;

-- Conectar ao banco
\c psysafe

-- Executar script de criação das tabelas
\i Artefatos/BD.sql

-- Verificar se as tabelas foram criadas
\dt

-- Sair
\q
```

### Passo 4: Verificar Estrutura

```bash
psql -U postgres -d psysafe

# No prompt do psql:
\dt              # Lista todas as tabelas
\d usuario       # Descreve a tabela usuario
\d empresa       # Descreve a tabela empresa
```

Você deve ver tabelas como:
- `usuario`
- `empresa`
- `questionario`
- `pergunta`
- `subescala`
- `denuncia`
- `acao_corretiva`
- etc.

## ⚙️ Configuração do Backend

### Passo 1: Clone o Repositório

```bash
git clone <url-do-repositorio>
cd psysafe
```

### Passo 2: Configure Variáveis de Ambiente

Crie o arquivo `.env` na raiz do projeto:

```bash
cp Codigo/.env.example Codigo/.env
```

Edite `Codigo/.env`:

```env
# ===================================
# DATABASE CONFIGURATION
# ===================================
DB_URL=jdbc:postgresql://localhost:5432/psysafe
DB_USER=postgres
DB_PASSWORD=sua_senha_do_postgres

# ===================================
# JWT CONFIGURATION
# ===================================
JWT_SECRET=gere_uma_chave_secreta_aleatoria_muito_longa_e_segura_123456789
JWT_EXPIRATION=86400000

# ===================================
# SERVER CONFIGURATION
# ===================================
PORT=4567
HOST=localhost

# ===================================
# LLM SERVICE (OPCIONAL)
# ===================================
# Para funcionalidades de IA
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
LLM_ENABLED=false

# ===================================
# CORS CONFIGURATION
# ===================================
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# ===================================
# LOGGING
# ===================================
LOG_LEVEL=INFO
```

### Passo 3: Instale Dependências Maven

```bash
mvn clean install
```

Isso irá:
- Baixar todas as dependências
- Compilar o código
- Gerar o JAR executável em `target/`

### Passo 4: Execute o Backend

**Opção 1: Maven (Desenvolvimento)**
```bash
mvn exec:java
```

**Opção 2: JAR Executável (Produção)**
```bash
java -jar target/psysafe-1.0-SNAPSHOT-exec.jar
```

### Passo 5: Verifique se o Backend Está Rodando

```bash
# Teste rápido
curl http://localhost:4567/api/health

# Ou abra no navegador:
# http://localhost:4567/api/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## Configuração do Frontend

### Passo 1: Navegue até o Diretório Frontend

```bash
cd Codigo/frontend
```

### Passo 2: Configure Variáveis de Ambiente

Crie o arquivo `.env`:

```bash
cp .env.example .env
```

Edite `Codigo/frontend/.env`:

```env
# ===================================
# API CONFIGURATION
# ===================================
VITE_API_URL=http://localhost:4567
VITE_API_TIMEOUT=30000

# ===================================
# APP CONFIGURATION
# ===================================
VITE_APP_NAME=PsySafe
VITE_APP_VERSION=1.0.0

# ===================================
# FEATURE FLAGS
# ===================================
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_LLM_FEATURES=false
```

### Passo 3: Instale Dependências

```bash
npm install
```

Isso irá instalar:
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React (ícones)
- E outras dependências...

### Passo 4: Execute o Frontend

```bash
npm run dev
```

O Vite iniciará o servidor em `http://localhost:5173`

### Passo 5: Verifique se o Frontend Está Rodando

Abra seu navegador em: **http://localhost:5173**

Você deve ver a página de login do PsySafe.

## 🛠️ Scripts Úteis

### Backend

```bash
# Compilar sem executar testes
mvn clean install -DskipTests

# Executar testes
mvn test

# Gerar JAR executável
mvn clean package

# Executar com perfil específico
mvn exec:java -Dspring.profiles.active=dev

# Limpar diretórios de build
mvn clean
```

### Frontend

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview

# Lint
npm run lint

# Formatar código
npm run format

# Verificar tipos TypeScript
npm run type-check
```

### Banco de Dados

```bash
# Backup do banco
pg_dump -U postgres psysafe > backup.sql

# Restaurar backup
psql -U postgres psysafe < backup.sql

# Conectar ao banco
psql -U postgres -d psysafe

# Executar script SQL
psql -U postgres -d psysafe -f script.sql

# Listar bancos
psql -U postgres -l
```

## Troubleshooting

### Problema: Backend não conecta ao banco

**Sintoma:** Erro "Connection refused" ou "Authentication failed"

**Solução:**
```bash
# 1. Verifique se o PostgreSQL está rodando
# Windows:
services.msc  # Procure por postgresql

# Linux:
sudo systemctl status postgresql

# macOS:
brew services list

# 2. Teste conexão manual
psql -U postgres -d psysafe

# 3. Verifique credenciais no .env
cat Codigo/.env | grep DB_

# 4. Verifique se o banco existe
psql -U postgres -l | grep psysafe
```

### Problema: Frontend não consegue chamar API

**Sintoma:** Erro de CORS ou "Network Error"

**Solução:**
```bash
# 1. Verifique se o backend está rodando
curl http://localhost:4567/api/health

# 2. Verifique VITE_API_URL no frontend
cat Codigo/frontend/.env | grep VITE_API_URL

# 3. Limpe cache e reinstale
cd Codigo/frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Problema: Porta já em uso

**Backend (4567):**
```bash
# Windows
netstat -ano | findstr :4567
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:4567 | xargs kill -9
```

**Frontend (5173):**
```bash
# Vite tentará a próxima porta automaticamente
# Ou especifique outra:
npm run dev -- --port 3000
```

### Problema: Maven build falha

**Sintoma:** Erros de compilação ou dependências não encontradas

**Solução:**
```bash
# 1. Limpe cache do Maven
mvn clean

# 2. Force update de dependências
mvn clean install -U

# 3. Verifique versão do Java
java -version

# 4. Limpe repositório local (último recurso)
rm -rf ~/.m2/repository
mvn clean install
```

### Problema: npm install falha

**Sintoma:** Erros durante instalação de pacotes

**Solução:**
```bash
# 1. Limpe cache do npm
npm cache clean --force

# 2. Delete node_modules
rm -rf node_modules package-lock.json

# 3. Reinstale
npm install

# 4. Tente com versão específica do Node
nvm install 20
nvm use 20
npm install
```

## Configurações de Segurança

### JWT Secret

Para gerar uma chave segura:

```bash
# Linux/Mac
openssl rand -base64 64

# Windows (PowerShell)
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Max 256 }))

# Ou use um gerador online (com cuidado)
# https://randomkeygen.com/
```

### Senha do Banco de Dados

Nunca use senhas fracas como "postgres" ou "123456" em produção!

Para alterar senha do PostgreSQL:
```sql
ALTER USER postgres WITH PASSWORD 'nova_senha_forte_aqui';
```

## Monitoramento e Logs

### Backend Logs

Os logs aparecem no console onde você executou o backend.

Para salvar em arquivo:
```bash
java -jar target/psysafe-1.0-SNAPSHOT-exec.jar > backend.log 2>&1
```

### Frontend Logs

Abra as DevTools do navegador (F12) e verifique a aba Console.

### Banco de Dados Logs

**Linux:**
```bash
sudo tail -f /var/log/postgresql/postgresql-15-main.log
```

**Windows:**
```
C:\Program Files\PostgreSQL\15\data\log\
```

## Deploy

Para instruções de deploy em produção, consulte:
- [DEPLOY.md](DEPLOY.md) (quando disponível)

## Suporte

Se você encontrar problemas não listados aqui:

1. Verifique a documentação completa no [README.md](../README.md)
2. Consulte issues existentes no repositório
3. Abra uma nova issue com:
   - Descrição do problema
   - Mensagens de erro completas
   - Versões do software (Java, Node, PostgreSQL)
   - Sistema operacional

---

✨ **Próximo Passo:** Siga o [QUICK-START.md](QUICK-START.md) para começar rapidamente!
