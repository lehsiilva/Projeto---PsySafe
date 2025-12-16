#  Integração Azure - PsySafe

##  Índice

- [Visão Geral](#visão-geral)
- [Azure PostgreSQL](#azure-postgresql)
- [Azure OpenAI](#azure-openai)
- [Configuração](#configuração)
- [Casos de Uso](#casos-de-uso)
- [Prompts e Templates](#prompts-e-templates)
- [Custos e Otimização](#custos-e-otimização)
- [Deploy](#deploy)

##  Visão Geral

O PsySafe utiliza dois serviços principais do Microsoft Azure:

1. **Azure Database for PostgreSQL**: Banco de dados gerenciado
2. **Azure OpenAI Service**: IA generativa para ações corretivas

### Arquitetura na Azure

```
┌─────────────────────────────────────────────────┐
│         Azure Resource Group: psysafe-rg        │
│                                                  │
│  ┌────────────────────────────────────────┐   │
│  │   Azure App Service                     │   │
│  │   - Backend (Spark Java)                │   │
│  │   - Port: 443 (HTTPS)                   │   │
│  └────────────┬───────────────────────────┘   │
│               │                                 │
│               ▼                                 │
│  ┌────────────────────────────────────────┐   │
│  │   Azure PostgreSQL Flexible Server     │   │
│  │   - Tier: B2s (2 vCores, 4GB RAM)      │   │
│  │   - Storage: 32GB (auto-scale)         │   │
│  │   - SSL: Required                       │   │
│  └────────────────────────────────────────┘   │
│                                                  │
│               ▼ (Quando necessário)             │
│  ┌────────────────────────────────────────┐   │
│  │   Azure OpenAI Service                  │   │
│  │   - Model: GPT-5.1 Mini                 │   │
│  │   - Deployment: psysafe-gpt-mini       │   │
│  │   - API Version: 2024-08-01            │   │
│  └────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

---

##  Azure PostgreSQL

### Especificações do Servidor

```yaml
Nome: psysafe-postgres-server
Região: East US (ou Brazil South)
Versão: PostgreSQL 15
Tier: Flexible Server
SKU: Standard_B2s
  - vCores: 2
  - RAM: 4GB
  - Storage: 32GB (auto-scale até 128GB)
Backup:
  - Retenção: 7 dias
  - Geo-redundância: Habilitada
Alta Disponibilidade: Zone-redundant (99.99% SLA)
SSL/TLS: Requerido (v1.2+)
```

### Connection String

```bash
# Formato
jdbc:postgresql://psysafe.postgres.database.azure.com:5432/psysafe_db

```

**Código Java**:

```java
// Database.java
package com.psysafe.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Database {

    // AVISO: Remoção de 'sslmode=require' para tentar contornar a falha de SSL/Autenticação no Azure.
    // Se a autenticação funcionar agora, o problema era o SSL.
    private static final String URL = "jdbc:postgresql://psysafe.postgres.database.azure.com:5432/psysafe_db";
    private static final String USER = "psysafeAdm";
    private static final String PASSWORD = "Adm12345"; // Por favor, coloque sua senha REAL aqui

    
    // Método que tenta estabelecer a conexão
    public static Connection getConnection() throws SQLException {
        try {
            // DriverManager tenta estabelecer a conexão usando as credenciais
            return DriverManager.getConnection(URL, USER, PASSWORD);
        } catch (SQLException e) {
            // 🛑 IMPRIME A EXCEÇÃO NO CONSOLE DE FORMA VISÍVEL
            System.err.println("🚨 🛑 FALHA CRÍTICA DE CONEXÃO COM O BANCO DE DADOS 🛑 🚨");
            System.err.println("Por favor, verifique: 1. Senha; 2. URL; 3. Servidor Azure está online; 4. Firewall do Azure.");
            e.printStackTrace(); // Imprime o stack trace completo (com a causa do erro)
            throw e; // Relança a exceção para o DAO/Service (causando o erro 500)
        }
    }
}

```

### Firewall Rules

```bash
# Permitir IP do App Service
az postgres flexible-server firewall-rule create \
  --resource-group psysafe-rg \
  --name psysafe-postgres \
  --rule-name AllowAppService \
  --start-ip-address 20.10.10.10 \
  --end-ip-address 20.10.10.10

# Permitir Azure Services
az postgres flexible-server firewall-rule create \
  --resource-group psysafe-rg \
  --name psysafe-postgres \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

### Monitoramento

**Métricas Importantes**:
- CPU Usage
- Memory Usage
- Storage Used
- Connections Active
- Query Duration

**Alertas Configurados**:
- CPU > 80% por 5 minutos
- Storage > 90%
- Failed Connections > 10

---

##  Azure OpenAI

### Especificações do Serviço

```yaml
Nome: psysafe-openai
Região: East US
Modelo: GPT-5.1 Mini (Mais rápido e econômico)
Deployment Name: psysafe-gpt-mini
API Version: 2024-08-01
Tokens por Minuto (TPM): 10,000
Requests por Minuto (RPM): 100
```

### Configuração

**Variáveis de Ambiente**:
**Arquivo: `src/main/resources/config.properties`**

```bash
# .env
AZURE_OPENAI_ENDPOINT=https://psysafe-openai.openai.azure.com/
AZURE_OPENAI_API_KEY=abc123def456...
AZURE_OPENAI_DEPLOYMENT=psysafe-gpt-mini
AZURE_OPENAI_API_VERSION=2024-08-01
```

**Código Java - LLMService.java**:

```java
public class LLMService {
    private static final String ENDPOINT = System.getenv("AZURE_OPENAI_ENDPOINT");
    private static final String API_KEY = System.getenv("AZURE_OPENAI_API_KEY");
    private static final String DEPLOYMENT = System.getenv("AZURE_OPENAI_DEPLOYMENT");
    
    public String generateCorrectiveAction(AlertContext context) {
        String url = String.format(
            "%s/openai/deployments/%s/chat/completions?api-version=%s",
            ENDPOINT,
            DEPLOYMENT,
            System.getenv("AZURE_OPENAI_API_VERSION")
        );
        
        JSONObject request = new JSONObject();
        request.put("messages", buildMessages(context));
        request.put("temperature", 0.7);
        request.put("max_tokens", 1500);
        request.put("top_p", 0.9);
        
        try {
            HttpResponse<String> response = Unirest.post(url)
                .header("Content-Type", "application/json")
                .header("api-key", API_KEY)
                .body(request.toString())
                .asString();
            
            JSONObject result = new JSONObject(response.getBody());
            return result
                .getJSONArray("choices")
                .getJSONObject(0)
                .getJSONObject("message")
                .getString("content");
                
        } catch (Exception e) {
            throw new RuntimeException("Erro ao chamar Azure OpenAI", e);
        }
    }
    
    private JSONArray buildMessages(AlertContext context) {
        JSONArray messages = new JSONArray();
        
        // System message
        messages.put(new JSONObject()
            .put("role", "system")
            .put("content", SYSTEM_PROMPT)
        );
        
        // User message
        messages.put(new JSONObject()
            .put("role", "user")
            .put("content", buildUserPrompt(context))
        );
        
        return messages;
    }
}
```

---

##  Casos de Uso

### 1. Geração de Ações Corretivas

**Trigger**: Alerta crítico detectado (IRP > 75%)

**Fluxo**:
```
1. Trigger do banco detecta risco crítico
2. Cria alerta na tabela `alertas`
3. Backend chama LLMService.generateCorrectiveAction()
4. IA analisa contexto e histórico
5. Gera 3-5 ações corretivas específicas
6. Salva em `acao_corretiva`
7. Notifica gestor responsável
```

**Contexto Enviado à IA**:

```json
{
  "alerta": {
    "tipo": "risco_critico",
    "departamento": "TI",
    "nivel_risco": 82,
    "total_afetados": 5
  },
  "historico": {
    "irp_departamento_6m": [
      {"mes": "2024-06", "irp": 35.2},
      {"mes": "2024-07", "irp": 42.1},
      {"mes": "2024-08", "irp": 55.3},
      {"mes": "2024-09", "irp": 68.7},
      {"mes": "2024-10", "irp": 75.4},
      {"mes": "2024-11", "irp": 82.0}
    ],
    "subescalas_criticas": [
      {
        "nome": "Carga de Trabalho",
        "pontuacao": 1.8,
        "percentual_respostas_negativas": 78
      },
      {
        "nome": "Autonomia",
        "pontuacao": 2.1,
        "percentual_respostas_negativas": 65
      }
    ]
  },
  "contexto_empresa": {
    "setor": "Tecnologia",
    "tamanho_equipe": 45,
    "projetos_criticos_ativos": 8
  }
}
```

---

### 2. Análise de Sentimento em Denúncias

**Objetivo**: Classificar gravidade de denúncias abertas

```java
public SentimentAnalysis analyzeDenuncia(String descricao) {
    String prompt = String.format(
        "Analise o seguinte relato de denúncia e classifique:\n\n" +
        "Relato: %s\n\n" +
        "Responda em JSON:\n" +
        "{\n" +
        "  \"gravidade\": \"baixa|media|alta|critica\",\n" +
        "  \"urgencia\": \"pode_esperar|atencao|urgente|imediata\",\n" +
        "  \"categorias\": [\"assedio\", \"discriminacao\", etc],\n" +
        "  \"recomendacao\": \"ação sugerida\"\n" +
        "}",
        descricao
    );
    
    String response = callOpenAI(prompt);
    return parseJSON(response, SentimentAnalysis.class);
}
```

---

### 3. Sugestões Preventivas

**Trigger**: IRP do departamento aumenta >10% MoM

```java
public List<Prevention> generatePreventiveActions(String departamento) {
    // Buscar tendências
    List<MonthlyStats> trends = statsDAO.getTrends(departamento, 6);
    
    String prompt = String.format(
        "Com base na evolução do IRP do departamento %s:\n" +
        "%s\n\n" +
        "Sugira 3 ações PREVENTIVAS para evitar piora do cenário.\n" +
        "Foque em: cultura organizacional, gestão de carga, comunicação.",
        departamento,
        formatTrends(trends)
    );
    
    return callOpenAI(prompt);
}
```

---

##  Prompts e Templates

### System Prompt (Ações Corretivas)

```
Você é um especialista em saúde ocupacional e psicologia organizacional, 
especializado em gestão de riscos psicossociais no ambiente de trabalho.

Sua função é analisar dados de avaliações psicossociais e gerar AÇÕES 
CORRETIVAS específicas, mensuráveis e acionáveis.

Diretrizes:
1. Seja específico e prático
2. Considere viabilidade de implementação
3. Priorize ações baseadas em evidências
4. Mencione recursos necessários (tempo, orçamento, pessoas)
5. Defina métricas de sucesso
6. Respeite legislação trabalhista brasileira (NR-17, CLT)

Estrutura da resposta:
- Título conciso da ação
- Descrição detalhada (2-3 parágrafos)
- Medidas específicas (lista numerada)
- Recursos necessários
- Prazo sugerido
- Impacto esperado (quantificável)
- Indicadores de sucesso

Exemplo de tom:
 "Implementar programa de gestão de carga de trabalho com reuniões 
semanais de alinhamento e redistribuição de tarefas entre a equipe..."

 "Melhorar o ambiente de trabalho..."
```

### User Prompt Template

```java
private static final String USER_PROMPT_TEMPLATE = """
Com base nos seguintes dados:

DEPARTAMENTO: %s
NÍVEL DE RISCO ATUAL: %s (IRP: %.2f)
TOTAL DE COLABORADORES AFETADOS: %d

EVOLUÇÃO (últimos 6 meses):
%s

SUBESCALAS CRÍTICAS:
%s

CONTEXTO ORGANIZACIONAL:
- Setor: %s
- Tamanho da equipe: %d
- Projetos críticos ativos: %d

REQUISITOS:
1. Gere 3 ações corretivas ESPECÍFICAS e MENSURÁVEIS
2. Priorize ações de impacto imediato (30-60 dias)
3. Considere recursos limitados (budget até R$ 10.000 por ação)
4. Inclua métricas de sucesso claras

Formato da resposta: JSON estruturado
""";
```

### Response Format

```json
{
  "acoes": [
    {
      "titulo": "Programa de Redistribuição de Carga de Trabalho",
      "descricao": "Implementação de sistema de gestão de carga...",
      "medidas_especificas": [
        "1. Realizar diagnóstico detalhado da distribuição atual",
        "2. Implementar reuniões semanais de alinhamento",
        "3. Criar matriz de competências e capacidades"
      ],
      "recursos_necessarios": {
        "orcamento": "R$ 5.000",
        "tempo_implementacao": "45 dias",
        "pessoas_envolvidas": "Gestor + 2 analistas"
      },
      "prazo_sugerido": "2024-12-31",
      "impacto_esperado": "Redução de 25% no IRP em 3 meses",
      "indicadores_sucesso": [
        "IRP < 60",
        "Taxa de conformidade > 75%",
        "Redução de 50% em horas extras"
      ],
      "prioridade": "alta"
    }
  ]
}
```

---

##  Custos e Otimização

### Custos Estimados (Mensal)

#### Azure PostgreSQL

```
Tier: Standard_B2s (2 vCores, 4GB RAM)
Storage: 32GB
Backup: 7 dias

Custo: ~$45-60/mês
```

#### Azure OpenAI

```
Modelo: GPT-5.1 Mini
Pricing: $0.15 / 1M tokens input
         $0.60 / 1M tokens output

Estimativa de uso:
- 100 ações corretivas/mês
- ~1000 tokens input/ação
- ~500 tokens output/ação

Custo: ~$0.15 + $0.30 = $0.45/mês (muito baixo!)
```

**Total Estimado**: ~$50-65/mês

### Otimizações

#### 1. Cache de Respostas Similares

```java
// Evitar chamadas duplicadas
private Map<String, String> cache = new ConcurrentHashMap<>();

public String generateAction(AlertContext context) {
    String cacheKey = buildCacheKey(context);
    
    if (cache.containsKey(cacheKey)) {
        return cache.get(cacheKey);
    }
    
    String result = callOpenAI(context);
    cache.put(cacheKey, result);
    
    return result;
}
```

#### 2. Batch Processing

```java
// Processar múltiplos alertas de uma vez
public List<Action> generateBatchActions(List<Alert> alerts) {
    // Agrupa alertas similares
    Map<String, List<Alert>> grouped = groupSimilarAlerts(alerts);
    
    // Uma chamada para cada grupo
    return grouped.entrySet().stream()
        .map(entry -> generateActionForGroup(entry.getValue()))
        .flatMap(List::stream)
        .collect(Collectors.toList());
}
```

#### 3. Tokens Limit

```java
// Limitar tamanho do contexto
private String buildOptimizedPrompt(AlertContext context) {
    // Só últimos 3 meses de histórico
    context.setHistorico(
        context.getHistorico()
            .stream()
            .limit(3)
            .collect(Collectors.toList())
    );
    
    // Máximo 1500 tokens
    String prompt = buildPrompt(context);
    return truncateToTokenLimit(prompt, 1500);
}
```

---

##  Deploy

### 1. Criar Resource Group

```bash
az group create \
  --name psysafe-rg \
  --location eastus
```

### 2. Deploy PostgreSQL

```bash
az postgres flexible-server create \
  --resource-group psysafe-rg \
  --name psysafe-postgres \
  --location eastus \
  --admin-user psysafeadmin \
  --admin-password 'SenhaForte123!' \
  --sku-name Standard_B2s \
  --tier Burstable \
  --storage-size 32 \
  --version 15 \
  --high-availability Disabled \
  --public-access 0.0.0.0
```

### 3. Deploy OpenAI

```bash
# Criar recurso OpenAI
az cognitiveservices account create \
  --name psysafe-openai \
  --resource-group psysafe-rg \
  --kind OpenAI \
  --sku S0 \
  --location eastus

# Criar deployment do modelo
az cognitiveservices account deployment create \
  --name psysafe-openai \
  --resource-group psysafe-rg \
  --deployment-name psysafe-gpt-mini \
  --model-name gpt-4 \
  --model-version "2024-08-01" \
  --model-format OpenAI \
  --sku-capacity 10 \
  --sku-name Standard
```

### 4. Deploy App Service

```bash
# Criar App Service Plan
az appservice plan create \
  --name psysafe-plan \
  --resource-group psysafe-rg \
  --sku B1 \
  --is-linux

# Criar Web App
az webapp create \
  --resource-group psysafe-rg \
  --plan psysafe-plan \
  --name psysafe-api \
  --runtime "JAVA:17-java17"

# Deploy JAR
az webapp deploy \
  --resource-group psysafe-rg \
  --name psysafe-api \
  --src-path target/psysafe-1.0-SNAPSHOT-exec.jar \
  --type jar
```

### 5. Configurar Variáveis de Ambiente

```bash
az webapp config appsettings set \
  --resource-group psysafe-rg \
  --name psysafe-api \
  --settings \
    DB_URL="jdbc:postgresql://psysafe-postgres.postgres.database.azure.com:5432/psysafe?sslmode=require" \
    DB_USER="psysafeadmin" \
    DB_PASSWORD="SenhaForte123!" \
    AZURE_OPENAI_ENDPOINT="https://psysafe-openai.openai.azure.com/" \
    AZURE_OPENAI_API_KEY="<key>" \
    AZURE_OPENAI_DEPLOYMENT="psysafe-gpt-mini" \
    JWT_SECRET="<secret>"
```

---

**Próximos Passos**:
- [API-ENDPOINTS.md](API-ENDPOINTS.md) - Consumir funcionalidades
- [ANALYTICS.md](ANALYTICS.md) - Métricas geradas pela IA
- [DATABASE.md](DATABASE.md) - Estrutura de dados

---

**Última Atualização**: Novembro 2024
