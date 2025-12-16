# PsySafe - Documentação Técnica Completa

## 1. Visão Geral do Sistema

### 1.1 Descrição
O **PsySafe** é uma plataforma de gestão de segurança psicológica organizacional que permite avaliar, monitorar e melhorar o ambiente de trabalho através de questionários estruturados, análises estatísticas e ações corretivas baseadas em inteligência artificial.

### 1.2 Objetivo
Proporcionar uma ferramenta completa para:
- Avaliação de riscos psicossociais no ambiente de trabalho
- Monitoramento contínuo da saúde organizacional
- Geração automática de ações corretivas e preventivas
- Gestão de denúncias e alertas
- Análise estatística detalhada por departamento e equipe

---

## 2. Arquitetura do Sistema

### 2.1 Stack Tecnológico

#### Backend
- **Framework**: Apache Spark + Java
- **Porta**: 4765
- **Build Tool**: Maven
- **Segurança**: JWT (JSON Web Tokens)
- **Banco de Dados**: PostgreSQL (Azure)
- **Ferramenta de Gestão BD**: pgAdmin 4

#### Frontend
- **Porta**: 5173
- **Package Manager**: npm
- **Build Tool**: Vite (inferido pelo comando npm run dev)

#### Infraestrutura
- **Cloud Provider**: Microsoft Azure
- **Recursos Azure**:
  - PostgreSQL Database
  - OpenAI GPT-5.1 Mini (ações corretivas e prevenção de riscos)

### 2.2 Comandos de Execução

#### Backend
```bash
mvn clean install
cd target
java -jar psysafe-1.0-SNAPSHOT-exec.jar
```

#### Frontend
```bash
npm install
npm run dev
```

---

## 3. Modelo de Dados

### 3.1 Tabelas Principais

#### 3.1.1 Gestão de Usuários

##### `auth_user`
Tabela de autenticação de usuários.

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| id | uuid | NO | Identificador único do usuário |
| name | varchar | NO | Nome completo |
| email | varchar | NO | Email (único) |
| password_hash | varchar | NO | Hash da senha (bcrypt) |
| role | varchar | YES | Papel do usuário (admin, gestor, funcionario) |
| created_at | timestamp | NO | Data de criação |
| ultimo_login | timestamp | YES | Último acesso ao sistema |

##### `user_profile`
Perfil detalhado do usuário.

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| user_id | uuid | NO | FK para auth_user |
| name | varchar | YES | Nome do usuário |
| email | varchar | YES | Email do usuário |
| role | varchar | YES | Cargo/função |
| departamento | varchar | YES | Departamento |
| equipe | varchar | YES | Nome da equipe |
| cargo | varchar | YES | Cargo específico |
| telefone | varchar | YES | Telefone de contato |
| id_empresa | integer | YES | FK para empresa |
| id_equipe | integer | YES | FK para equipe |
| data_admissao | date | YES | Data de admissão |
| ultimo_login | timestamp | YES | Último login |
| created_at | timestamp | YES | Data de criação do perfil |

##### `usuario_id_mapping`
Mapeamento entre IDs inteiros e UUIDs (compatibilidade).

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| integer_id | integer | NO | ID inteiro (legado) |
| uuid_id | uuid | NO | UUID correspondente |
| created_at | timestamp | YES | Data de criação do mapeamento |

#### 3.1.2 Gestão Empresarial

##### `empresa`
Dados das empresas clientes.

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| id_empresa | integer | NO | PK |
| nome | varchar | NO | Razão social |
| cnpj | varchar | NO | CNPJ (único) |
| endereco | varchar | NO | Endereço completo |
| telefone | varchar | NO | Telefone principal |
| email | varchar | NO | Email corporativo |
| setor | varchar | NO | Setor de atuação |
| numero_funcionarios | integer | NO | Quantidade de funcionários |
| data_fundacao | date | NO | Data de fundação |
| responsavel_rh | varchar | NO | Nome do responsável RH |
| plano_ativo | varchar | NO | Tipo de plano contratado |
| validade_plano | date | NO | Data de validade do plano |

##### `equipe`
Equipes dentro das empresas.

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| id_equipe | integer | NO | PK |
| nome | varchar | NO | Nome da equipe |
| empresa_id | integer | YES | FK para empresa |

##### `membro_equipe`
Membros de cada equipe.

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| id | integer | NO | PK |
| nome | varchar | NO | Nome do membro |
| cargo | varchar | NO | Cargo do membro |
| email | varchar | NO | Email do membro |
| id_equipe | integer | NO | FK para equipe |

---

### 3.2 Sistema de Questionários

#### 3.2.1 Estrutura de Questionários

##### `questionario`
Questionários de avaliação psicossocial.

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| id | integer | NO | PK |
| titulo | text | NO | Título do questionário |
| descricao | text | YES | Descrição detalhada |
| ativo | boolean | YES | Status ativo/inativo |
| data_encerramento | timestamp | YES | Data limite de respostas |
| versao | varchar | YES | Versão do questionário |
| tempo_estimado | text | YES | Tempo estimado de resposta |
| data_criacao | timestamp | YES | Data de criação |

##### `subescala`
Subescalas/dimensões do questionário (ex: Assédio Moral, Clima Organizacional).

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| id | integer | NO | PK |
| questionario_id | integer | YES | FK para questionario |
| nome | text | NO | Nome da subescala |
| descricao | text | YES | Descrição da dimensão |
| ordem | integer | YES | Ordem de apresentação |
| tipo_resposta_id | integer | YES | FK para tipo_resposta |

##### `pergunta`
Perguntas individuais do questionário.

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| id | integer | NO | PK |
| questionario_id | integer | YES | FK para questionario |
| numero | integer | YES | Número sequencial |
| conteudo | text | YES | Texto da pergunta |
| subescala_id | integer | YES | FK para subescala |
| id_subescala | integer | YES | FK alternativa para subescala |

##### `tipo_resposta`
Tipos de escala de resposta (Likert, múltipla escolha, etc).

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| id | integer | NO | PK |
| nome | text | YES | Nome do tipo de resposta |
| opcao1 | text | YES | Primeira opção (ex: "Nunca") |
| opcao2 | text | YES | Segunda opção (ex: "Raramente") |
| opcao3 | text | YES | Terceira opção (ex: "Às vezes") |
| opcao4 | text | YES | Quarta opção (ex: "Frequentemente") |
| opcao5 | text | YES | Quinta opção (ex: "Sempre") |

##### `questionario_pergunta`
Relacionamento many-to-many entre questionários e perguntas.

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| id_questionario_pergunta | integer | NO | PK |
| id_questionario | integer | YES | FK para questionario |
| id_pergunta | integer | YES | FK para pergunta |
| num_pergunta | integer | YES | Ordem da pergunta |

---

#### 3.2.2 Agendamento de Questionários

##### `agendamento`
Agendamentos de aplicação de questionários.

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| id | integer | NO | PK |
| questionario_id | integer | YES | FK para questionario |
| gestor_id | integer | YES | ID do gestor responsável |
| versao | varchar | YES | Versão do questionário |
| data_inicio | timestamp | YES | Início do período de resposta |
| data_fim | timestamp | YES | Fim do período de resposta |
| departamentos | ARRAY | YES | Array de departamentos alvo |
| ativo | boolean | YES | Status do agendamento |
| total_participantes | integer | YES | Número de participantes esperados |
| total_respostas | integer | YES | Número de respostas recebidas |
| created_at | timestamp | YES | Data de criação |

##### `questionario_agendamento`
Tabela alternativa de agendamento (possível migração/refatoração).

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| idagendamento | integer | NO | PK |
| idquestionario | integer | NO | FK para questionario |
| idgestor | varchar | NO | ID do gestor |
| versao | varchar | NO | Versão |
| datainicio | timestamp | NO | Data início |
| datafim | timestamp | NO | Data fim |
| departamentos | ARRAY | NO | Departamentos |
| ativo | boolean | YES | Status |
| createdat | timestamp | YES | Criado em |
| updatedat | timestamp | YES | Atualizado em |

##### `scheduling_request`
Requisições de agendamento.

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| id | integer | NO | PK |
| titulo | varchar | NO | Título da requisição |
| descricao | text | YES | Descrição |
| departamentos | ARRAY | YES | Departamentos alvo |
| data_inicio | timestamp | NO | Data início |
| data_fim | timestamp | NO | Data fim |
| enviar_lembrete | boolean | YES | Flag para lembretes |
| lembrete_dias | integer | YES | Dias antes do lembrete |
| enviar_notificacao | boolean | YES | Flag para notificações |
| prioridade | varchar | YES | Nível de prioridade |
| questionnaire_id | uuid | YES | FK para questionario |
| created_at | timestamp | YES | Data de criação |

---

#### 3.2.3 Respostas

##### `resposta`
Respostas principais dos usuários.

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| id | varchar | NO | PK |
| questionario_id | integer | YES | FK para questionario |
| usuario_id | varchar | YES | ID do usuário respondente |
| data_resposta | timestamp | YES | Data/hora da resposta |
| tempo_gasto | integer | YES | Tempo gasto em segundos |

##### `resposta_item`
Itens individuais de resposta (uma linha por pergunta respondida).

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| id | integer | NO | PK |
| resposta_id | varchar | YES | FK para resposta |
| pergunta_id | integer | YES | FK para pergunta |
| valor | integer | YES | Valor da resposta (1-5 em escala Likert) |

---

## 4. Sistema de Segurança

### 4.1 Autenticação JWT

#### Fluxo de Autenticação
1. **Login**: Usuário envia credenciais (email + senha)
2. **Validação**: Sistema valida hash da senha
3. **Geração do Token**: JWT é gerado com payload contendo:
   - `user_id` (UUID)
   - `email`
   - `role`
   - `exp` (expiração)
4. **Retorno**: Token é enviado ao cliente
5. **Uso**: Cliente envia token no header `Authorization: Bearer <token>`

#### Estrutura do Token JWT
```json
{
  "user_id": "uuid-do-usuario",
  "email": "usuario@empresa.com",
  "role": "gestor",
  "iat": 1234567890,
  "exp": 1234654290
}
```

#### Roles (Níveis de Acesso)
- **admin**: Acesso total ao sistema
- **gestor**: Gestão de equipes, visualização de relatórios, criação de agendamentos
- **funcionario**: Resposta a questionários, visualização própria

### 4.2 Segurança de Dados
- Senhas armazenadas com hash bcrypt
- Comunicação via HTTPS (recomendado em produção)
- Tokens com expiração configurável
- Validação de tokens em todas as rotas protegidas

---

## 5. Integração com Azure OpenAI

### 5.1 Modelo Utilizado
- **Serviço**: Azure OpenAI
- **Modelo**: GPT-5.1 Mini
- **Função**: Geração de ações corretivas e estratégias de prevenção de riscos

### 5.2 Casos de Uso

#### 5.2.1 Geração de Ações Corretivas
Quando alertas críticos são detectados, o sistema:
1. Coleta dados do alerta (departamento, tipo, nível)
2. Analisa contexto histórico
3. Envia prompt ao GPT-5.1 Mini
4. Recebe sugestões de ações corretivas personalizadas
5. Armazena na tabela `acao_corretiva`

#### 5.2.2 Análise Preditiva
- Identificação de padrões de risco
- Sugestões preventivas baseadas em tendências
- Recomendações de intervenções

### 5.3 Exemplo de Prompt
```
Com base nos seguintes dados:
- Departamento: [nome]
- Nível de Risco: [crítico/alto/médio/baixo]
- Tipo de Alerta: [tipo]
- Histórico: [dados históricos]

Gere 3 ações corretivas específicas e mensuráveis.
```

---

## 6. Sistema de Alertas e Ações Corretivas

### 6.1 Tabela `alertas`

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| id | uuid | NO | PK |
| titulo | text | NO | Título do alerta |
| descricao | text | NO | Descrição detalhada |
| tipo | varchar | YES | Tipo de alerta (assédio, sobrecarga, etc) |
| departamento | varchar | YES | Departamento afetado |
| nivel | varchar | YES | Nível de gravidade (crítico, alto, médio, baixo) |
| status | varchar | YES | Status (aberto, em andamento, resolvido) |
| data_criacao | timestamp | YES | Data de criação |
| data_resolucao | timestamp | YES | Data de resolução |
| acao_corretiva_id | uuid | YES | FK para acao_corretiva |

### 6.2 Tabela `acao_corretiva`

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| id | uuid | NO | PK |
| titulo | varchar | NO | Título da ação |
| descricao | text | NO | Descrição da ação |
| departamento | varchar | NO | Departamento alvo |
| nivel_risco | varchar | NO | Nível de risco associado |
| prioridade | varchar | NO | Prioridade de execução |
| responsavel | varchar | NO | Responsável pela ação |
| data_criacao | timestamp | NO | Data de criação |
| data_prazo | timestamp | YES | Prazo para conclusão |
| status | varchar | NO | Status (pendente, em progresso, concluída) |
| medidas_sugeridas | text | NO | Medidas sugeridas pela IA |
| analise_detalhada | text | YES | Análise detalhada do contexto |
| impacto_esperado | text | YES | Impacto esperado da ação |
| recursos_necessarios | text | YES | Recursos necessários |
| created_at | timestamp | YES | Timestamp de criação |
| updated_at | timestamp | YES | Timestamp de atualização |

---

## 7. Sistema de Denúncias

### 7.1 Tabela `denuncias`

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| id | integer | NO | PK |
| titulo | varchar | NO | Título da denúncia |
| descricao | text | NO | Descrição detalhada |
| tipo | varchar | NO | Tipo de denúncia |
| data | date | NO | Data do ocorrido |
| resolvido | boolean | NO | Status de resolução |
| anonima | boolean | NO | Se é anônima |
| denunciante | varchar | YES | Nome do denunciante (NULL se anônima) |
| denunciado | varchar | NO | Nome do denunciado |
| id_empresa | integer | YES | FK para empresa |

### 7.2 Tabela `denuncia_request`

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| id | integer | NO | PK |
| titulo | varchar | NO | Título |
| descricao | text | NO | Descrição |
| tipo | varchar | NO | Tipo |
| anonima | boolean | NO | Se é anônima |
| denunciado | varchar | NO | Denunciado |
| data_criacao | timestamp | YES | Data de criação |

### 7.3 Tipos de Denúncia
- Assédio Moral
- Assédio Sexual
- Discriminação
- Condições de Trabalho Inseguras
- Violação de Políticas Internas
- Outros
---

## 8. Views Analíticas (Relatórios)

### 8.1 `vw_questionarios_ativos`
**Objetivo**: Visão consolidada dos questionários ativos com suas métricas.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | integer | ID do questionário |
| titulo | text | Título do questionário |
| descricao | text | Descrição |
| versao | varchar | Versão |
| tempo_estimado | text | Tempo estimado |
| total_perguntas | bigint | Total de perguntas |
| total_subescalas | bigint | Total de subescalas/dimensões |
| total_respostas | bigint | Total de respostas recebidas |
| data_criacao | timestamp | Data de criação |

**Uso**: Dashboard de gestão de questionários, visão rápida de engajamento.

---

### 8.2 `vw_analise_subescala`
**Objetivo**: Análise estatística por subescala (dimensão do questionário).

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| subescala | text | Nome da subescala |
| descricao | text | Descrição da subescala |
| questionario_id | integer | ID do questionário |
| total_respostas | bigint | Número de respostas |
| pontuacao_media | numeric | Média das pontuações (1-5) |
| pontuacao_minima | integer | Pontuação mínima registrada |
| pontuacao_maxima | integer | Pontuação máxima registrada |
| desvio_padrao | numeric | Desvio padrão das respostas |

**Cálculos Estatísticos**:
- **Média**: `AVG(valor)` dos itens de resposta
- **Desvio Padrão**: `STDDEV(valor)` - mede dispersão das respostas
- **Min/Max**: `MIN(valor)` e `MAX(valor)`

**Interpretação** (similar a relatórios PROEX):
- **Pontuação Alta (4-5)**: Situação positiva, baixo risco
- **Pontuação Média (3)**: Zona de atenção, monitoramento necessário
- **Pontuação Baixa (1-2)**: Risco alto, intervenção necessária
- **Desvio Padrão Alto**: Respostas muito variadas, possível polarização

---

### 8.3 `vw_stats_departamento`
**Objetivo**: Estatísticas consolidadas por departamento (modelo PROEX).

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| departamento | varchar | Nome do departamento |
| total_avaliacoes | bigint | Total de avaliações realizadas |
| total_usuarios | bigint | Total de usuários do departamento |
| media_risco | numeric | Média de risco (0-100) |
| nivel_conformidade | numeric | Nível de conformidade (%) |
| usuarios_risco_critico | bigint | Usuários em risco crítico |
| usuarios_risco_alto | bigint | Usuários em risco alto |
| usuarios_risco_medio | bigint | Usuários em risco médio |
| usuarios_risco_baixo | bigint | Usuários em risco baixo |

**Fórmulas de Cálculo**:

1. **Média de Risco**:
```sql
-- Inversão da escala: quanto menor a pontuação, maior o risco
media_risco = ((5 - AVG(valor)) / 4) * 100
-- Resultado: 0 (sem risco) a 100 (risco máximo)
```

2. **Nível de Conformidade**:
```sql
-- Percentual de respostas positivas (4 ou 5)
nivel_conformidade = (COUNT(valor >= 4) / COUNT(total)) * 100
```

3. **Classificação de Risco por Usuário**:
```sql
CASE 
  WHEN media_usuario < 2 THEN 'critico'
  WHEN media_usuario < 3 THEN 'alto'
  WHEN media_usuario < 4 THEN 'medio'
  ELSE 'baixo'
END
```

**Uso**: Relatórios gerenciais, identificação de departamentos prioritários, comparação interdepartamental.

---

### 8.4 `vw_evolucao_mensal`
**Objetivo**: Evolução temporal das métricas (tendências).

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| mes | timestamp | Mês de referência |
| total_avaliacoes | bigint | Avaliações no período |
| media_risco | numeric | Média de risco no mês |
| nivel_conformidade | numeric | Conformidade no mês (%) |
| usuarios_responderam | bigint | Usuários ativos no mês |

**Análise de Tendências**:
- **Crescimento/Queda**: Comparação mês a mês (MoM - Month over Month)
- **Sazonalidade**: Identificação de padrões cíclicos
- **Alertas**: Detecção de mudanças bruscas (>20% variação)

**Exemplo de Cálculo MoM**:
```sql
WITH dados_mensais AS (
  SELECT 
    mes,
    media_risco,
    LAG(media_risco) OVER (ORDER BY mes) as mes_anterior
  FROM vw_evolucao_mensal
)
SELECT 
  mes,
  media_risco,
  ((media_risco - mes_anterior) / mes_anterior) * 100 as variacao_percentual
FROM dados_mensais;
```

---

### 8.5 `vw_usuarios_pendentes`
**Objetivo**: Identificação de usuários que não responderam questionários.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| user_id | uuid | ID do usuário |
| name | varchar | Nome do usuário |
| email | varchar | Email |
| departamento | varchar | Departamento |
| cargo | varchar | Cargo |
| questionarios_pendentes | bigint | Número de questionários não respondidos |
| questionarios | text | Lista de títulos pendentes |

**Uso**: Campanhas de follow-up, lembretes automáticos, análise de engajamento.

---

### 8.6 `vw_perguntas_por_subescala`
**Objetivo**: Estrutura detalhada de perguntas organizadas por subescala.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| questionario_id | integer | ID do questionário |
| questionario_titulo | text | Título do questionário |
| subescala_id | integer | ID da subescala |
| subescala_nome | text | Nome da subescala |
| subescala_ordem | integer | Ordem da subescala |
| pergunta_id | integer | ID da pergunta |
| pergunta_numero | integer | Número da pergunta |
| pergunta_conteudo | text | Texto da pergunta |

**Uso**: Exibição estruturada de questionários, análise de itens individuais.

---

## 9. Cálculos Estatísticos Detalhados

### 9.1 Metodologia Similar a Relatórios PROEX

#### 9.1.1 Indicadores Principais

**1. Índice de Risco Psicossocial (IRP)**
```sql
-- Cálculo por usuário
SELECT 
  usuario_id,
  ((5 - AVG(ri.valor)) / 4) * 100 as irp
FROM resposta r
JOIN resposta_item ri ON r.id = ri.resposta_id
GROUP BY usuario_id;
```

**Classificação**:
- 0-25: Baixo Risco (Verde)
- 26-50: Risco Médio (Amarelo)
- 51-75: Risco Alto (Laranja)
- 76-100: Risco Crítico (Vermelho)

---

**2. Taxa de Conformidade Organizacional (TCO)**
```sql
SELECT 
  departamento,
  (COUNT(CASE WHEN valor >= 4 THEN 1 END)::float / 
   COUNT(*)::float) * 100 as tco
FROM user_profile up
JOIN resposta r ON up.user_id::varchar = r.usuario_id
JOIN resposta_item ri ON r.id = ri.resposta_id
GROUP BY departamento;
```

**Meta**: TCO ≥ 70% (padrão PROEX)

---

**3. Índice de Variabilidade Interna (IVI)**
```sql
SELECT 
  departamento,
  STDDEV(media_usuario) as ivi
FROM (
  SELECT 
    up.departamento,
    r.usuario_id,
    AVG(ri.valor) as media_usuario
  FROM resposta r
  JOIN resposta_item ri ON r.id = ri.resposta_id
  JOIN user_profile up ON up.user_id::varchar = r.usuario_id
  GROUP BY up.departamento, r.usuario_id
) subquery
GROUP BY departamento;
```

**Interpretação**:
- IVI < 0.5: Homogêneo (boa consistência)
- IVI 0.5-1.0: Moderado (atenção)
- IVI > 1.0: Heterogêneo (investigar causas)

---

#### 9.1.2 Análise por Subescala

**Heatmap de Risco por Dimensão**:
```sql
SELECT 
  s.nome as subescala,
  up.departamento,
  COUNT(DISTINCT r.usuario_id) as n_respondentes,
  AVG(ri.valor) as media,
  STDDEV(ri.valor) as desvio,
  CASE 
    WHEN AVG(ri.valor) >= 4 THEN 'Baixo'
    WHEN AVG(ri.valor) >= 3 THEN 'Médio'
    WHEN AVG(ri.valor) >= 2 THEN 'Alto'
    ELSE 'Crítico'
  END as classificacao_risco
FROM subescala s
JOIN pergunta p ON s.id = p.subescala_id
JOIN resposta_item ri ON p.id = ri.pergunta_id
JOIN resposta r ON ri.resposta_id = r.id
JOIN user_profile up ON up.user_id::varchar = r.usuario_id
GROUP BY s.nome, up.departamento
ORDER BY media ASC;
```

---

#### 9.1.3 Análise Temporal (Séries Temporais)

**Tendência de 6 Meses**:
```sql
WITH serie_mensal AS (
  SELECT 
    DATE_TRUNC('month', r.data_resposta) as mes,
    AVG(ri.valor) as media_mes,
    COUNT(DISTINCT r.usuario_id) as respondentes
  FROM resposta r
  JOIN resposta_item ri ON r.id = ri.resposta_id
  WHERE r.data_resposta >= NOW() - INTERVAL '6 months'
  GROUP BY DATE_TRUNC('month', r.data_resposta)
)
SELECT 
  mes,
  media_mes,
  respondentes,
  LAG(media_mes) OVER (ORDER BY mes) as mes_anterior,
  ((media_mes - LAG(media_mes) OVER (ORDER BY mes)) / 
   LAG(media_mes) OVER (ORDER BY mes)) * 100 as variacao_pct
FROM serie_mensal
ORDER BY mes;
```

---

### 9.2 Alertas Automáticos (Triggers)

**Criação de Alerta Quando IRP > 75**:
```sql
CREATE OR REPLACE FUNCTION verificar_risco_critico()
RETURNS TRIGGER AS $$
DECLARE
  irp_usuario NUMERIC;
  dept VARCHAR;
BEGIN
  -- Calcular IRP do usuário
  SELECT 
    ((5 - AVG(ri.valor)) / 4) * 100,
    up.departamento
  INTO irp_usuario, dept
  FROM resposta_item ri
  JOIN resposta r ON ri.resposta_id = r.id
  JOIN user_profile up ON up.user_id::varchar = r.usuario_id
  WHERE r.id = NEW.resposta_id
  GROUP BY up.departamento;
  
  -- Se IRP crítico, criar alerta
  IF irp_usuario > 75 THEN
    INSERT INTO alertas (
      id, titulo, descricao, tipo, 
      departamento, nivel, status, data_criacao
    ) VALUES (
      gen_random_uuid(),
      'Risco Crítico Detectado',
      'Usuário com IRP de ' || irp_usuario || '% necessita intervenção imediata.',
      'risco_psicossocial',
      dept,
      'critico',
      'aberto',
      NOW()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_risco_critico
AFTER INSERT ON resposta_item
FOR EACH ROW
EXECUTE FUNCTION verificar_risco_critico();
```

---

## 10. Endpoints da API (Backend)

### 10.1 Autenticação

#### POST `/api/auth/login`
**Descrição**: Autenticação de usuário e geração de token JWT.

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
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "Nome do Usuário",
    "email": "usuario@empresa.com",
    "role": "gestor"
  }
}
```

**Erros**:
- 401: Credenciais inválidas
- 400: Campos obrigatórios ausentes

---

#### POST `/api/auth/register`
**Descrição**: Registro de novo usuário.

**Request Body**:
```json
{
  "name": "Novo Usuário",
  "email": "novo@empresa.com",
  "password": "senha123",
  "role": "funcionario",
  "departamento": "TI",
  "cargo": "Analista"
}
```

**Response** (201 Created):
```json
{
  "id": "uuid",
  "message": "Usuário criado com sucesso"
}
```

---

### 10.2 Questionários

#### GET `/api/questionarios`
**Descrição**: Lista questionários ativos.

**Headers**: `Authorization: Bearer <token>`

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "titulo": "Avaliação Psicossocial Q3 2024",
    "descricao": "Questionário trimestral...",
    "versao": "1.0",
    "tempo_estimado": "15 minutos",
    "total_perguntas": 42,
    "total_subescalas": 7
  }
]
```

---

#### GET `/api/questionarios/{id}`
**Descrição**: Detalhes de um questionário com perguntas.

**Response** (200 OK):
```json
{
  "id": 1,
  "titulo": "Avaliação Psicossocial Q3 2024",
  "subescalas": [
    {
      "id": 1,
      "nome": "Assédio Moral",
      "ordem": 1,
      "perguntas": [
        {
          "id": 1,
          "numero": 1,
          "conteudo": "Você já se sentiu intimidado no trabalho?",
          "tipo_resposta": {
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
```

---

#### POST `/api/respostas`
**Descrição**: Submissão de respostas de questionário.

**Request Body**:
```json
{
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
    }
  ]
}
```

**Response** (201 Created):
```json
{
  "id": "resposta-uuid",
  "message": "Respostas salvas com sucesso"
}
```

---

### 10.3 Relatórios e Estatísticas

#### GET `/api/relatorios/departamento/{departamento}`
**Descrição**: Relatório completo do departamento (modelo PROEX).

**Response** (200 OK):
```json
{
  "departamento": "TI",
  "periodo": "2024-Q3",
  "metricas": {
    "total_avaliacoes": 45,
    "total_usuarios": 50,
    "taxa_participacao": 90,
    "media_risco": 32.5,
    "nivel_conformidade": 78.3,
    "ivi": 0.67
  },
  "distribuicao_risco": {
    "critico": 2,
    "alto": 5,
    "medio": 15,
    "baixo": 23
  },
  "analise_subescalas": [
    {
      "nome": "Assédio Moral",
      "media": 4.2,
      "desvio": 0.8,
      "classificacao": "Baixo"
    }
  ],
  "evolucao_mensal": [
    {
      "mes": "2024-07",
      "media_risco": 35.2,
      "variacao": -2.1
    }
  ]
}
```

---

#### GET `/api/relatorios/geral`
**Descrição**: Relatório organizacional geral.

**Response** (200 OK):
```json
{
  "resumo": {
    "total_usuarios": 250,
    "total_respostas": 2340,
    "media_risco_geral": 38.7,
    "departamento_maior_risco": "Produção",
    "departamento_menor_risco": "Administrativo"
  },
  "ranking_departamentos": [
    {
      "departamento": "Produção",
      "media_risco": 55.3,
      "posicao": 1
    }
  ]
}
```

---

### 10.4 Alertas

#### GET `/api/alertas`
**Descrição**: Lista alertas ativos.

**Query Params**:
- `departamento` (opcional)
- `nivel` (opcional): critico, alto, medio, baixo
- `status` (opcional): aberto, em_andamento, resolvido

**Response** (200 OK):
```json
[
  {
    "id": "uuid",
    "titulo": "Risco Crítico Detectado",
    "descricao": "Usuário com IRP de 82% no departamento TI",
    "tipo": "risco_psicossocial",
    "departamento": "TI",
    "nivel": "critico",
    "status": "aberto",
    "data_criacao": "2024-11-20T10:30:00Z",
    "acao_corretiva_id": null
  }
]
```

---

#### POST `/api/alertas/{id}/acao-corretiva`
**Descrição**: Gera ação corretiva via IA para um alerta.

**Response** (200 OK):
```json
{
  "acao_corretiva_id": "uuid",
  "titulo": "Intervenção Psicossocial - Departamento TI",
  "medidas_sugeridas": "1. Realizar sessão de escuta ativa...",
  "prioridade": "alta",
  "prazo": "2024-12-01"
}
```

---

### 10.5 Denúncias

#### POST `/api/denuncias`
**Descrição**: Registro de denúncia.

**Request Body**:
```json
{
  "titulo": "Assédio Moral",
  "descricao": "Descrição detalhada do ocorrido...",
  "tipo": "assedio_moral",
  "anonima": true,
  "denunciado": "Nome do denunciado",
  "data": "2024-11-15"
}
```

**Response** (201 Created):
```json
{
  "id": 123,
  "protocolo": "DEN-2024-123",
  "message": "Denúncia registrada com sucesso"
}
```

---

## 11. Guias de Uso

### 11.1 Para Administradores

#### Criação de Questionário
1. Definir título, descrição e versão
2. Criar subescalas (dimensões)
3. Adicionar perguntas a cada subescala
4. Definir tipo de resposta (escala Likert)
5. Ativar questionário

#### Agendamento de Avaliação
1. Selecionar questionário
2. Definir período (data início/fim)
3. Selecionar departamentos alvo
4. Configurar lembretes
5. Ativar agendamento

---

### 11.2 Para Gestores

#### Visualização de Relatórios
1. Acessar dashboard de relatórios
2. Filtrar por departamento/período
3. Identificar áreas de risco
4. Exportar relatórios (PDF/Excel)

#### Gestão de Alertas
1. Receber notificações de alertas críticos
2. Revisar descrição e contexto
3. Solicitar ação corretiva via IA
4. Atribuir responsável
5. Acompanhar evolução

---

### 11.3 Para Funcionários

#### Resposta a Questionários
1. Receber notificação de questionário disponível
2. Acessar link do questionário
3. Responder todas as perguntas
4. Revisar respostas
5. Submeter

#### Registro de Denúncia
1. Acessar portal de denúncias
2. Escolher tipo de denúncia
3. Preencher descrição detalhada
4. Optar por anonimato
5. Receber protocolo

---

## 12. Manutenção e Troubleshooting

### 12.1 Logs Importantes
- **Backend**: Logs em `logs/psysafe.log`
- **Banco de Dados**: Logs do PostgreSQL no Azure Portal
- **Erros de Autenticação**: Verificar expiração de tokens JWT

### 12.2 Problemas Comuns

**Erro: Token Expirado**
- **Solução**: Realizar novo login

**Erro: Questionário não carrega**
- **Verificar**: Status `ativo` no banco
- **Verificar**: Relacionamentos de perguntas/subescalas

**Erro: Estatísticas incorretas**
- **Solução**: Refresh das views materializadas (se aplicável)
```sql
REFRESH MATERIALIZED VIEW vw_stats_departamento;
```

---

## 13. Roadmap e Melhorias Futuras

### 13.1 Curto Prazo
- Dashboard interativo com gráficos D3.js
- Notificações push para alertas críticos
- Exportação de relatórios em PDF

### 13.2 Médio Prazo
- Análise preditiva de tendências (Machine Learning)
- Integração com sistemas de RH (APIs)
- App mobile nativo

### 13.3 Longo Prazo
- Benchmarking inter-organizacional
- Gamificação de participação
- Módulo de treinamentos e capacitações

---

## 14. Contatos e Suporte

**Equipe de Desenvolvimento**: dev@psysafe.com  
**Suporte Técnico**: suporte@psysafe.com  
**Documentação Online**: https://docs.psysafe.com

---

**Versão da Documentação**: 1.0  
**Data**: Novembro 2024  
**Última Atualização**: 27/11/2025

---
