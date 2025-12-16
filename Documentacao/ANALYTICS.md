#  Analytics e Relatórios - PsySafe

##  Índice

- [Metodologia PROEX](#metodologia-proex)
- [Indicadores Principais](#indicadores-principais)
- [Cálculos Estatísticos](#cálculos-estatísticos)
- [Views Analíticas](#views-analíticas)
- [Interpretação de Métricas](#interpretação-de-métricas)
- [Análise Temporal](#análise-temporal)
- [Heatmaps e Visualizações](#heatmaps-e-visualizações)

##  Metodologia PROEX

O PsySafe utiliza metodologia similar aos **relatórios PROEX** (Programa de Excelência em Gestão) para avaliação de riscos psicossociais no ambiente de trabalho.

### Princípios da Metodologia

1. **Avaliação Quantitativa**: Escalas padronizadas (Likert 1-5)
2. **Multidimensional**: Análise por subescalas (dimensões)
3. **Comparativa**: Benchmarking entre departamentos
4. **Temporal**: Monitoramento de tendências
5. **Acionável**: Geração automática de ações corretivas

### Escala de Resposta

```
1 = Nunca
2 = Raramente
3 = Às vezes
4 = Frequentemente
5 = Sempre
```

**Inversão para Risco**: Quanto menor a pontuação, maior o risco.

---

##  Indicadores Principais

### 1. IRP - Índice de Risco Psicossocial

**Definição**: Indicador global do nível de risco psicossocial no ambiente de trabalho.

**Fórmula**:
```sql
IRP = ((5 - AVG(valor_resposta)) / 4) * 100
```

**Interpretação**:
- **0-25**:  Baixo Risco (Verde)
- **26-50**:  Risco Médio (Amarelo)
- **51-75**:  Risco Alto (Laranja)
- **76-100**:  Risco Crítico (Vermelho)

**Exemplo de Cálculo**:
```sql
-- IRP de um usuário específico
SELECT 
    r.usuario_id,
    up.name,
    ROUND(((5 - AVG(ri.valor)) / 4) * 100, 2) as irp,
    CASE 
        WHEN ((5 - AVG(ri.valor)) / 4) * 100 < 25 THEN 'Baixo'
        WHEN ((5 - AVG(ri.valor)) / 4) * 100 < 50 THEN 'Médio'
        WHEN ((5 - AVG(ri.valor)) / 4) * 100 < 75 THEN 'Alto'
        ELSE 'Crítico'
    END as classificacao
FROM resposta r
JOIN resposta_item ri ON r.id = ri.resposta_id
JOIN user_profile up ON up.user_id::varchar = r.usuario_id
WHERE r.usuario_id = '550e8400-e29b-41d4-a716-446655440000'
GROUP BY r.usuario_id, up.name;
```

---

### 2. TCO - Taxa de Conformidade Organizacional

**Definição**: Percentual de respostas positivas (≥4) em relação ao total.

**Fórmula**:
```sql
TCO = (COUNT(respostas >= 4) / COUNT(total_respostas)) * 100
```

**Meta PROEX**: TCO ≥ 70%

**Exemplo de Cálculo**:
```sql
-- TCO por departamento
SELECT 
    up.departamento,
    COUNT(ri.valor) as total_respostas,
    COUNT(CASE WHEN ri.valor >= 4 THEN 1 END) as respostas_positivas,
    ROUND(
        (COUNT(CASE WHEN ri.valor >= 4 THEN 1 END)::float / 
         COUNT(ri.valor)::float) * 100, 
        2
    ) as tco
FROM user_profile up
JOIN resposta r ON up.user_id::varchar = r.usuario_id
JOIN resposta_item ri ON r.id = ri.resposta_id
GROUP BY up.departamento
ORDER BY tco DESC;
```

---

### 3. IVI - Índice de Variabilidade Interna

**Definição**: Mede a homogeneidade das respostas dentro de um departamento.

**Fórmula**:
```sql
IVI = STDDEV(média_por_usuário)
```

**Interpretação**:
- **IVI < 0.5**:  Homogêneo (boa consistência)
- **IVI 0.5-1.0**:  Moderado (requer atenção)
- **IVI > 1.0**:  Heterogêneo (investigar causas)

**Exemplo de Cálculo**:
```sql
-- IVI por departamento
SELECT 
    departamento,
    ROUND(STDDEV(media_usuario)::numeric, 2) as ivi,
    CASE 
        WHEN STDDEV(media_usuario) < 0.5 THEN 'Homogêneo'
        WHEN STDDEV(media_usuario) < 1.0 THEN 'Moderado'
        ELSE 'Heterogêneo'
    END as classificacao
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

---

##  Cálculos Estatísticos

### Análise por Subescala

**Objetivo**: Identificar dimensões específicas de risco.

```sql
SELECT 
    s.nome as subescala,
    up.departamento,
    COUNT(DISTINCT r.usuario_id) as n_respondentes,
    ROUND(AVG(ri.valor)::numeric, 2) as media,
    ROUND(STDDEV(ri.valor)::numeric, 2) as desvio_padrao,
    MIN(ri.valor) as minimo,
    MAX(ri.valor) as maximo,
    ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY ri.valor)::numeric, 2) as mediana,
    CASE 
        WHEN AVG(ri.valor) >= 4 THEN 'Baixo Risco'
        WHEN AVG(ri.valor) >= 3 THEN 'Médio Risco'
        WHEN AVG(ri.valor) >= 2 THEN 'Alto Risco'
        ELSE 'Risco Crítico'
    END as classificacao_risco
FROM subescala s
JOIN pergunta p ON s.id = p.subescala_id
JOIN resposta_item ri ON p.id = ri.pergunta_id
JOIN resposta r ON ri.resposta_id = r.id
JOIN user_profile up ON up.user_id::varchar = r.usuario_id
GROUP BY s.nome, up.departamento
ORDER BY media ASC;
```

### Distribuição de Respostas

```sql
-- Distribuição percentual por valor de resposta
SELECT 
    s.nome as subescala,
    ri.valor,
    COUNT(*) as frequencia,
    ROUND((COUNT(*)::float / SUM(COUNT(*)) OVER (PARTITION BY s.nome)) * 100, 2) as percentual
FROM subescala s
JOIN pergunta p ON s.id = p.subescala_id
JOIN resposta_item ri ON p.id = ri.pergunta_id
GROUP BY s.nome, ri.valor
ORDER BY s.nome, ri.valor;
```

### Teste de Normalidade (Kolmogorov-Smirnov)

```sql
-- Verificar se distribuição é normal
WITH stats AS (
    SELECT 
        AVG(ri.valor) as media,
        STDDEV(ri.valor) as desvio
    FROM resposta_item ri
)
SELECT 
    ri.valor,
    COUNT(*) as freq_observada,
    -- Frequência esperada (distribuição normal)
    ROUND(
        (SELECT COUNT(*) FROM resposta_item) * 
        (1 / (SELECT desvio FROM stats) * SQRT(2 * PI())) * 
        EXP(-POWER(ri.valor - (SELECT media FROM stats), 2) / 
            (2 * POWER((SELECT desvio FROM stats), 2)))
    ) as freq_esperada
FROM resposta_item ri
GROUP BY ri.valor
ORDER BY ri.valor;
```

---

##  Views Analíticas

### 1. vw_questionarios_ativos

```sql
CREATE OR REPLACE VIEW vw_questionarios_ativos AS
SELECT 
    q.id,
    q.titulo,
    q.descricao,
    q.versao,
    q.tempo_estimado,
    COUNT(DISTINCT p.id) as total_perguntas,
    COUNT(DISTINCT s.id) as total_subescalas,
    COUNT(DISTINCT r.id) as total_respostas,
    ROUND(
        (COUNT(DISTINCT r.id)::float / 
         NULLIF(
             (SELECT COUNT(*) FROM user_profile WHERE id_empresa = 1), 
             0
         )) * 100, 
         2
    ) as taxa_participacao,
    q.data_criacao
FROM questionario q
LEFT JOIN pergunta p ON p.questionario_id = q.id
LEFT JOIN subescala s ON s.questionario_id = q.id
LEFT JOIN resposta r ON r.questionario_id = q.id
WHERE q.ativo = true
GROUP BY q.id;
```

### 2. vw_analise_subescala

```sql
CREATE OR REPLACE VIEW vw_analise_subescala AS
SELECT 
    s.nome as subescala,
    s.descricao,
    s.questionario_id,
    COUNT(DISTINCT ri.id) as total_respostas,
    COUNT(DISTINCT r.usuario_id) as total_usuarios,
    ROUND(AVG(ri.valor)::numeric, 2) as pontuacao_media,
    MIN(ri.valor) as pontuacao_minima,
    MAX(ri.valor) as pontuacao_maxima,
    ROUND(STDDEV(ri.valor)::numeric, 2) as desvio_padrao,
    ROUND(
        (COUNT(CASE WHEN ri.valor >= 4 THEN 1 END)::float / 
         COUNT(ri.valor)::float) * 100, 
         2
    ) as percentual_positivo,
    CASE 
        WHEN AVG(ri.valor) >= 4 THEN 'Baixo'
        WHEN AVG(ri.valor) >= 3 THEN 'Médio'
        WHEN AVG(ri.valor) >= 2 THEN 'Alto'
        ELSE 'Crítico'
    END as nivel_risco
FROM subescala s
JOIN pergunta p ON p.subescala_id = s.id
JOIN resposta_item ri ON ri.pergunta_id = p.id
JOIN resposta r ON r.id = ri.resposta_id
GROUP BY s.id, s.nome, s.descricao, s.questionario_id;
```

### 3. vw_stats_departamento

```sql
CREATE OR REPLACE VIEW vw_stats_departamento AS
SELECT 
    up.departamento,
    COUNT(DISTINCT r.id) as total_avaliacoes,
    COUNT(DISTINCT r.usuario_id) as total_usuarios,
    ROUND(((5 - AVG(ri.valor)) / 4) * 100, 2) as media_risco,
    ROUND(
        (COUNT(CASE WHEN ri.valor >= 4 THEN 1 END)::float / 
         COUNT(ri.valor)::float) * 100, 
         2
    ) as nivel_conformidade,
    -- Classificação de usuários por risco
    COUNT(DISTINCT CASE WHEN user_avg.avg_val < 2 THEN r.usuario_id END) as usuarios_risco_critico,
    COUNT(DISTINCT CASE WHEN user_avg.avg_val >= 2 AND user_avg.avg_val < 3 THEN r.usuario_id END) as usuarios_risco_alto,
    COUNT(DISTINCT CASE WHEN user_avg.avg_val >= 3 AND user_avg.avg_val < 4 THEN r.usuario_id END) as usuarios_risco_medio,
    COUNT(DISTINCT CASE WHEN user_avg.avg_val >= 4 THEN r.usuario_id END) as usuarios_risco_baixo
FROM user_profile up
JOIN resposta r ON up.user_id::varchar = r.usuario_id
JOIN resposta_item ri ON r.id = ri.resposta_id
LEFT JOIN (
    SELECT 
        r2.usuario_id,
        AVG(ri2.valor) as avg_val
    FROM resposta r2
    JOIN resposta_item ri2 ON r2.id = ri2.resposta_id
    GROUP BY r2.usuario_id
) user_avg ON user_avg.usuario_id = r.usuario_id
GROUP BY up.departamento;
```

### 4. vw_evolucao_mensal

```sql
CREATE OR REPLACE VIEW vw_evolucao_mensal AS
SELECT 
    DATE_TRUNC('month', r.data_resposta) as mes,
    COUNT(DISTINCT r.id) as total_avaliacoes,
    COUNT(DISTINCT r.usuario_id) as usuarios_responderam,
    ROUND(((5 - AVG(ri.valor)) / 4) * 100, 2) as media_risco,
    ROUND(
        (COUNT(CASE WHEN ri.valor >= 4 THEN 1 END)::float / 
         COUNT(ri.valor)::float) * 100, 
         2
    ) as nivel_conformidade,
    ROUND(AVG(ri.valor)::numeric, 2) as pontuacao_media
FROM resposta r
JOIN resposta_item ri ON r.id = ri.resposta_id
WHERE r.data_resposta >= NOW() - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', r.data_resposta)
ORDER BY mes;
```

### 5. vw_usuarios_pendentes

```sql
CREATE OR REPLACE VIEW vw_usuarios_pendentes AS
SELECT 
    up.user_id,
    up.name,
    up.email,
    up.departamento,
    up.cargo,
    COUNT(DISTINCT a.id) as questionarios_pendentes,
    STRING_AGG(DISTINCT q.titulo, ', ') as questionarios
FROM user_profile up
CROSS JOIN agendamento a
JOIN questionario q ON a.questionario_id = q.id
LEFT JOIN resposta r ON r.usuario_id = up.user_id::varchar 
    AND r.questionario_id = a.questionario_id
WHERE a.ativo = true
    AND a.data_fim > NOW()
    AND r.id IS NULL
GROUP BY up.user_id, up.name, up.email, up.departamento, up.cargo
HAVING COUNT(DISTINCT a.id) > 0;
```

---

##  Interpretação de Métricas

### Classificação de Risco por IRP

| IRP | Classificação | Cor | Ação Requerida |
|-----|---------------|-----|----------------|
| 0-25 | Baixo Risco | 🟢 Verde | Manutenção |
| 26-50 | Risco Médio | 🟡 Amarelo | Monitoramento |
| 51-75 | Risco Alto | 🟠 Laranja | Intervenção |
| 76-100 | Risco Crítico | 🔴 Vermelho | Ação Imediata |

### Benchmarking Departamental

```sql
-- Ranking de departamentos por risco
SELECT 
    departamento,
    media_risco,
    nivel_conformidade,
    RANK() OVER (ORDER BY media_risco DESC) as rank_risco,
    CASE 
        WHEN media_risco > 
             (SELECT AVG(media_risco) FROM vw_stats_departamento) 
        THEN 'Acima da Média'
        ELSE 'Abaixo da Média'
    END as comparacao_geral
FROM vw_stats_departamento
ORDER BY media_risco DESC;
```

### Detecção de Outliers

```sql
-- Usuários outliers (muito acima ou abaixo da média)
WITH stats AS (
    SELECT 
        AVG(avg_user) as media_geral,
        STDDEV(avg_user) as desvio_geral
    FROM (
        SELECT 
            r.usuario_id,
            AVG(ri.valor) as avg_user
        FROM resposta r
        JOIN resposta_item ri ON r.id = ri.resposta_id
        GROUP BY r.usuario_id
    ) user_stats
)
SELECT 
    up.name,
    up.departamento,
    ROUND(AVG(ri.valor)::numeric, 2) as media_usuario,
    ROUND((SELECT media_geral FROM stats)::numeric, 2) as media_geral,
    CASE 
        WHEN AVG(ri.valor) < (SELECT media_geral - 2 * desvio_geral FROM stats) 
        THEN 'Risco Muito Alto (Outlier)'
        WHEN AVG(ri.valor) > (SELECT media_geral + 2 * desvio_geral FROM stats) 
        THEN 'Muito Acima da Média (Outlier)'
        ELSE 'Normal'
    END as classificacao
FROM resposta r
JOIN resposta_item ri ON r.id = ri.resposta_id
JOIN user_profile up ON up.user_id::varchar = r.usuario_id
GROUP BY up.name, up.departamento
HAVING AVG(ri.valor) < (SELECT media_geral - 2 * desvio_geral FROM stats)
    OR AVG(ri.valor) > (SELECT media_geral + 2 * desvio_geral FROM stats);
```

---

##  Análise Temporal

### Tendências (MoM - Month over Month)

```sql
WITH dados_mensais AS (
    SELECT 
        mes,
        media_risco,
        LAG(media_risco) OVER (ORDER BY mes) as mes_anterior
    FROM vw_evolucao_mensal
)
SELECT 
    TO_CHAR(mes, 'YYYY-MM') as mes_ref,
    media_risco,
    mes_anterior,
    ROUND(media_risco - mes_anterior, 2) as variacao_absoluta,
    ROUND(
        ((media_risco - mes_anterior) / NULLIF(mes_anterior, 0)) * 100, 
        2
    ) as variacao_percentual,
    CASE 
        WHEN media_risco > mes_anterior THEN ' Piora'
        WHEN media_risco < mes_anterior THEN ' Melhora'
        ELSE ' Estável'
    END as tendencia
FROM dados_mensais
WHERE mes_anterior IS NOT NULL
ORDER BY mes DESC;
```

### Sazonalidade

```sql
-- Identificar padrões sazonais
SELECT 
    EXTRACT(MONTH FROM mes) as mes_numero,
    TO_CHAR(mes, 'Month') as mes_nome,
    ROUND(AVG(media_risco)::numeric, 2) as media_mes,
    COUNT(*) as n_ocorrencias
FROM vw_evolucao_mensal
GROUP BY EXTRACT(MONTH FROM mes), TO_CHAR(mes, 'Month')
ORDER BY mes_numero;
```

### Previsão Simples (Média Móvel)

```sql
-- Média móvel de 3 meses para suavizar flutuações
SELECT 
    mes,
    media_risco as valor_real,
    ROUND(
        AVG(media_risco) OVER (
            ORDER BY mes 
            ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
        )::numeric, 
        2
    ) as media_movel_3m
FROM vw_evolucao_mensal
ORDER BY mes;
```

---

##  Heatmaps e Visualizações

### Heatmap: Departamento x Subescala

```sql
-- Matriz de risco: Departamentos (linhas) x Subescalas (colunas)
SELECT 
    up.departamento,
    s.nome as subescala,
    ROUND(AVG(ri.valor)::numeric, 2) as pontuacao,
    CASE 
        WHEN AVG(ri.valor) >= 4 THEN '🟢'
        WHEN AVG(ri.valor) >= 3 THEN '🟡'
        WHEN AVG(ri.valor) >= 2 THEN '🟠'
        ELSE '🔴'
    END as nivel_risco
FROM user_profile up
JOIN resposta r ON up.user_id::varchar = r.usuario_id
JOIN resposta_item ri ON r.id = ri.resposta_id
JOIN pergunta p ON ri.pergunta_id = p.id
JOIN subescala s ON p.subescala_id = s.id
GROUP BY up.departamento, s.nome
ORDER BY up.departamento, s.nome;
```

### Gráfico Radar (Dados para Chart.js)

```sql
-- Dados para gráfico radar por departamento
SELECT 
    json_object_agg(
        s.nome,
        ROUND(AVG(ri.valor)::numeric, 2)
    ) as radar_data
FROM user_profile up
JOIN resposta r ON up.user_id::varchar = r.usuario_id
JOIN resposta_item ri ON r.id = ri.resposta_id
JOIN pergunta p ON ri.pergunta_id = p.id
JOIN subescala s ON p.subescala_id = s.id
WHERE up.departamento = 'TI'
GROUP BY up.departamento;

-- Resultado exemplo:
-- {
--   "Assédio Moral": 4.2,
--   "Clima Organizacional": 3.8,
--   "Carga de Trabalho": 3.1,
--   "Autonomia": 3.9
-- }
```

---

##  Casos de Uso Práticos

### 1. Identificar Departamento Prioritário

```sql
SELECT 
    departamento,
    media_risco,
    usuarios_risco_critico + usuarios_risco_alto as usuarios_atencao,
    nivel_conformidade
FROM vw_stats_departamento
WHERE media_risco > 50  -- Risco alto ou crítico
ORDER BY media_risco DESC, usuarios_atencao DESC
LIMIT 3;
```

### 2. Monitorar Evolução Pós-Intervenção

```sql
-- Comparar antes e depois de uma ação corretiva
WITH antes AS (
    SELECT 
        up.departamento,
        AVG(ri.valor) as media_antes
    FROM resposta r
    JOIN resposta_item ri ON r.id = ri.resposta_id
    JOIN user_profile up ON up.user_id::varchar = r.usuario_id
    WHERE r.data_resposta < '2024-06-01'  -- Data da intervenção
        AND up.departamento = 'TI'
    GROUP BY up.departamento
),
depois AS (
    SELECT 
        up.departamento,
        AVG(ri.valor) as media_depois
    FROM resposta r
    JOIN resposta_item ri ON r.id = ri.resposta_id
    JOIN user_profile up ON up.user_id::varchar = r.usuario_id
    WHERE r.data_resposta >= '2024-06-01'
        AND up.departamento = 'TI'
    GROUP BY up.departamento
)
SELECT 
    a.departamento,
    ROUND(a.media_antes::numeric, 2) as antes,
    ROUND(d.media_depois::numeric, 2) as depois,
    ROUND((d.media_depois - a.media_antes)::numeric, 2) as melhoria,
    ROUND(((d.media_depois - a.media_antes) / a.media_antes * 100)::numeric, 2) as pct_melhoria
FROM antes a
JOIN depois d ON a.departamento = d.departamento;
```

### 3. Relatório Executivo

```sql
-- Dashboard executivo completo
SELECT 
    (SELECT COUNT(*) FROM user_profile) as total_funcionarios,
    (SELECT COUNT(DISTINCT usuario_id) FROM resposta) as funcionarios_avaliados,
    ROUND(
        (SELECT AVG(media_risco) FROM vw_stats_departamento)::numeric, 
        2
    ) as irp_medio_empresa,
    (SELECT departamento FROM vw_stats_departamento 
     ORDER BY media_risco DESC LIMIT 1) as dept_maior_risco,
    (SELECT departamento FROM vw_stats_departamento 
     ORDER BY media_risco ASC LIMIT 1) as dept_menor_risco,
    (SELECT COUNT(*) FROM alertas WHERE status = 'aberto') as alertas_abertos,
    (SELECT COUNT(*) FROM acao_corretiva WHERE status != 'concluida') as acoes_pendentes;
```

---

## Referências

- Metodologia PROEX
- NR-17 - Ergonomia
- ISO 45003 - Gestão de Saúde e Segurança Psicológica
- Escalas Likert em Pesquisa Quantitativa

---

**Próximos Passos**:
- [API-ENDPOINTS.md](API-ENDPOINTS.md) - Consumir analytics via API
- [DATABASE.md](DATABASE.md) - Estrutura das tabelas
- [AZURE-INTEGRATION.md](AZURE-INTEGRATION.md) - IA para análise preditiva

---

**Última Atualização**: Novembro 2024
