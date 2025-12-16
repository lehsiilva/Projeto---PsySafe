# PsySafe Frontend

Frontend da aplicação PsySafe - Plataforma de Avaliação de Segurança Psicológica.

## Stack Tecnológico

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State Management**: Context API

## Instalação e Execução

### Instalar Dependências

```bash
npm install
```

### Servidor de Desenvolvimento

```bash
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

### Build para Produção

```bash
npm run build
npm run preview
```

## Configuração de Ambiente

O projeto utiliza variáveis de ambiente para configuração. Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

### Variáveis de Ambiente

- `VITE_API_BASE_URL`: URL base da API backend
  - Desenvolvimento: `http://localhost:4567`
  - Produção: URL do seu servidor backend
  
- `VITE_DEMO_MODE`: Modo de demonstração
  - `true`: Usa dados mock para desenvolvimento/testing
  - `false`: Conecta à API real (padrão)

### Exemplo de .env

```properties
VITE_API_BASE_URL=http://localhost:4567
VITE_DEMO_MODE=false
```

## Conexão com Backend

O frontend se conecta ao backend Java Spring Boot através de:

1. **API Client** (`src/services/apiClient.ts`): Cliente HTTP centralizado com:
   - Gerenciamento automático de tokens JWT
   - Tratamento de erros
   - Redirecionamento automático em caso de sessão expirada

2. **Auth Service** (`src/services/authService.ts`): Serviço de autenticação com:
   - Login/Registro
   - Logout
   - Refresh de token
   - Recuperação de senha

3. **Proxy Vite**: Configurado em `vite.config.ts` para evitar problemas de CORS em desenvolvimento:
   ```typescript
   proxy: {
     '/api': {
       target: 'http://localhost:4765',
       changeOrigin: true,
     }
   }
   ```

## Estrutura do Projeto

```
src/
├── components/        # Componentes React reutilizáveis
├── contexts/          # Context API (AuthContext)
├── pages/             # Páginas da aplicação
│   ├── Login.tsx
│   ├── Register.tsx
│   └── Dashboard.tsx
├── services/          # Serviços de API
│   ├── apiClient.ts   # Cliente HTTP
│   └── authService.ts # Serviço de autenticação
├── App.tsx            # Componente principal
└── main.tsx           # Entry point
```

## Funcionalidades Implementadas

### Autenticação
- ✅ Login de usuário
- ✅ Registro de nova conta
- ✅ Logout
- ✅ Persistência de sessão (localStorage)
- ✅ Proteção de rotas
- ✅ Gerenciamento de tokens JWT

### Em Desenvolvimento
- [ ] Interface de questionários
- [ ] Dashboard com estatísticas
- [ ] Perfil de usuário
- [ ] Sistema de notificações

## Desenvolvimento

### Hot Module Replacement (HMR)

O Vite fornece HMR automático. Mudanças no código aparecem instantaneamente no navegador sem perder o estado da aplicação.

### Verificar Conexão com Backend

1. Certifique-se que o backend está rodando em `http://localhost:4567`
2. Teste o endpoint: `curl http://localhost:8080/api/auth/login`
3. Verifique o console do navegador (F12) para erros de conexão

## Solução de Problemas

### Erro: "Network Error" ou "Failed to fetch"

- Verifique se o backend está rodando
- Verifique se `VITE_API_BASE_URL` está correto no `.env`
- Verifique o console do navegador para detalhes

### Erro: "CORS policy"

- Certifique-se que o backend tem CORS configurado para `http://localhost:5173`
- Verifique `cors.allowed-origins` no `application.properties` do backend

### Sessão expira imediatamente

- Verifique se o token JWT está sendo salvo no localStorage
- Verifique a configuração `jwt.expiration` no backend
- Abra DevTools → Application → Local Storage para inspecionar

## Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa linter (se configurado)

## Requisitos do Backend

O frontend espera que o backend forneça os seguintes endpoints:

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Obter usuário atual

Veja `Codigo/README.md` para documentação completa da API.
