#  API Endpoints - PsySafe

##  Índice

- [Informações Gerais](#informações-gerais)
- [Autenticação](#autenticação)
- [Questionários](#questionários)
- [Respostas](#respostas)
- [Estatísticas](#estatísticas)
- [Denúncias](#denúncias)
- [Alertas](#alertas)
- [Ações Corretivas](#ações-corretivas)
- [Empresa](#empresa)
- [Códigos de Status](#códigos-de-status)

##  Informações Gerais

### Base URL

```
Desenvolvimento: http://localhost:4567
Produção: https://api.psysafe.com
```

### Formato de Dados

- **Request**: `application/json`
- **Response**: `application/json`
- **Encoding**: UTF-8

### Autenticação

Todas as rotas protegidas requerem header:
```
Authorization: Bearer <jwt_token>
```

### Rate Limiting

- **Limite**: 100 requisições/minuto
- **Header de Resposta**: `X-RateLimit-Remaining`

---

##  Autenticação

### POST `/api/auth/login`
Autenticação de usuário e geração de token JWT.

**Request Body**:
```json
{
  "email": "usuario@empresa.com",
  "password": "senha123"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "email": "usuario@empresa.com",
    "role": "gestor"
  }
}
```

**Erros**:
- `400`: Campos obrigatórios ausentes
- `401`: Credenciais inválidas
- `403`: Usuário inativo

---

### POST `/api/auth/register`
Registro de novo usuário.

**Request Body**:
```json
{
  "name": "Maria Santos",
  "email": "maria@empresa.com",
  "password": "senha123",
  "role": "funcionario",
  "departamento": "RH",
  "cargo": "Analista"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "user": {
    "id": "uuid-gerado",
    "name": "Maria Santos",
    "email": "maria@empresa.com",
    "role": "funcionario"
  }
}
```

**Erros**:
- `400`: Dados inválidos
- `409`: Email já cadastrado

---

### GET `/api/auth/me`
Obter informações do usuário autenticado.

**Headers**: `Authorization: Bearer <token>`

**Response** (200 OK):
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@empresa.com",
    "role": "gestor",
    "departamento": "TI",
    "equipe": "Dev Team",
    "cargo": "Gerente de TI",
    "data_admissao": "2023-01-15",
    "ultimo_login": "2024-11-27T10:30:00Z"
  }
}
```

---

### POST `/api/auth/logout`
Logout do usuário (invalida token).

**Headers**: `Authorization: Bearer <token>`

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

---

### PUT `/api/auth/profile`
Atualizar perfil do usuário.

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "name": "João Silva Junior",
  "telefone": "(11) 98765-4321",
  "cargo": "Gerente Senior"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Perfil atualizado com sucesso"
}
```

---

## 📋 Questionários

### GET `/api/questionarios`
Listar questionários ativos.

**Headers**: `Authorization: Bearer <token>`

**Response** (200 OK):
```json
{
  "success": true,
  "questionarios": [
    {
      "id": 1,
      "titulo": "Avaliação Psicossocial Q4 2024",
      "descricao": "Questionário trimestral de avaliação...",
      "versao": "1.0",
      "tempo_estimado": "15 minutos",
      "total_perguntas": 42,
      "total_subescalas": 7,
      "data_criacao": "2024-10-01T00:00:00Z"
    }
  ]
}
```

---

### GET `/api/questionarios/{id}`
Detalhes de um questionário específico com perguntas.

**Headers**: `Authorization: Bearer <token>`

**Response** (200 OK):
```json
{
  "success": true,
  "questionario": {
    "id": 1,
    "titulo": "Avaliação Psicossocial Q4 2024",
    "descricao": "Questionário completo...",
    "versao": "1.0",
    "tempo_estimado": "15 minutos",
    "subescalas": [
      {
        "id": 1,
        "nome": "Assédio Moral",
        "descricao": "Avalia situações de assédio no ambiente de trabalho",
        "ordem": 1,
        "perguntas": [
          {
            "id": 1,
            "numero": 1,
            "conteudo": "Você já se sentiu intimidado no trabalho?",
            "tipo_resposta": {
              "id": 1,
              "nome": "Escala Likert 1-5",
              "opcao1": "Nunca",
              "opcao2": "Raramente",
              "opcao3": "Às vezes",
              "opcao4": "Frequentemente",
              "opcao5": "Sempre"
            }
          }
        ]
      }
    ]
  }
}
```

---

### POST `/api/questionarios/agendar`
Agendar questionário para aplicação.

**Headers**: `Authorization: Bearer <token>`

**Permissão**: Apenas `gestor` ou `admin`

**Request Body**:
```json
{
  "questionario_id": 1,
  "titulo": "Avaliação Q4 - Departamento TI",
  "descricao": "Avaliação trimestral focada em...",
  "data_inicio": "2024-12-01T00:00:00Z",
  "data_fim": "2024-12-15T23:59:59Z",
  "departamentos": ["TI", "DevOps"],
  "enviar_notificacao": true,
  "enviar_lembrete": true,
  "lembrete_dias": 3
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Questionário agendado com sucesso",
  "agendamento": {
    "id": 123,
    "questionario_id": 1,
    "titulo": "Avaliação Q4 - Departamento TI",
    "data_inicio": "2024-12-01T00:00:00Z",
    "data_fim": "2024-12-15T23:59:59Z",
    "total_participantes": 45,
    "status": "ativo"
  }
}
```

---

### GET `/api/questionarios/agendados`
Listar questionários agendados.

**Headers**: `Authorization: Bearer <token>`

**Query Params**:
- `status` (opcional): `ativo`, `encerrado`
- `departamento` (opcional)

**Response** (200 OK):
```json
{
  "success": true,
  "agendamentos": [
    {
      "id": 123,
      "questionario_id": 1,
      "titulo": "Avaliação Q4 - Departamento TI",
      "data_inicio": "2024-12-01T00:00:00Z",
      "data_fim": "2024-12-15T23:59:59Z",
      "total_participantes": 45,
      "total_respostas": 23,
      "taxa_participacao": 51.1,
      "status": "ativo"
    }
  ]
}
```

---

### GET `/api/questionarios/pendentes`
Questionários pendentes para o usuário atual.

**Headers**: `Authorization: Bearer <token>`

**Response** (200 OK):
```json
{
  "success": true,
  "pendentes": [
    {
      "agendamento_id": 123,
      "questionario_id": 1,
      "titulo": "Avaliação Q4 - Departamento TI",
      "data_fim": "2024-12-15T23:59:59Z",
      "dias_restantes": 5,
      "total_perguntas": 42
    }
  ]
}
```

---

##  Respostas

### POST `/api/respostas`
Submeter respostas de um questionário.

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "agendamento_id": 123,
  "questionario_id": 1,
  "tempo_gasto": 840,
  "respostas": [
    {
      "pergunta_id": 1,
      "valor": 5
    },
    {
      "pergunta_id": 2,
      "valor": 4
    },
    {
      "pergunta_id": 3,
      "valor": 3
    }
  ]
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Respostas salvas com sucesso",
  "resposta": {
    "id": "resp-uuid-123",
    "questionario_id": 1,
    "usuario_id": "user-uuid",
    "data_resposta": "2024-11-27T14:30:00Z",
    "tempo_gasto": 840
  }
}
```

**Validações**:
- Usuário não pode responder 2x ao mesmo agendamento
- Todas as perguntas devem ser respondidas
- Valores devem estar entre 1-5

---

### GET `/api/respostas/minhas`
Histórico de respostas do usuário.

**Headers**: `Authorization: Bearer <token>`

**Response** (200 OK):
```json
{
  "success": true,
  "respostas": [
    {
      "id": "resp-uuid-123",
      "questionario_titulo": "Avaliação Q4 2024",
      "data_resposta": "2024-11-27T14:30:00Z",
      "tempo_gasto": 840,
      "irp_calculado": 32.5,
      "classificacao_risco": "Médio"
    }
  ]
}
```

---

### GET `/api/respostas/{id}`
Detalhes de uma resposta específica.

**Headers**: `Authorization: Bearer <token>`

**Permissão**: Próprio usuário ou gestor do departamento

**Response** (200 OK):
```json
{
  "success": true,
  "resposta": {
    "id": "resp-uuid-123",
    "questionario": {
      "id": 1,
      "titulo": "Avaliação Q4 2024"
    },
    "usuario": {
      "id": "user-uuid",
      "name": "João Silva"
    },
    "data_resposta": "2024-11-27T14:30:00Z",
    "tempo_gasto": 840,
    "analise": {
      "irp": 32.5,
      "classificacao": "Médio",
      "subescalas": [
        {
          "nome": "Assédio Moral",
          "pontuacao_media": 4.2,
          "nivel": "Baixo"
        }
      ]
    },
    "itens": [
      {
        "pergunta_id": 1,
        "pergunta_texto": "Você já se sentiu intimidado no trabalho?",
        "valor": 5
      }
    ]
  }
}
```

---

##  Estatísticas

### GET `/api/stats/overview`
Visão geral das estatísticas (Admin/Gestor).

**Headers**: `Authorization: Bearer <token>`

**Permissão**: `admin` ou `gestor`

**Response** (200 OK):
```json
{
  "success": true,
  "overview": {
    "total_usuarios": 250,
    "total_avaliacoes": 1200,
    "taxa_participacao": 85.3,
    "irp_medio": 38.7,
    "tco_medio": 72.4,
    "alertas_abertos": 5,
    "acoes_pendentes": 12,
    "distribuicao_risco": {
      "critico": 15,
      "alto": 45,
      "medio": 120,
      "baixo": 70
    }
  }
}
```

---

### GET `/api/stats/personal`
Estatísticas pessoais do usuário.

**Headers**: `Authorization: Bearer <token>`

**Response** (200 OK):
```json
{
  "success": true,
  "personal": {
    "usuario": {
      "id": "uuid",
      "name": "João Silva",
      "departamento": "TI"
    },
    "ultima_avaliacao": "2024-11-27T14:30:00Z",
    "total_avaliacoes": 8,
    "irp_atual": 32.5,
    "classificacao": "Médio",
    "evolucao": [
      {
        "data": "2024-09",
        "irp": 35.2
      },
      {
        "data": "2024-10",
        "irp": 33.8
      },
      {
        "data": "2024-11",
        "irp": 32.5
      }
    ],
    "subescalas": [
      {
        "nome": "Assédio Moral",
        "pontuacao": 4.2,
        "nivel": "Baixo"
      },
      {
        "nome": "Carga de Trabalho",
        "pontuacao": 3.1,
        "nivel": "Médio"
      }
    ]
  }
}
```

---

### GET `/api/stats/departamentos`
Estatísticas por departamento.

**Headers**: `Authorization: Bearer <token>`

**Permissão**: `admin` ou `gestor`

**Response** (200 OK):
```json
{
  "success": true,
  "departamentos": [
    {
      "departamento": "TI",
      "total_usuarios": 50,
      "total_avaliacoes": 200,
      "irp_medio": 35.2,
      "tco": 75.3,
      "ivi": 0.67,
      "classificacao": "Médio",
      "distribuicao_risco": {
        "critico": 2,
        "alto": 8,
        "medio": 25,
        "baixo": 15
      }
    },
    {
      "departamento": "RH",
      "total_usuarios": 20,
      "total_avaliacoes": 80,
      "irp_medio": 22.1,
      "tco": 82.5,
      "ivi": 0.45,
      "classificacao": "Baixo"
    }
  ]
}
```

---

### GET `/api/stats/evolucao`
Evolução temporal das métricas.

**Headers**: `Authorization: Bearer <token>`

**Query Params**:
- `departamento` (opcional)
- `periodo`: `3m`, `6m`, `12m`

**Response** (200 OK):
```json
{
  "success": true,
  "evolucao": [
    {
      "mes": "2024-06",
      "total_avaliacoes": 95,
      "irp_medio": 40.2,
      "tco": 68.5,
      "variacao_mom": -2.3
    },
    {
      "mes": "2024-07",
      "total_avaliacoes": 102,
      "irp_medio": 38.8,
      "tco": 71.2,
      "variacao_mom": -3.5
    }
  ]
}
```

---

##  Denúncias

### POST `/api/denuncias`
Criar nova denúncia.

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "titulo": "Assédio Moral no Setor",
  "descricao": "Descrição detalhada do ocorrido...",
  "tipo": "assedio_moral",
  "data": "2024-11-20",
  "anonima": true,
  "denunciado": "Nome do denunciado (opcional)"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Denúncia registrada com sucesso",
  "denuncia": {
    "id": 456,
    "protocolo": "DEN-2024-456",
    "titulo": "Assédio Moral no Setor",
    "tipo": "assedio_moral",
    "data": "2024-11-20",
    "status": "aberta",
    "anonima": true
  }
}
```

---

### GET `/api/denuncias`
Listar denúncias.

**Headers**: `Authorization: Bearer <token>`

**Permissões**:
- `admin`: Vê todas
- `gestor`: Vê do seu departamento
- `funcionario`: Vê apenas as próprias (não anônimas)

**Query Params**:
- `status`: `aberta`, `em_analise`, `resolvida`
- `tipo`: `assedio_moral`, `assedio_sexual`, etc.

**Response** (200 OK):
```json
{
  "success": true,
  "denuncias": [
    {
      "id": 456,
      "protocolo": "DEN-2024-456",
      "titulo": "Assédio Moral no Setor",
      "tipo": "assedio_moral",
      "data": "2024-11-20",
      "status": "em_analise",
      "anonima": true,
      "data_criacao": "2024-11-20T10:30:00Z"
    }
  ]
}
```

---

### GET `/api/denuncias/{id}`
Detalhes de uma denúncia.

**Headers**: `Authorization: Bearer <token>`

**Response** (200 OK):
```json
{
  "success": true,
  "denuncia": {
    "id": 456,
    "protocolo": "DEN-2024-456",
    "titulo": "Assédio Moral no Setor",
    "descricao": "Descrição completa...",
    "tipo": "assedio_moral",
    "data": "2024-11-20",
    "status": "em_analise",
    "anonima": true,
    "denunciante": null,
    "denunciado": "Nome",
    "data_criacao": "2024-11-20T10:30:00Z",
    "historico": [
      {
        "data": "2024-11-20T10:30:00Z",
        "acao": "Denúncia criada"
      },
      {
        "data": "2024-11-21T14:00:00Z",
        "acao": "Status alterado para em_analise"
      }
    ]
  }
}
```

---

### PUT `/api/denuncias/{id}`
Atualizar status da denúncia.

**Headers**: `Authorization: Bearer <token>`

**Permissão**: `admin` ou `gestor`

**Request Body**:
```json
{
  "status": "resolvida",
  "observacoes": "Ação corretiva implementada..."
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Denúncia atualizada com sucesso"
}
```

---

##  Alertas

### GET `/api/alertas`
Listar alertas ativos.

**Headers**: `Authorization: Bearer <token>`

**Query Params**:
- `nivel`: `critico`, `alto`, `medio`, `baixo`
- `status`: `aberto`, `em_andamento`, `resolvido`
- `departamento` (opcional)

**Response** (200 OK):
```json
{
  "success": true,
  "alertas": [
    {
      "id": "alert-uuid-123",
      "titulo": "Risco Crítico Detectado",
      "descricao": "Usuário com IRP de 82% no departamento TI",
      "tipo": "risco_psicossocial",
      "departamento": "TI",
      "nivel": "critico",
      "status": "aberto",
      "data_criacao": "2024-11-27T10:30:00Z",
      "acao_corretiva_id": null
    }
  ]
}
```

---

### POST `/api/alertas/{id}/acao-corretiva`
Gerar ação corretiva via IA para um alerta.

**Headers**: `Authorization: Bearer <token>`

**Permissão**: `admin` ou `gestor`

**Response** (200 OK):
```json
{
  "success": true,
  "acao_corretiva": {
    "id": "acao-uuid-456",
    "titulo": "Intervenção Psicossocial - Departamento TI",
    "descricao": "Plano de ação baseado em análise de IA",
    "medidas_sugeridas": "1. Realizar sessão de escuta ativa...\n2. Implementar programa de mentoria...",
    "prioridade": "alta",
    "prazo": "2024-12-15",
    "status": "pendente"
  }
}
```

---

##  Ações Corretivas

### GET `/api/acoes-corretivas`
Listar ações corretivas.

**Headers**: `Authorization: Bearer <token>`

**Query Params**:
- `status`: `pendente`, `em_progresso`, `concluida`
- `prioridade`: `alta`, `media`, `baixa`
- `departamento` (opcional)

**Response** (200 OK):
```json
{
  "success": true,
  "acoes": [
    {
      "id": "acao-uuid-456",
      "titulo": "Intervenção Psicossocial - TI",
      "departamento": "TI",
      "nivel_risco": "critico",
      "prioridade": "alta",
      "responsavel": "João Silva",
      "prazo": "2024-12-15",
      "status": "em_progresso",
      "data_criacao": "2024-11-27"
    }
  ]
}
```

---

### GET `/api/acoes-corretivas/{id}`
Detalhes de uma ação corretiva.

**Headers**: `Authorization: Bearer <token>`

**Response** (200 OK):
```json
{
  "success": true,
  "acao": {
    "id": "acao-uuid-456",
    "titulo": "Intervenção Psicossocial - TI",
    "descricao": "Descrição completa...",
    "departamento": "TI",
    "nivel_risco": "critico",
    "prioridade": "alta",
    "responsavel": "João Silva",
    "prazo": "2024-12-15",
    "status": "em_progresso",
    "medidas_sugeridas": "1. Sessão de escuta...\n2. Mentoria...",
    "analise_detalhada": "Análise gerada pela IA...",
    "impacto_esperado": "Redução de 30% no IRP em 3 meses",
    "recursos_necessarios": "Budget: R$ 5.000, Tempo: 40h",
    "progresso": 45,
    "data_criacao": "2024-11-27"
  }
}
```

---

### PUT `/api/acoes-corretivas/{id}`
Atualizar ação corretiva.

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "status": "concluida",
  "observacoes": "Ação implementada com sucesso"
}
```

---

##  Empresa

### GET `/api/empresa`
Informações da empresa.

**Headers**: `Authorization: Bearer <token>`

**Response** (200 OK):
```json
{
  "success": true,
  "empresa": {
    "id": 1,
    "nome": "Tech Innovation Ltda",
    "cnpj": "12.345.678/0001-90",
    "endereco": "Av. Paulista, 1000 - São Paulo/SP",
    "telefone": "(11) 3000-1000",
    "email": "contato@techinnovation.com",
    "setor": "Tecnologia",
    "numero_funcionarios": 250,
    "plano_ativo": "Enterprise",
    "validade_plano": "2025-12-31"
  }
}
```

---

##  Códigos de Status HTTP

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | Sucesso |
| 201 | Created | Recurso criado |
| 400 | Bad Request | Dados inválidos |
| 401 | Unauthorized | Token ausente/inválido |
| 403 | Forbidden | Sem permissão |
| 404 | Not Found | Recurso não encontrado |
| 409 | Conflict | Conflito (ex: email duplicado) |
| 422 | Unprocessable Entity | Validação falhou |
| 429 | Too Many Requests | Rate limit excedido |
| 500 | Internal Server Error | Erro no servidor |

---

##  Exemplos de Uso

### cURL

```bash
# Login
curl -X POST http://localhost:4567/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@psysafe.com","password":"admin123"}'

# Listar questionários (com token)
curl -X GET http://localhost:4567/api/questionarios \
  -H "Authorization: Bearer eyJhbGc..."
```

### JavaScript (Axios)

```javascript
// Login
const { data } = await axios.post('/api/auth/login', {
  email: 'admin@psysafe.com',
  password: 'admin123'
});

// Armazenar token
localStorage.setItem('token', data.token);

// Requisição autenticada
const questionarios = await axios.get('/api/questionarios', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
```

---

**Próximos Passos**:
- [DATABASE.md](DATABASE.md) - Estrutura do banco
- [ANALYTICS.md](ANALYTICS.md) - Métricas e cálculos
- [AZURE-INTEGRATION.md](AZURE-INTEGRATION.md) - Integração com IA

---

**Última Atualização**: Novembro 2024
