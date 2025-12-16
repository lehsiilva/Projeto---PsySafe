# Modelo de Dados - PsySafe

## Índice

- [Visão Geral](#visão-geral)
- [Diagrama ER](#diagrama-er)
- [Tabelas Principais](#tabelas-principais)
- [Views Analíticas](#views-analíticas)
- [Triggers e Procedures](#triggers-e-procedures)
- [Índices e Performance](#índices-e-performance)

## Visão Geral

O banco de dados PostgreSQL do PsySafe é organizado em **7 módulos principais**:

1. **Autenticação e Usuários**: Gestão de contas e perfis
2. **Empresas e Equipes**: Estrutura organizacional
3. **Questionários**: Estrutura de avaliações
4. **Respostas**: Dados coletados
5. **Denúncias**: Sistema de reports
6. **Alertas e Ações**: Sistema de monitoramento
7. **Analytics**: Views para relatórios

## 📊 Diagrama ER

Ver arquivo completo: `../Artefatos/DER PsySafe (4).pdf`

### Relacionamentos Principais

```
auth_user ─────▶ user_profile ─────▶ empresa
    │                                     │
    │                                     ├─────▶ equipe
    │                                     │          │
    │                                     │          └─────▶ membro_equipe
    │                                     │
    └─────▶ resposta ───────▶ questionario
                │                    │
                │                    ├─────▶ subescala
                │                    │
                │                    └─────▶ pergunta
                │
                └─────▶ resposta_item
```

## 📑 Tabelas Principais

### 1. Autenticação e Usuários

#### `auth_user`
Tabela principal de autenticação.

```sql
CREATE TABLE auth_user (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50),  -- 'admin', 'gestor', 'funcionario'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_login TIMESTAMP
);

CREATE INDEX idx_auth_user_email ON auth_user(email);
CREATE INDEX idx_auth_user_role ON auth_user(role);
```

**Roles**:
- `admin`: Acesso total
- `gestor`: Gestão de equipes
- `funcionario`: Respostas e visualização própria

#### `user_profile`
Perfil detalhado do usuário.

```sql
CREATE TABLE user_profile (
    user_id UUID PRIMARY KEY REFERENCES auth_user(id) ON DELETE CASCADE,
    name VARCHAR(255),
    email VARCHAR(255),
    role VARCHAR(100),  -- Cargo
    departamento VARCHAR(100),
    equipe VARCHAR(100),
    cargo VARCHAR(100),
    telefone VARCHAR(20),
    id_empresa INTEGER REFERENCES empresa(id_empresa),
    id_equipe INTEGER REFERENCES equipe(id_equipe),
    data_admissao DATE,
    ultimo_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_profile_departamento ON user_profile(departamento);
CREATE INDEX idx_user_profile_equipe ON user_profile(id_equipe);
```

---

### 2. Empresas e Estrutura Organizacional

#### `empresa`

```sql
CREATE TABLE empresa (
    id_empresa SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    endereco VARCHAR(500) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    setor VARCHAR(100) NOT NULL,
    numero_funcionarios INTEGER NOT NULL,
    data_fundacao DATE NOT NULL,
    responsavel_rh VARCHAR(255) NOT NULL,
    plano_ativo VARCHAR(50) NOT NULL,
    validade_plano DATE NOT NULL
);
```

#### `equipe`

```sql
CREATE TABLE equipe (
    id_equipe SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    empresa_id INTEGER REFERENCES empresa(id_empresa)
);
```

#### `membro_equipe`

```sql
CREATE TABLE membro_equipe (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    id_equipe INTEGER REFERENCES equipe(id_equipe) ON DELETE CASCADE
);
```

---

### 3. Sistema de Questionários

#### `questionario`

```sql
CREATE TABLE questionario (
    id SERIAL PRIMARY KEY,
    titulo TEXT NOT NULL,
    descricao TEXT,
    ativo BOOLEAN DEFAULT true,
    data_encerramento TIMESTAMP,
    versao VARCHAR(10),
    tempo_estimado TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `subescala`
Dimensões do questionário (ex: Assédio Moral, Clima Organizacional).

```sql
CREATE TABLE subescala (
    id SERIAL PRIMARY KEY,
    questionario_id INTEGER REFERENCES questionario(id),
    nome TEXT NOT NULL,
    descricao TEXT,
    ordem INTEGER,
    tipo_resposta_id INTEGER REFERENCES tipo_resposta(id)
);
```

#### `pergunta`

```sql
CREATE TABLE pergunta (
    id SERIAL PRIMARY KEY,
    questionario_id INTEGER REFERENCES questionario(id),
    numero INTEGER,
    conteudo TEXT,
    subescala_id INTEGER REFERENCES subescala(id),
    id_subescala INTEGER REFERENCES subescala(id)  -- FK alternativa
);

CREATE INDEX idx_pergunta_subescala ON pergunta(subescala_id);
```

#### `tipo_resposta`
Define escalas (ex: Likert 1-5).

```sql
CREATE TABLE tipo_resposta (
    id SERIAL PRIMARY KEY,
    nome TEXT,
    opcao1 TEXT,  -- "Nunca"
    opcao2 TEXT,  -- "Raramente"
    opcao3 TEXT,  -- "Às vezes"
    opcao4 TEXT,  -- "Frequentemente"
    opcao5 TEXT   -- "Sempre"
);
```

---

### 4. Agendamentos

#### `agendamento`

```sql
CREATE TABLE agendamento (
    id SERIAL PRIMARY KEY,
    questionario_id INTEGER REFERENCES questionario(id),
    gestor_id INTEGER,
    versao VARCHAR(10),
    data_inicio TIMESTAMP,
    data_fim TIMESTAMP,
    departamentos TEXT[],  -- Array de departamentos
    ativo BOOLEAN DEFAULT true,
    total_participantes INTEGER DEFAULT 0,
    total_respostas INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_agendamento_ativo ON agendamento(ativo) WHERE ativo = true;
CREATE INDEX idx_agendamento_datas ON agendamento(data_inicio, data_fim);
```

---

### 5. Respostas

#### `resposta`
Resposta principal do usuário.

```sql
CREATE TABLE resposta (
    id VARCHAR(255) PRIMARY KEY,  -- UUID gerado pelo backend
    questionario_id INTEGER REFERENCES questionario(id),
    usuario_id VARCHAR(255),  -- UUID do usuário
    data_resposta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tempo_gasto INTEGER  -- em segundos
);

CREATE INDEX idx_resposta_usuario ON resposta(usuario_id);
CREATE INDEX idx_resposta_questionario ON resposta(questionario_id);
CREATE INDEX idx_resposta_data ON resposta(data_resposta);
```

#### `resposta_item`
Item individual de resposta (uma linha por pergunta).

```sql
CREATE TABLE resposta_item (
    id SERIAL PRIMARY KEY,
    resposta_id VARCHAR(255) REFERENCES resposta(id) ON DELETE CASCADE,
    pergunta_id INTEGER REFERENCES pergunta(id),
    valor INTEGER CHECK (valor BETWEEN 1 AND 5)
);

CREATE INDEX idx_resposta_item_resposta ON resposta_item(resposta_id);
CREATE INDEX idx_resposta_item_pergunta ON resposta_item(pergunta_id);
```

---

### 6. Sistema de Denúncias

#### `denuncias`

```sql
CREATE TABLE denuncias (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    data DATE NOT NULL,
    resolvido BOOLEAN DEFAULT false,
    anonima BOOLEAN DEFAULT false,
    denunciante VARCHAR(255),  -- NULL se anônima
    denunciado VARCHAR(255) NOT NULL,
    id_empresa INTEGER REFERENCES empresa(id_empresa)
);

CREATE INDEX idx_denuncias_tipo ON denuncias(tipo);
CREATE INDEX idx_denuncias_resolvido ON denuncias(resolvido) WHERE resolvido = false;
```

**Tipos de Denúncia**:
- `assedio_moral`
- `assedio_sexual`
- `discriminacao`
- `condicoes_trabalho`
- `violacao_politicas`
- `outros`

---

### 7. Alertas e Ações Corretivas

#### `alertas`

```sql
CREATE TABLE alertas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    tipo VARCHAR(100),
    departamento VARCHAR(100),
    nivel VARCHAR(50) CHECK (nivel IN ('critico', 'alto', 'medio', 'baixo')),
    status VARCHAR(50) CHECK (status IN ('aberto', 'em_andamento', 'resolvido')),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_resolucao TIMESTAMP,
    acao_corretiva_id UUID REFERENCES acao_corretiva(id)
);

CREATE INDEX idx_alertas_nivel ON alertas(nivel);
CREATE INDEX idx_alertas_status ON alertas(status) WHERE status != 'resolvido';
```

#### `acao_corretiva`

```sql
CREATE TABLE acao_corretiva (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(500) NOT NULL,
    descricao TEXT NOT NULL,
    departamento VARCHAR(100) NOT NULL,
    nivel_risco VARCHAR(50) NOT NULL,
    prioridade VARCHAR(50) NOT NULL CHECK (prioridade IN ('alta', 'media', 'baixa')),
    responsavel VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_prazo TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pendente' 
        CHECK (status IN ('pendente', 'em_progresso', 'concluida')),
    medidas_sugeridas TEXT NOT NULL,  -- Gerado pela IA
    analise_detalhada TEXT,
    impacto_esperado TEXT,
    recursos_necessarios TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_acao_status ON acao_corretiva(status);
CREATE INDEX idx_acao_prioridade ON acao_corretiva(prioridade);
```

---

## Views Analíticas

### `vw_questionarios_ativos`

```sql
CREATE VIEW vw_questionarios_ativos AS
SELECT 
    q.id,
    q.titulo,
    q.descricao,
    q.versao,
    q.tempo_estimado,
    COUNT(DISTINCT p.id) as total_perguntas,
    COUNT(DISTINCT s.id) as total_subescalas,
    COUNT(DISTINCT r.id) as total_respostas,
    q.data_criacao
FROM questionario q
LEFT JOIN pergunta p ON p.questionario_id = q.id
LEFT JOIN subescala s ON s.questionario_id = q.id
LEFT JOIN resposta r ON r.questionario_id = q.id
WHERE q.ativo = true
GROUP BY q.id;
```

### `vw_analise_subescala`

```sql
CREATE VIEW vw_analise_subescala AS
SELECT 
    s.nome as subescala,
    s.descricao,
    s.questionario_id,
    COUNT(DISTINCT ri.id) as total_respostas,
    ROUND(AVG(ri.valor)::numeric, 2) as pontuacao_media,
    MIN(ri.valor) as pontuacao_minima,
    MAX(ri.valor) as pontuacao_maxima,
    ROUND(STDDEV(ri.valor)::numeric, 2) as desvio_padrao
FROM subescala s
JOIN pergunta p ON p.subescala_id = s.id
JOIN resposta_item ri ON ri.pergunta_id = p.id
GROUP BY s.id, s.nome, s.descricao, s.questionario_id;
```

**Interpretação**:
- **Pontuação 4-5**: Situação positiva (baixo risco)
- **Pontuação 3**: Atenção necessária
- **Pontuação 1-2**: Risco alto, intervenção necessária

### `vw_stats_departamento`

```sql
CREATE VIEW vw_stats_departamento AS
SELECT 
    up.departamento,
    COUNT(DISTINCT r.id) as total_avaliacoes,
    COUNT(DISTINCT r.usuario_id) as total_usuarios,
    ROUND(((5 - AVG(ri.valor)) / 4) * 100, 2) as media_risco,
    ROUND((COUNT(CASE WHEN ri.valor >= 4 THEN 1 END)::float / 
           COUNT(ri.valor)::float) * 100, 2) as nivel_conformidade,
    SUM(CASE WHEN avg_user < 2 THEN 1 ELSE 0 END) as usuarios_risco_critico,
    SUM(CASE WHEN avg_user >= 2 AND avg_user < 3 THEN 1 ELSE 0 END) as usuarios_risco_alto,
    SUM(CASE WHEN avg_user >= 3 AND avg_user < 4 THEN 1 ELSE 0 END) as usuarios_risco_medio,
    SUM(CASE WHEN avg_user >= 4 THEN 1 ELSE 0 END) as usuarios_risco_baixo
FROM user_profile up
JOIN resposta r ON up.user_id::varchar = r.usuario_id
JOIN resposta_item ri ON r.id = ri.resposta_id
LEFT JOIN (
    SELECT 
        r2.usuario_id,
        AVG(ri2.valor) as avg_user
    FROM resposta r2
    JOIN resposta_item ri2 ON r2.id = ri2.resposta_id
    GROUP BY r2.usuario_id
) user_avg ON user_avg.usuario_id = r.usuario_id
GROUP BY up.departamento;
```

**Fórmulas**:
- **IRP** (Índice de Risco Psicossocial): `((5 - AVG(valor)) / 4) * 100`
- **TCO** (Taxa de Conformidade): `(respostas >= 4 / total) * 100`

### `vw_evolucao_mensal`

```sql
CREATE VIEW vw_evolucao_mensal AS
SELECT 
    DATE_TRUNC('month', r.data_resposta) as mes,
    COUNT(DISTINCT r.id) as total_avaliacoes,
    ROUND(((5 - AVG(ri.valor)) / 4) * 100, 2) as media_risco,
    ROUND((COUNT(CASE WHEN ri.valor >= 4 THEN 1 END)::float / 
           COUNT(ri.valor)::float) * 100, 2) as nivel_conformidade,
    COUNT(DISTINCT r.usuario_id) as usuarios_responderam
FROM resposta r
JOIN resposta_item ri ON r.id = ri.resposta_id
WHERE r.data_resposta >= NOW() - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', r.data_resposta)
ORDER BY mes;
```

---

## Triggers e Procedures

### Trigger: Alerta de Risco Crítico

```sql
CREATE OR REPLACE FUNCTION verificar_risco_critico()
RETURNS TRIGGER AS $$
DECLARE
    irp_usuario NUMERIC;
    dept VARCHAR;
    user_name VARCHAR;
BEGIN
    -- Calcular IRP do usuário
    SELECT 
        ((5 - AVG(ri.valor)) / 4) * 100,
        up.departamento,
        up.name
    INTO irp_usuario, dept, user_name
    FROM resposta_item ri
    JOIN resposta r ON ri.resposta_id = r.id
    JOIN user_profile up ON up.user_id::varchar = r.usuario_id
    WHERE r.id = NEW.resposta_id
    GROUP BY up.departamento, up.name;
    
    -- Se IRP > 75, criar alerta
    IF irp_usuario > 75 THEN
        INSERT INTO alertas (
            titulo, descricao, tipo, 
            departamento, nivel, status
        ) VALUES (
            'Risco Crítico Detectado',
            format('Usuário %s com IRP de %.2f%% necessita intervenção imediata.', 
                   user_name, irp_usuario),
            'risco_psicossocial',
            dept,
            'critico',
            'aberto'
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

### Procedure: Calcular Estatísticas

```sql
CREATE OR REPLACE FUNCTION calcular_estatisticas_departamento(dept_name VARCHAR)
RETURNS TABLE (
    departamento VARCHAR,
    total_respostas BIGINT,
    media_risco NUMERIC,
    conformidade NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        up.departamento,
        COUNT(DISTINCT r.id),
        ROUND(((5 - AVG(ri.valor)) / 4) * 100, 2),
        ROUND((COUNT(CASE WHEN ri.valor >= 4 THEN 1 END)::float / 
               COUNT(ri.valor)::float) * 100, 2)
    FROM user_profile up
    JOIN resposta r ON up.user_id::varchar = r.usuario_id
    JOIN resposta_item ri ON r.id = ri.resposta_id
    WHERE up.departamento = dept_name
    GROUP BY up.departamento;
END;
$$ LANGUAGE plpgsql;
```

---

## Índices e Performance

### Índices Críticos

```sql
-- Autenticação (lookup frequente)
CREATE INDEX idx_auth_user_email ON auth_user(email);

-- Respostas (join frequente)
CREATE INDEX idx_resposta_usuario ON resposta(usuario_id);
CREATE INDEX idx_resposta_questionario ON resposta(questionario_id);

-- Respostas Item (agregações)
CREATE INDEX idx_resposta_item_valor ON resposta_item(valor);

-- Alertas (filtros frequentes)
CREATE INDEX idx_alertas_status_nivel ON alertas(status, nivel) 
    WHERE status != 'resolvido';

-- Denúncias (busca por tipo)
CREATE INDEX idx_denuncias_tipo_resolvido ON denuncias(tipo, resolvido);
```

### Queries Otimizadas

**Análise de Performance**:

```sql
-- Ver queries lentas
SELECT 
    query, 
    calls, 
    total_time, 
    mean_time
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;

-- Explicar query
EXPLAIN ANALYZE
SELECT * FROM vw_stats_departamento WHERE departamento = 'TI';
```

---

## Manutenção

### Backup

```bash
# Backup completo
pg_dump -U postgres -h localhost -d psysafe > backup_$(date +%Y%m%d).sql

# Backup apenas dados
pg_dump -U postgres -h localhost -d psysafe --data-only > data_backup.sql

# Backup apenas schema
pg_dump -U postgres -h localhost -d psysafe --schema-only > schema_backup.sql
```

### Restore

```bash
psql -U postgres -h localhost -d psysafe < backup_20241127.sql
```

### Vacuum e Analyze

```sql
-- Liberar espaço e atualizar estatísticas
VACUUM ANALYZE resposta;
VACUUM ANALYZE resposta_item;

-- Vacuum completo (mais pesado)
VACUUM FULL;
```

---

Para mais detalhes sobre:
- **API**: Ver [API-ENDPOINTS.md](API-ENDPOINTS.md)
- **Analytics**: Ver [ANALYTICS.md](ANALYTICS.md)
- **Azure**: Ver [AZURE-INTEGRATION.md](AZURE-INTEGRATION.md)

---

**Última Atualização**: Novembro 2024
