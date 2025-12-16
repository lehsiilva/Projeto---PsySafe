package com.psysafe.service;

import com.azure.ai.openai.OpenAIClient;
import com.azure.ai.openai.OpenAIClientBuilder;
import com.azure.ai.openai.models.*;
import com.azure.core.credential.AzureKeyCredential;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.psysafe.model.AlertContext;
import com.psysafe.model.AcaoCorretiva;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.*;

public class LLMService {
    private static final String AZURE_ENDPOINT;
    private static final String AZURE_API_KEY;
    private static final String AZURE_DEPLOYMENT;
    private final OpenAIClient client;
    private final Gson gson;

    static {
        Properties props = new Properties();
        try (InputStream input = LLMService.class.getClassLoader().getResourceAsStream("config.properties")) {
            if (input == null) {
                throw new RuntimeException("Arquivo config.properties não encontrado!");
            }
            props.load(input);
            AZURE_ENDPOINT = props.getProperty("azure.openai.endpoint");
            AZURE_API_KEY = props.getProperty("azure.openai.api.key");
            AZURE_DEPLOYMENT = props.getProperty("azure.openai.deployment");
            
            if (AZURE_API_KEY == null || AZURE_API_KEY.isEmpty()) {
                throw new RuntimeException("Azure API Key não configurada em config.properties");
            }
            
            System.out.println("✅ Configurações Azure OpenAI carregadas:");
            System.out.println("   Endpoint: " + AZURE_ENDPOINT);
            System.out.println("   Deployment: " + AZURE_DEPLOYMENT);
            
        } catch (IOException e) {
            throw new RuntimeException("Erro ao carregar configurações", e);
        }
    }

    public LLMService() {
        this.client = new OpenAIClientBuilder()
            .credential(new AzureKeyCredential(AZURE_API_KEY))
            .endpoint(AZURE_ENDPOINT)
            .buildClient();
        this.gson = new Gson();
        System.out.println("✅ Cliente Azure OpenAI inicializado");
    }

    public AcaoCorretiva gerarAcaoCorretiva(AlertContext context) throws Exception {
        System.out.println("🧠 Gerando ação corretiva com Azure OpenAI...");
        System.out.println("   Departamento: " + context.getDepartamento());
        System.out.println("   Nível: " + context.getNivel());
        System.out.println("   Média Risco: " + context.getMediaRisco() + "%");
        
        try {
            // Montar prompt com contexto real
            String prompt = montarPrompt(context);
            
            // Chamar API do Azure OpenAI
            String respostaIA = chamarAzureOpenAI(prompt);
            
            // Parsear resposta JSON
            AcaoCorretiva acao = parsearResposta(respostaIA, context);
            
            System.out.println("✅ Ação corretiva gerada com sucesso!");
            return acao;
            
        } catch (Exception e) {
            System.err.println("❌ Erro ao gerar ação: " + e.getMessage());
            e.printStackTrace();
            // Fallback: retornar ação genérica
            return gerarAcaoFallback(context);
        }
    }

    private String montarPrompt(AlertContext context) {
        StringBuilder categorias = new StringBuilder();
        if (context.getDistribuicaoCategorias() != null && !context.getDistribuicaoCategorias().isEmpty()) {
            context.getDistribuicaoCategorias().forEach((cat, valor) -> 
                categorias.append(String.format("- %s: %d%%\n", cat, valor))
            );
        } else {
            categorias.append("(Sem dados de categorias disponíveis)\n");
        }

        return String.format("""
            Você é um especialista em saúde mental ocupacional e riscos psicossociais no trabalho.
            
            Analise este contexto de um departamento e gere uma ação corretiva DETALHADA E PRÁTICA:
            
            **CONTEXTO:**
            - Departamento: %s
            - Nível de Risco: %s
            - Média de Risco: %d%%
            - Total de Avaliações: %d
            - Tendência: %s
            
            **Distribuição de Riscos por Categoria:**
            %s
            
            **TAREFA:**
            Gere uma ação corretiva em formato JSON com EXATAMENTE esta estrutura:
            
            {
              "titulo": "Título conciso e específico da ação (máx 100 caracteres)",
              "descricao": "Descrição detalhada do problema identificado e necessidade da ação (2-3 parágrafos)",
              "medidas": [
                "Medida prática 1 - seja específico e acionável",
                "Medida prática 2 - inclua prazos e responsabilidades",
                "Medida prática 3 - priorize intervenções baseadas em evidências",
                "Medida prática 4 - considere a cultura organizacional brasileira",
                "Medida prática 5 - inclua mecanismos de acompanhamento",
                "Medida prática 6 - considere recursos disponíveis"
              ],
              "analise": "Análise técnica detalhada do contexto, identificando causas-raiz e fatores contribuintes (2-3 parágrafos)",
              "impacto": "Impacto esperado com métricas quantificáveis e prazos realistas (1-2 parágrafos)",
              "recursos": "Recursos humanos, financeiros e de tempo necessários, com estimativas específicas (1-2 parágrafos)"
            }
            
            **DIRETRIZES:**
            1. Seja ESPECÍFICO ao departamento e contexto apresentado
            2. Use linguagem profissional mas acessível
            3. Base-se em evidências e boas práticas de saúde ocupacional
            4. Considere a realidade das empresas brasileiras
            5. Priorize ações com alto impacto e viabilidade
            6. Inclua indicadores mensuráveis de sucesso
            
            Retorne APENAS o JSON, sem texto adicional antes ou depois.
            """,
            context.getDepartamento(),
            context.getNivel() != null ? context.getNivel() : "não definido",
            context.getMediaRisco(),
            context.getTotalAvaliacoes(),
            context.getTendenciaRecente() != null ? context.getTendenciaRecente() : "estável",
            categorias.toString()
        );
    }

    private String chamarAzureOpenAI(String prompt) {
        System.out.println("📡 Chamando Azure OpenAI...");
        
        // Criar mensagens
        List<ChatRequestMessage> chatMessages = Arrays.asList(
            new ChatRequestSystemMessage("Você é um especialista em saúde ocupacional e riscos psicossociais. Responda sempre em JSON válido."),
            new ChatRequestUserMessage(prompt)
        );

        // Configurar opções
        ChatCompletionsOptions options = new ChatCompletionsOptions(chatMessages);
        
        // Modelos GPT-4o e posteriores podem ter restrições nos parâmetros
        // Removido: max_tokens e temperature não são aceitos neste deployment
        // O modelo usará os valores padrão

        // Fazer chamada
        ChatCompletions chatCompletions = client.getChatCompletions(AZURE_DEPLOYMENT, options);

        System.out.println("📥 Resposta recebida do Azure");
        System.out.println("   Model ID: " + chatCompletions.getId());
        System.out.println("   Created: " + chatCompletions.getCreatedAt());
        
        // Extrair resposta
        if (chatCompletions.getChoices() != null && !chatCompletions.getChoices().isEmpty()) {
            ChatChoice choice = chatCompletions.getChoices().get(0);
            ChatResponseMessage message = choice.getMessage();
            
            System.out.println("   Finish Reason: " + choice.getFinishReason());
            
            if (chatCompletions.getUsage() != null) {
                System.out.println("   Tokens usados: " + chatCompletions.getUsage().getTotalTokens());
            }
            
            return message.getContent();
        }
        
        throw new RuntimeException("Resposta da API sem conteúdo");
    }

    private AcaoCorretiva parsearResposta(String respostaIA, AlertContext context) {
        try {
            System.out.println("📋 Parseando resposta da IA...");
            System.out.println("Resposta recebida (primeiros 200 chars): " + 
                respostaIA.substring(0, Math.min(200, respostaIA.length())));
            
            // Limpar possíveis markdown ou texto extra
            String jsonLimpo = respostaIA.trim();
            if (jsonLimpo.startsWith("```json")) {
                jsonLimpo = jsonLimpo.substring(7);
            }
            if (jsonLimpo.startsWith("```")) {
                jsonLimpo = jsonLimpo.substring(3);
            }
            if (jsonLimpo.endsWith("```")) {
                jsonLimpo = jsonLimpo.substring(0, jsonLimpo.length() - 3);
            }
            jsonLimpo = jsonLimpo.trim();

            // Parsear JSON
            JsonObject json = gson.fromJson(jsonLimpo, JsonObject.class);
            
            AcaoCorretiva acao = new AcaoCorretiva();
            acao.setId(UUID.randomUUID().toString());
            acao.setTitulo(json.get("titulo").getAsString());
            acao.setDescricao(json.get("descricao").getAsString());
            acao.setDepartamento(context.getDepartamento());
            acao.setNivelRisco(context.getNivel());
            acao.setPrioridade(calcularPrioridade(context.getNivel()));
            acao.setDataCriacao(LocalDateTime.now());
            acao.setDataPrazo(calcularPrazo(context.getNivel()));
            acao.setStatus("pendente");
            
            // Extrair medidas
            JsonArray medidasArray = json.getAsJsonArray("medidas");
            List<String> medidas = new ArrayList<>();
            for (int i = 0; i < medidasArray.size(); i++) {
                medidas.add(medidasArray.get(i).getAsString());
            }
            acao.setMedidasSugeridas(medidas);
            
            acao.setAnaliseDetalhada(json.get("analise").getAsString());
            acao.setImpactoEsperado(json.get("impacto").getAsString());
            acao.setRecursosNecessarios(json.get("recursos").getAsString());
            
            System.out.println("✅ Ação parseada com sucesso!");
            return acao;
            
        } catch (Exception e) {
            System.err.println("❌ Erro ao parsear resposta da IA: " + e.getMessage());
            System.err.println("Resposta completa recebida:");
            System.err.println(respostaIA);
            e.printStackTrace();
            // Fallback: retornar ação genérica
            return gerarAcaoFallback(context);
        }
    }

    private LocalDateTime calcularPrazo(String nivelRisco) {
        if (nivelRisco == null) return LocalDateTime.now().plusDays(30);
        
        return switch (nivelRisco.toLowerCase()) {
            case "critico" -> LocalDateTime.now().plusDays(7);   // 1 semana
            case "alto" -> LocalDateTime.now().plusDays(15);     // 2 semanas
            case "medio" -> LocalDateTime.now().plusDays(30);    // 1 mês
            default -> LocalDateTime.now().plusDays(60);         // 2 meses
        };
    }

    private String calcularPrioridade(String nivelRisco) {
        if (nivelRisco == null) return "Média";
        
        return switch (nivelRisco.toLowerCase()) {
            case "critico" -> "Urgente";
            case "alto" -> "Alta";
            case "medio" -> "Média";
            default -> "Baixa";
        };
    }

    private AcaoCorretiva gerarAcaoFallback(AlertContext context) {
        System.out.println("⚠️ Usando ação genérica como fallback");
        
        AcaoCorretiva acao = new AcaoCorretiva();
        acao.setId(UUID.randomUUID().toString());
        acao.setTitulo("Plano de Ação Corretiva - " + context.getDepartamento());
        acao.setDescricao(String.format(
            "Foi identificada a necessidade de implementar medidas preventivas no departamento de %s " +
            "para reduzir os riscos psicossociais. A média de risco atual está em %d%%, " +
            "indicando nível de atenção %s.",
            context.getDepartamento(),
            context.getMediaRisco(),
            context.getNivel()
        ));
        acao.setDepartamento(context.getDepartamento());
        acao.setNivelRisco(context.getNivel());
        acao.setPrioridade(calcularPrioridade(context.getNivel()));
        acao.setDataCriacao(LocalDateTime.now());
        acao.setDataPrazo(calcularPrazo(context.getNivel()));
        acao.setStatus("pendente");
        
        acao.setMedidasSugeridas(Arrays.asList(
            "Realizar diagnóstico detalhado das principais fontes de estresse no departamento através de entrevistas e grupos focais",
            "Implementar programa de treinamento em gestão de estresse e técnicas de resiliência para toda a equipe",
            "Estabelecer pausas regulares obrigatórias durante o expediente (15 minutos a cada 2 horas)",
            "Criar canal de comunicação anônimo e confidencial para feedback e denúncias relacionadas ao ambiente de trabalho",
            "Revisar e redistribuir a carga de trabalho atual, identificando sobrecarga e gargalos operacionais",
            "Implementar programa de mentoria e acompanhamento psicológico disponível para todos os colaboradores",
            "Promover atividades mensais de integração da equipe focadas em bem-estar e qualidade de vida",
            "Estabelecer indicadores de acompanhamento e realizar avaliações trimestrais de progresso"
        ));
        
        acao.setAnaliseDetalhada(String.format(
            "A análise dos dados coletados no departamento de %s revela indicadores que requerem atenção " +
            "imediata da gestão. Com uma média de risco de %d%% e classificação de nível %s, " +
            "observa-se a necessidade de intervenção estruturada. " +
            "Os principais fatores contribuintes incluem possível sobrecarga de trabalho, " +
            "falta de clareza nas responsabilidades, e necessidade de maior suporte organizacional. " +
            "A tendência observada é %s, o que %s a urgência da implementação de medidas corretivas. " +
            "É fundamental abordar tanto os aspectos individuais quanto organizacionais para garantir " +
            "resultados sustentáveis e melhoria no ambiente de trabalho.",
            context.getDepartamento(),
            context.getMediaRisco(),
            context.getNivel(),
            context.getTendenciaRecente() != null ? context.getTendenciaRecente() : "estável",
            "piorando".equals(context.getTendenciaRecente()) ? "reforça" : "mantém"
        ));
        
        acao.setImpactoEsperado(
            "Com a implementação adequada das medidas propostas, espera-se uma redução de 30-40% " +
            "nos indicadores de risco psicossocial em um período de 3 meses. " +
            "Prevê-se melhoria mensurável em: satisfação dos colaboradores (+25%), " +
            "redução do absenteísmo (-20%), aumento do engajamento (+30%), " +
            "e melhoria na produtividade geral da equipe (+15%). " +
            "Os primeiros resultados devem ser observados nas primeiras 4-6 semanas de implementação."
        );
        
        acao.setRecursosNecessarios(
            "RECURSOS HUMANOS: Facilitador/psicólogo organizacional (40h), apoio de RH (20h), " +
            "líder do departamento (10h/semana). " +
            "RECURSOS FINANCEIROS: Estimativa de R$ 5.000-8.000 incluindo: materiais de treinamento, " +
            "consultoria especializada, atividades de integração, e ferramentas de acompanhamento. " +
            "TEMPO: Implementação completa em 8-10 semanas, com acompanhamento contínuo por 6 meses. " +
            "INFRAESTRUTURA: Sala para treinamentos, plataforma de comunicação, e sistema de gestão de feedback."
        );
        
        return acao;
    }
}