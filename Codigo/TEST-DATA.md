# Dados de Teste - PsySafe

Guia para popular o banco de dados com dados de teste para desenvolvimento.

## Índice

- [Dados Já Incluídos](#dados-já-incluídos)
- [Usuários de Teste](#usuários-de-teste)
- [Popular Dados Manualmente](#popular-dados-manualmente)
- [Scripts SQL de Teste](#scripts-sql-de-teste)
- [API de Desenvolvimento](#api-de-desenvolvimento)

## Dados Já Incluídos

Se você executou o script `Artefatos/BD.sql`, o banco já foi criado com a estrutura completa de tabelas. No entanto, pode não conter dados de teste.

### Estrutura do Banco

O script cria as seguintes tabelas:

- `empresa` - Informações da empresa
- `usuario` - Usuários do sistema
- `questionario` - Modelos de questionários
- `pergunta` - Perguntas dos questionários
- `subescala` - Subescalas psicométricas
- `questionario_pergunta` - Relação questionário-perguntas
- `questionario_agendamento` - Questionários agendados
- `resposta` - Respostas dos funcionários
- `denuncia` - Denúncias registradas
- `acao_corretiva` - Ações corretivas planejadas

## Usuários de Teste

### Criação Manual de Usuários

Se o banco não tem usuários, você pode criá-los através da API de registro ou manualmente:

#### Método 1: Via API (Recomendado)

```bash
# 1. Inicie o backend
java -jar target/psysafe-1.0-SNAPSHOT-exec.jar

# 2. Registre usuários via API
curl -X POST http://localhost:4567/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Administrador",
    "email": "admin@psysafe.com",
    "password": "admin123",
    "role": "ADMIN"
  }'
```

#### Método 2: Via SQL

Conecte-se ao banco e execute:

```sql
-- Conectar ao banco
psql -U postgres -d psysafe

-- Inserir empresa
INSERT INTO empresa (nome, cnpj, endereco, telefone, email)
VALUES (
  'PsySafe Demo Company',
  '12.345.678/0001-90',
  'Rua Exemplo, 123 - São Paulo/SP',
  '(11) 98765-4321',
  'contato@psysafe.com'
);

-- Inserir usuários (senhas são hashes bcrypt de 'senha123')
INSERT INTO usuario (nome, email, senha, role, empresa_id, ativo)
VALUES 
  -- Admin (senha: admin123)
  (
    'Administrador Sistema',
    'admin@psysafe.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'ADMIN',
    1,
    true
  ),
  -- Gestor (senha: gestor123)
  (
    'Carlos Silva',
    'gestor@psysafe.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'GESTOR',
    1,
    true
  ),
  -- Funcionário (senha: func123)
  (
    'Maria Santos',
    'funcionario@psysafe.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'FUNCIONARIO',
    1,
    true
  );
```

### Tabela de Usuários de Teste

| Nome | Email | Senha | Role | Descrição |
|------|-------|-------|------|-----------|
| Administrador Sistema | admin@psysafe.com | admin123 | ADMIN | Acesso total ao sistema |
| Carlos Silva | gestor@psysafe.com | gestor123 | GESTOR | Gerencia equipes e visualiza estatísticas |
| Maria Santos | funcionario@psysafe.com | func123 | FUNCIONARIO | Responde questionários |

## Popular Dados Manualmente

### 1. Dados de Empresa

```sql
-- Atualizar dados da empresa
UPDATE empresa 
SET 
  nome = 'Tech Innovation Ltda',
  cnpj = '98.765.432/0001-10',
  endereco = 'Av. Paulista, 1000 - São Paulo/SP',
  telefone = '(11) 3000-1000',
  email = 'contato@techinnovation.com.br',
  logo = NULL
WHERE id = 1;
```

### 2. Questionários e Perguntas

```sql
-- Inserir questionário de exemplo
INSERT INTO questionario (titulo, descricao, ativo)
VALUES (
  'Avaliação de Clima Organizacional',
  'Questionário para avaliação do clima e bem-estar no trabalho',
  true
);

-- Inserir subescalas
INSERT INTO subescala (nome, descricao)
VALUES 
  ('Carga de Trabalho', 'Avalia percepção de sobrecarga'),
  ('Relacionamento', 'Avalia qualidade dos relacionamentos'),
  ('Autonomia', 'Avalia nível de autonomia no trabalho'),
  ('Reconhecimento', 'Avalia percepção de reconhecimento');

-- Inserir perguntas
INSERT INTO pergunta (texto, subescala_id, tipo_resposta)
VALUES 
  ('Sinto que tenho carga de trabalho adequada', 1, 'ESCALA_LIKERT'),
  ('Meu trabalho é valorizado pela equipe', 2, 'ESCALA_LIKERT'),
  ('Tenho autonomia para tomar decisões', 3, 'ESCALA_LIKERT'),
  ('Recebo reconhecimento pelo meu trabalho', 4, 'ESCALA_LIKERT');

-- Associar perguntas ao questionário
INSERT INTO questionario_pergunta (questionario_id, pergunta_id, ordem)
SELECT 
  1 as questionario_id,
  id as pergunta_id,
  ROW_NUMBER() OVER (ORDER BY id) as ordem
FROM pergunta;
```

### 3. Agendamentos de Teste

```sql
-- Agendar questionário para todos
INSERT INTO questionario_agendamento (
  questionario_id,
  titulo,
  descricao,
  data_inicio,
  data_fim,
  status,
  criado_por
)
VALUES (
  1,
  'Avaliação Q1 2024',
  'Avaliação trimestral do clima organizacional',
  NOW(),
  NOW() + INTERVAL '30 days',
  'ATIVO',
  2  -- ID do gestor
);
```

### 4. Respostas de Exemplo

```sql
-- Resposta de um funcionário
INSERT INTO resposta (
  agendamento_id,
  usuario_id,
  pergunta_id,
  valor_numerico,
  data_resposta
)
SELECT 
  1 as agendamento_id,
  3 as usuario_id,  -- ID do funcionário
  p.id as pergunta_id,
  FLOOR(RANDOM() * 5 + 1) as valor_numerico,  -- Valor entre 1 e 5
  NOW() as data_resposta
FROM pergunta p
WHERE EXISTS (
  SELECT 1 FROM questionario_pergunta qp
  WHERE qp.pergunta_id = p.id 
  AND qp.questionario_id = 1
);
```

### 5. Denúncias de Exemplo

```sql
INSERT INTO denuncia (
  titulo,
  descricao,
  categoria,
  status,
  anonimo,
  usuario_id,
  empresa_id,
  data_criacao
)
VALUES 
  (
    'Ambiente de trabalho inadequado',
    'Temperatura muito elevada no setor',
    'CONDICOES_TRABALHO',
    'ABERTA',
    false,
    3,
    1,
    NOW()
  ),
  (
    'Sobrecarga de trabalho',
    'Metas inatingíveis estabelecidas',
    'CARGA_TRABALHO',
    'EM_ANALISE',
    true,
    NULL,
    1,
    NOW() - INTERVAL '5 days'
  );
```

### 6. Ações Corretivas

```sql
INSERT INTO acao_corretiva (
  titulo,
  descricao,
  status,
  prioridade,
  responsavel_id,
  empresa_id,
  prazo,
  data_criacao
)
VALUES 
  (
    'Instalação de ar-condicionado',
    'Instalação de sistema de climatização no setor',
    'PENDENTE',
    'ALTA',
    2,  -- Gestor responsável
    1,
    NOW() + INTERVAL '60 days',
    NOW()
  ),
  (
    'Revisão de metas',
    'Revisão e ajuste das metas trimestrais',
    'EM_ANDAMENTO',
    'ALTA',
    2,
    1,
    NOW() + INTERVAL '30 days',
    NOW()
  );
```

## Scripts SQL de Teste

### Script Completo de População

Crie um arquivo `test-data.sql`:

```sql
-- ============================================
-- SCRIPT DE DADOS DE TESTE - PSYSAFE
-- ============================================

-- Limpar dados existentes (CUIDADO EM PRODUÇÃO!)
TRUNCATE TABLE resposta CASCADE;
TRUNCATE TABLE questionario_agendamento CASCADE;
TRUNCATE TABLE questionario_pergunta CASCADE;
TRUNCATE TABLE pergunta CASCADE;
TRUNCATE TABLE subescala CASCADE;
TRUNCATE TABLE questionario CASCADE;
TRUNCATE TABLE acao_corretiva CASCADE;
TRUNCATE TABLE denuncia CASCADE;
TRUNCATE TABLE usuario CASCADE;
TRUNCATE TABLE empresa CASCADE;

-- Resetar sequences
ALTER SEQUENCE empresa_id_seq RESTART WITH 1;
ALTER SEQUENCE usuario_id_seq RESTART WITH 1;
ALTER SEQUENCE questionario_id_seq RESTART WITH 1;
ALTER SEQUENCE subescala_id_seq RESTART WITH 1;
ALTER SEQUENCE pergunta_id_seq RESTART WITH 1;

-- Inserir empresa
INSERT INTO empresa (nome, cnpj, endereco, telefone, email)
VALUES (
  'PsySafe Demo Company',
  '12.345.678/0001-90',
  'Rua Exemplo, 123 - São Paulo/SP',
  '(11) 98765-4321',
  'contato@psysafe.com'
);

-- Inserir usuários
INSERT INTO usuario (nome, email, senha, role, empresa_id, ativo)
VALUES 
  ('Administrador Sistema', 'admin@psysafe.com', 
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 
   'ADMIN', 1, true),
  ('Carlos Silva', 'gestor@psysafe.com', 
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 
   'GESTOR', 1, true),
  ('Maria Santos', 'funcionario@psysafe.com', 
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 
   'FUNCIONARIO', 1, true),
  ('João Pedro', 'joao.pedro@psysafe.com', 
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 
   'FUNCIONARIO', 1, true),
  ('Ana Costa', 'ana.costa@psysafe.com', 
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 
   'FUNCIONARIO', 1, true);

-- Inserir subescalas
INSERT INTO subescala (nome, descricao)
VALUES 
  ('Carga de Trabalho', 'Percepção de sobrecarga de trabalho'),
  ('Relacionamento', 'Qualidade dos relacionamentos interpessoais'),
  ('Autonomia', 'Nível de autonomia e controle sobre o trabalho'),
  ('Reconhecimento', 'Percepção de reconhecimento profissional');

-- Inserir questionário
INSERT INTO questionario (titulo, descricao, ativo)
VALUES (
  'Avaliação de Clima Organizacional',
  'Questionário para avaliação do clima e bem-estar no trabalho',
  true
);

-- Inserir perguntas
INSERT INTO pergunta (texto, subescala_id, tipo_resposta)
VALUES 
  ('Sinto que tenho carga de trabalho adequada', 1, 'ESCALA_LIKERT'),
  ('Consigo cumprir prazos sem sobrecarga', 1, 'ESCALA_LIKERT'),
  ('Tenho tempo para pausas durante o trabalho', 1, 'ESCALA_LIKERT'),
  ('O relacionamento com colegas é positivo', 2, 'ESCALA_LIKERT'),
  ('Sinto apoio da equipe quando necessário', 2, 'ESCALA_LIKERT'),
  ('A comunicação na equipe é eficaz', 2, 'ESCALA_LIKERT'),
  ('Tenho autonomia para tomar decisões', 3, 'ESCALA_LIKERT'),
  ('Posso sugerir melhorias no meu trabalho', 3, 'ESCALA_LIKERT'),
  ('Meu trabalho permite criatividade', 3, 'ESCALA_LIKERT'),
  ('Recebo reconhecimento pelo meu trabalho', 4, 'ESCALA_LIKERT'),
  ('Meu esforço é valorizado pela liderança', 4, 'ESCALA_LIKERT'),
  ('Sinto que contribuo para a empresa', 4, 'ESCALA_LIKERT');

-- Associar perguntas ao questionário
INSERT INTO questionario_pergunta (questionario_id, pergunta_id, ordem)
SELECT 1, id, ROW_NUMBER() OVER (ORDER BY id)
FROM pergunta;

-- Agendar questionário
INSERT INTO questionario_agendamento (
  questionario_id, titulo, descricao, 
  data_inicio, data_fim, status, criado_por
)
VALUES (
  1,
  'Avaliação Q1 2024',
  'Avaliação trimestral do clima organizacional',
  NOW(),
  NOW() + INTERVAL '30 days',
  'ATIVO',
  2
);

-- Inserir denúncias
INSERT INTO denuncia (
  titulo, descricao, categoria, status, 
  anonimo, usuario_id, empresa_id, data_criacao
)
VALUES 
  (
    'Ambiente inadequado',
    'Temperatura muito elevada no setor',
    'CONDICOES_TRABALHO',
    'ABERTA',
    false, 3, 1, NOW()
  ),
  (
    'Sobrecarga de trabalho',
    'Metas inatingíveis estabelecidas',
    'CARGA_TRABALHO',
    'EM_ANALISE',
    true, NULL, 1,
    NOW() - INTERVAL '5 days'
  );

-- Inserir ações corretivas
INSERT INTO acao_corretiva (
  titulo, descricao, status, prioridade,
  responsavel_id, empresa_id, prazo, data_criacao
)
VALUES 
  (
    'Instalação de ar-condicionado',
    'Sistema de climatização no setor',
    'PENDENTE', 'ALTA', 2, 1,
    NOW() + INTERVAL '60 days', NOW()
  ),
  (
    'Revisão de metas',
    'Ajuste das metas trimestrais',
    'EM_ANDAMENTO', 'ALTA', 2, 1,
    NOW() + INTERVAL '30 days', NOW()
  );

-- Mensagem de sucesso
SELECT 'Dados de teste inseridos com sucesso!' as resultado;
```

Execute o script:

```bash
psql -U postgres -d psysafe -f test-data.sql
```

## API de Desenvolvimento

O backend possui endpoints especiais para desenvolvimento (disponíveis apenas em modo DEV):

### Endpoint: Seed Database

```bash
POST /api/dev/seed
Authorization: Bearer <admin-token>

# Popula o banco com dados de teste
```

### Endpoint: Reset Database

```bash
POST /api/dev/reset
Authorization: Bearer <admin-token>

# CUIDADO: Limpa todos os dados!
```

### Endpoint: Generate Test Data

```bash
POST /api/dev/generate-data
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "users": 50,
  "questionnaires": 10,
  "responses": 500
}

# Gera dados aleatórios para teste
```

## Verificar Dados Inseridos

### Verificar Contagens

```sql
-- Verificar quantos registros em cada tabela
SELECT 
  'empresas' as tabela, COUNT(*) as total FROM empresa
UNION ALL SELECT 'usuarios', COUNT(*) FROM usuario
UNION ALL SELECT 'questionarios', COUNT(*) FROM questionario
UNION ALL SELECT 'perguntas', COUNT(*) FROM pergunta
UNION ALL SELECT 'subescalas', COUNT(*) FROM subescala
UNION ALL SELECT 'agendamentos', COUNT(*) FROM questionario_agendamento
UNION ALL SELECT 'respostas', COUNT(*) FROM resposta
UNION ALL SELECT 'denuncias', COUNT(*) FROM denuncia
UNION ALL SELECT 'acoes_corretivas', COUNT(*) FROM acao_corretiva;
```

### Verificar Usuários

```sql
SELECT 
  id, nome, email, role, ativo
FROM usuario
ORDER BY role, nome;
```

### Verificar Questionários

```sql
SELECT 
  q.id,
  q.titulo,
  COUNT(DISTINCT qp.pergunta_id) as total_perguntas,
  COUNT(DISTINCT qa.id) as agendamentos
FROM questionario q
LEFT JOIN questionario_pergunta qp ON qp.questionario_id = q.id
LEFT JOIN questionario_agendamento qa ON qa.questionario_id = q.id
GROUP BY q.id, q.titulo;
```

## Cenários de Teste

### Cenário 1: Gestor Agendando Questionário

1. Login como gestor
2. Navegar para "Questionários"
3. Clicar em "Agendar Questionário"
4. Selecionar questionário, datas e participantes
5. Confirmar agendamento

### Cenário 2: Funcionário Respondendo

1. Login como funcionário
2. Ver questionário pendente no dashboard
3. Clicar em "Responder"
4. Preencher todas as perguntas
5. Submeter respostas

### Cenário 3: Visualizando Estatísticas

1. Login como gestor ou admin
2. Navegar para "Estatísticas"
3. Visualizar gráficos e métricas
4. Filtrar por período

### Cenário 4: Criando Denúncia

1. Login como funcionário
2. Navegar para "Denúncias"
3. Clicar em "Nova Denúncia"
4. Preencher formulário
5. Optar por anônimo ou identificado
6. Submeter

## Limpar Dados de Teste

```sql
-- CUIDADO: Remove TODOS os dados!
TRUNCATE TABLE resposta CASCADE;
TRUNCATE TABLE questionario_agendamento CASCADE;
TRUNCATE TABLE questionario_pergunta CASCADE;
TRUNCATE TABLE pergunta CASCADE;
TRUNCATE TABLE subescala CASCADE;
TRUNCATE TABLE questionario CASCADE;
TRUNCATE TABLE acao_corretiva CASCADE;
TRUNCATE TABLE denuncia CASCADE;
TRUNCATE TABLE usuario CASCADE;
TRUNCATE TABLE empresa CASCADE;
```

## Notas Importantes

1. **Senhas:** Todos os usuários de teste usam senhas simples (admin123, etc). **NUNCA use em produção!**

2. **Dados Sintéticos:** Os dados são fictícios para desenvolvimento. Em produção, use dados reais.

3. **Performance:** Com muitos dados de teste, queries podem ficar lentas. Use índices adequados.

4. **Backup:** Sempre faça backup antes de popular/limpar dados!

---

**Pronto!** Seu ambiente de desenvolvimento está populado e pronto para testes!
