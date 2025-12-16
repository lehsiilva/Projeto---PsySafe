package com.psysafe.controller;

import java.util.List;
import java.util.Map;

import com.psysafe.model.Questionario;
import com.psysafe.service.QuestionarioService;
import com.psysafe.util.GsonUtil;
import com.psysafe.util.JwtUtil;

import spark.Request;
import spark.Response;
import spark.Route;
import static spark.Spark.delete;
import static spark.Spark.get;
import static spark.Spark.post;

public class QuestionarioController {

    private QuestionarioService questionarioService;

    public QuestionarioController(QuestionarioService questionarioService) {
        this.questionarioService = questionarioService;
        setupRoutes();
    }

    private void setupRoutes() {
        String basePath = "/api/questionarios";
        
        // 1. Rotas de agendamento (específicas - VÊM PRIMEIRO!)
        post(basePath + "/schedule", agendarQuestionario);
        get(basePath + "/scheduled", getAgendamentos);
        get(basePath + "/scheduled/active", getAgendamentosAtivos);
        delete(basePath + "/scheduled/:id", cancelarAgendamento);
        get(basePath + "/scheduled/:id/resultados", getResultadosAgendamento);
        
        // 2. Rotas de resultados (específicas)
        get(basePath + "/resultados", getResultados);
        
        // 3. Rotas básicas (depois das específicas)
        post(basePath, createQuestionario);
        get(basePath, getAllQuestionarios);
        
        // 4. Rotas com parâmetros (POR ÚLTIMO!)
        get(basePath + "/:id", getQuestionarioById);
        get(basePath + "/:id/perguntas", getPerguntasQuestionario);
        post(basePath + "/:id/responder", responderQuestionario);
    }

    // CREATE - Criar novo questionário
    private final Route createQuestionario = (Request req, Response res) -> {
        try {
            Questionario q = GsonUtil.getGson().fromJson(req.body(), Questionario.class);
            Questionario criado = questionarioService.createQuestionario(q);
            
            res.status(201);
            res.type("application/json");
            return GsonUtil.getGson().toJson(Map.of(
                "success", true,
                "data", criado
            ));
        } catch (Exception e) {
            res.status(500);
            res.type("application/json");
            return GsonUtil.getGson().toJson(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    };

    // GET ALL - Listar todos os questionários
    private final Route getAllQuestionarios = (Request req, Response res) -> {
        try {
            List<Questionario> list = questionarioService.getAllQuestionarios();
            
            res.status(200);
            res.type("application/json");
            return GsonUtil.getGson().toJson(Map.of(
                "success", true,
                "data", list
            ));
        } catch (Exception e) {
            res.status(500);
            res.type("application/json");
            return GsonUtil.getGson().toJson(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    };

    // GET BY ID - Buscar questionário por ID
    private final Route getQuestionarioById = (Request req, Response res) -> {
        try {
            int id = Integer.parseInt(req.params(":id"));
            Questionario q = questionarioService.getQuestionarioById(id);
            
            if (q != null) {
                res.status(200);
                res.type("application/json");
                return GsonUtil.getGson().toJson(Map.of(
                    "success", true,
                    "data", q
                ));
            } else {
                res.status(404);
                res.type("application/json");
                return GsonUtil.getGson().toJson(Map.of(
                    "success", false,
                    "message", "Questionário não encontrado"
                ));
            }
        } catch (Exception e) {
            res.status(500);
            res.type("application/json");
            return GsonUtil.getGson().toJson(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    };

    // GET PERGUNTAS - Buscar perguntas de um questionário
    private final Route getPerguntasQuestionario = (Request req, Response res) -> {
        try {
            int id = Integer.parseInt(req.params(":id"));
            
            System.out.println("🔍 Controller: Buscando perguntas para questionário " + id);
            
            List<Map<String, Object>> perguntas = questionarioService.getPerguntasByQuestionarioId(id);
            
            System.out.println("✅ Controller: Retornando " + perguntas.size() + " perguntas");
            
            res.status(200);
            res.type("application/json");
            return GsonUtil.getGson().toJson(Map.of(
                "success", true,
                "data", perguntas
            ));
        } catch (Exception e) {
            System.err.println("❌ Erro ao buscar perguntas: " + e.getMessage());
            e.printStackTrace();
            
            res.status(500);
            res.type("application/json");
            return GsonUtil.getGson().toJson(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    };

    // POST RESPONDER - Responder um questionário
    private final Route responderQuestionario = (Request req, Response res) -> {
        try {
            String authHeader = req.headers("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                res.status(401);
                return GsonUtil.getGson().toJson(Map.of(
                    "success", false,
                    "message", "Token não fornecido"
                ));
            }

            String token = authHeader.substring(7);
            String userId = JwtUtil.getUserId(token);
            int questionarioId = Integer.parseInt(req.params(":id"));
            
            Map<String, Object> respostas = GsonUtil.getGson().fromJson(req.body(), Map.class);
            
            questionarioService.salvarRespostas(userId, questionarioId, respostas);
            
            res.status(201);
            res.type("application/json");
            return GsonUtil.getGson().toJson(Map.of(
                "success", true,
                "message", "Respostas salvas com sucesso"
            ));
        } catch (Exception e) {
            res.status(500);
            res.type("application/json");
            return GsonUtil.getGson().toJson(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    };

    // GET RESULTADOS - Buscar resultados do usuário logado
    private final Route getResultados = (Request req, Response res) -> {
        try {
            String authHeader = req.headers("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                res.status(401);
                return GsonUtil.getGson().toJson(Map.of(
                    "success", false,
                    "message", "Token não fornecido"
                ));
            }

            String token = authHeader.substring(7);
            String userId = JwtUtil.getUserId(token);
            
            List<Map<String, Object>> resultados = questionarioService.getResultadosByUserId(userId);
            
            res.status(200);
            res.type("application/json");
            return GsonUtil.getGson().toJson(Map.of(
                "success", true,
                "data", resultados
            ));
        } catch (Exception e) {
            res.status(500);
            res.type("application/json");
            return GsonUtil.getGson().toJson(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    };

    // POST SCHEDULE - Agendar questionário
    private final Route agendarQuestionario = (Request req, Response res) -> {
        try {
            System.out.println("========================================");
            System.out.println("📥 RECEBENDO REQUISIÇÃO DE AGENDAMENTO");
            System.out.println("========================================");
            
            String authHeader = req.headers("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                System.err.println("❌ Token não fornecido!");
                res.status(401);
                return GsonUtil.getGson().toJson(Map.of(
                    "success", false,
                    "message", "Token não fornecido"
                ));
            }

            String token = authHeader.substring(7);
            String userId = JwtUtil.getUserId(token);
            
            System.out.println("✅ UserID extraído do token: " + userId);
            System.out.println("📄 Body da requisição: " + req.body());
            
            Map<String, Object> agendamento = GsonUtil.getGson().fromJson(req.body(), Map.class);
            
            System.out.println("📊 Dados parseados:");
            System.out.println("   - idQuestionario: " + agendamento.get("idQuestionario"));
            System.out.println("   - versao: " + agendamento.get("versao"));
            System.out.println("   - dataInicio: " + agendamento.get("dataInicio"));
            System.out.println("   - dataFim: " + agendamento.get("dataFim"));
            System.out.println("   - departamentos: " + agendamento.get("departamentos"));
            
            Map<String, Object> created = questionarioService.agendarQuestionario(userId, agendamento);
            
            System.out.println("✅✅✅ AGENDAMENTO CRIADO COM SUCESSO!");
            System.out.println("========================================");
            
            res.status(201);
            res.type("application/json");
            return GsonUtil.getGson().toJson(Map.of(
                "success", true,
                "message", "Questionário agendado com sucesso",
                "data", created
            ));
        } catch (Exception e) {
            System.err.println("========================================");
            System.err.println("❌❌❌ ERRO AO AGENDAR QUESTIONÁRIO");
            System.err.println("Mensagem: " + e.getMessage());
            System.err.println("Stack trace:");
            e.printStackTrace();
            System.err.println("========================================");
            
            res.status(500);
            res.type("application/json");
            return GsonUtil.getGson().toJson(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    };

    // GET SCHEDULED - Listar agendamentos (✅ TODOS OS GESTORES VÊM TODOS)
    private final Route getAgendamentos = (Request req, Response res) -> {
        try {
            String authHeader = req.headers("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                res.status(401);
                return GsonUtil.getGson().toJson(Map.of(
                    "success", false,
                    "message", "Token não fornecido"
                ));
            }

            String token = authHeader.substring(7);
            String userId = JwtUtil.getUserId(token);
            
            // ✅ MUDANÇA: Passar null para retornar TODOS os agendamentos
            List<Map<String, Object>> agendamentos = questionarioService.getAgendamentos(null);
            
            System.out.println("📋 Retornando " + agendamentos.size() + " agendamentos para o usuário " + userId);
            
            res.status(200);
            res.type("application/json");
            return GsonUtil.getGson().toJson(Map.of(
                "success", true,
                "data", agendamentos
            ));
        } catch (Exception e) {
            res.status(500);
            res.type("application/json");
            return GsonUtil.getGson().toJson(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    };

    // GET SCHEDULED ACTIVE - Listar agendamentos ativos (✅ TODOS OS GESTORES VÊM TODOS)
    private final Route getAgendamentosAtivos = (Request req, Response res) -> {
        try {
            String authHeader = req.headers("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                res.status(401);
                return GsonUtil.getGson().toJson(Map.of(
                    "success", false,
                    "message", "Token não fornecido"
                ));
            }

            String token = authHeader.substring(7);
            String userId = JwtUtil.getUserId(token);
            
            // ✅ MUDANÇA: Passar null para retornar TODOS os agendamentos ativos
            List<Map<String, Object>> agendamentosAtivos = questionarioService.getAgendamentosAtivos(null);
            
            System.out.println("📋 Retornando " + agendamentosAtivos.size() + " agendamentos ativos para o usuário " + userId);
            
            res.status(200);
            res.type("application/json");
            return GsonUtil.getGson().toJson(Map.of(
                "success", true,
                "data", agendamentosAtivos
            ));
        } catch (Exception e) {
            res.status(500);
            res.type("application/json");
            return GsonUtil.getGson().toJson(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    };

    // DELETE SCHEDULED - Cancelar agendamento
    private final Route cancelarAgendamento = (Request req, Response res) -> {
        try {
            String authHeader = req.headers("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                res.status(401);
                return GsonUtil.getGson().toJson(Map.of(
                    "success", false,
                    "message", "Token não fornecido"
                ));
            }

            String token = authHeader.substring(7);
            String userId = JwtUtil.getUserId(token);
            int agendamentoId = Integer.parseInt(req.params(":id"));
            
            questionarioService.cancelarAgendamento(agendamentoId);
            
            res.status(200);
            res.type("application/json");
            return GsonUtil.getGson().toJson(Map.of(
                "success", true,
                "message", "Agendamento cancelado com sucesso"
            ));
        } catch (Exception e) {
            res.status(500);
            res.type("application/json");
            return GsonUtil.getGson().toJson(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    };

    // GET RESULTADOS AGENDAMENTO - Buscar resultados de um agendamento
    private final Route getResultadosAgendamento = (Request req, Response res) -> {
        try {
            String authHeader = req.headers("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                res.status(401);
                return GsonUtil.getGson().toJson(Map.of(
                    "success", false,
                    "message", "Token não fornecido"
                ));
            }

            String token = authHeader.substring(7);
            String userId = JwtUtil.getUserId(token);
            int agendamentoId = Integer.parseInt(req.params(":id"));
            
            Map<String, Object> resultados = questionarioService.getResultadosAgendamento(agendamentoId);
            
            res.status(200);
            res.type("application/json");
            return GsonUtil.getGson().toJson(Map.of(
                "success", true,
                "data", resultados
            ));
        } catch (Exception e) {
            res.status(500);
            res.type("application/json");
            return GsonUtil.getGson().toJson(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    };
}