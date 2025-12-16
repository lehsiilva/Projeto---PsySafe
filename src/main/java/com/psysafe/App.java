package com.psysafe;

import java.io.InputStream;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.psysafe.controller.AcaoCorretivaController;
import com.psysafe.controller.AuthController;
import com.psysafe.controller.DenunciaController;
import com.psysafe.controller.EmpresaController;
import com.psysafe.controller.QuestionarioController;
import com.psysafe.controller.StatsController;
import com.psysafe.controller.UsuarioController;
import com.psysafe.service.AuthService;
import com.psysafe.service.DenunciaService;
import com.psysafe.service.EmpresaService;
import com.psysafe.service.QuestionarioService;
import com.psysafe.service.StatsService;
import com.psysafe.service.UsuarioService;

import java.util.HashMap;
import java.util.Map;

import static spark.Spark.before;
import static spark.Spark.exception;
import static spark.Spark.get;
import static spark.Spark.options;
import static spark.Spark.port;
import static spark.Spark.post;
import static spark.Spark.put;
import static spark.Spark.staticFiles;

public class App {

    public static void main(String[] args) {
        System.out.println("INÍCIO DA EXECUÇÃO DO SPARK!");

        // 1. CONFIGURAÇÕES BÁSICAS
        port(4567);
        staticFiles.location("/public");
        
        // Instanciar Gson para JSON
        Gson gson = new Gson();

        // 2. CORS GLOBAL
        options("/*", (req, res) -> {
            String headers = req.headers("Access-Control-Request-Headers");
            if (headers != null) res.header("Access-Control-Allow-Headers", headers);

            String methods = req.headers("Access-Control-Request-Method");
            if (methods != null) res.header("Access-Control-Allow-Methods", methods);

            return "OK";
        });

        before((req, res) -> {
            res.header("Access-Control-Allow-Origin", "http://localhost:5173");
            res.header("Access-Control-Allow-Credentials", "true");
            res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        });

        // 3. INICIALIZAÇÃO DOS SERVICES
        AuthService authService = null;
        UsuarioService usuarioService = null;
        EmpresaService empresaService = null;
        DenunciaService denunciaService = null;
        QuestionarioService questionarioService = null;
        StatsService statsService = null;
        AcaoCorretivaController acaoController = null;

        try {
            System.out.println("Inicializando AuthService...");
            authService = new AuthService();
            System.out.println("AuthService inicializado");
        } catch (Exception e) {
            System.err.println("Erro ao inicializar AuthService: " + e.getMessage());
            e.printStackTrace();
        }

        try {
            System.out.println("Inicializando UsuarioService...");
            usuarioService = new UsuarioService();
            System.out.println("UsuarioService inicializado");
        } catch (Exception e) {
            System.err.println("Erro ao inicializar UsuarioService: " + e.getMessage());
            e.printStackTrace();
        }

        try {
            System.out.println("Inicializando EmpresaService...");
            empresaService = new EmpresaService();
            System.out.println("EmpresaService inicializado");
        } catch (Exception e) {
            System.err.println("Erro ao inicializar EmpresaService: " + e.getMessage());
            e.printStackTrace();
        }

        try {
            System.out.println("Inicializando DenunciaService...");
            denunciaService = new DenunciaService();
            System.out.println("DenunciaService inicializado");
        } catch (Exception e) {
            System.err.println("Erro ao inicializar DenunciaService: " + e.getMessage());
            e.printStackTrace();
        }

        try {
            System.out.println("Inicializando QuestionarioService...");
            questionarioService = new QuestionarioService();
            System.out.println("QuestionarioService inicializado");
        } catch (Exception e) {
            System.err.println("Erro ao inicializar QuestionarioService: " + e.getMessage());
            e.printStackTrace();
        }

        try {
            System.out.println("Inicializando StatsService...");
            statsService = new StatsService();
            System.out.println("StatsService inicializado");
        } catch (Exception e) {
            System.err.println("Erro ao inicializar StatsService: " + e.getMessage());
            e.printStackTrace();
        }
        
        try {
            System.out.println("Inicializando AcaoController...");
            acaoController = new AcaoCorretivaController();
            System.out.println("AcaoController inicializado");
        } catch (Exception e) {
            System.err.println("Erro ao inicializar AcaoController: " + e.getMessage());
            e.printStackTrace();
        }

        // 4. REGISTRO DE CONTROLLERS
        if (authService != null) {
            new AuthController(authService);
            System.out.println("AuthController registrado");
        }

        if (usuarioService != null) {
            new UsuarioController(usuarioService);
            System.out.println("UsuarioController registrado");
        }

        if (empresaService != null) {
            new EmpresaController(empresaService);
            System.out.println("EmpresaController registrado");
        }

        if (denunciaService != null) {
            new DenunciaController(denunciaService);
            System.out.println("DenunciaController registrado");
        }

        if (questionarioService != null) {
            new QuestionarioController(questionarioService);
            System.out.println("QuestionarioController registrado");
        }

        if (statsService != null) {
            new StatsController(statsService);
            System.out.println("StatsController registrado");
        }

        if (acaoController != null) {
            post("/api/acoes-corretivas/gerar", acaoController::gerarAcaoCorretiva);
            System.out.println("AcaoCorretivaController - rota /gerar registrada");
        }

        // 5. ROTA PARA RESOLVER ALERTAS
        StatsService finalStatsService = statsService;
        if (statsService != null) {
            put("/api/stats/alerts/:id/resolver", (req, res) -> {
                res.type("application/json");
                
                try {
                    String alertId = req.params(":id");
                    
                    // Parse do body JSON
                    JsonObject body = gson.fromJson(req.body(), JsonObject.class);
                    String acaoCorretivaId = body != null && body.has("acaoCorretivaId") 
                        ? body.get("acaoCorretivaId").getAsString() 
                        : null;
                    
                    boolean success = finalStatsService.resolverAlerta(alertId, acaoCorretivaId);
                    
                    if (success) {
                        Map<String, Object> response = new HashMap<>();
                        response.put("success", true);
                        response.put("message", "Alerta resolvido com sucesso");
                        return gson.toJson(response);
                    } else {
                        res.status(404);
                        Map<String, Object> response = new HashMap<>();
                        response.put("success", false);
                        response.put("message", "Alerta não encontrado");
                        return gson.toJson(response);
                    }
                    
                } catch (Exception e) {
                    res.status(500);
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "Erro ao resolver alerta: " + e.getMessage());
                    System.err.println("❌ Erro ao resolver alerta: " + e.getMessage());
                    e.printStackTrace();
                    return gson.toJson(response);
                }
            });
            System.out.println("Rota PUT /api/stats/alerts/:id/resolver registrada");
        }

        // 6. SPA: index.html para todas as rotas que não começam com /api
        get("/*", (req, res) -> {
            if (!req.pathInfo().startsWith("/api")) {
                res.type("text/html");
                InputStream in = App.class.getResourceAsStream("/public/index.html");
                if (in == null) {
                    res.status(404);
                    return "index.html não encontrado!";
                }
                return new String(in.readAllBytes());
            }
            return null;
        });

        // 7. TRATAMENTO GLOBAL DE EXCEÇÕES
        exception(Exception.class, (e, req, res) -> {
            res.status(500);
            res.type("application/json");
            System.err.println("❌ Erro 500 na rota: " + req.pathInfo());
            e.printStackTrace();
            res.body("{\"erro\":\"" + e.getMessage() + "\"}");
        });

        System.out.println("🚀 Servidor Spark rodando em http://localhost:4567");
        System.out.println("📍 Rotas de Estatísticas disponíveis:");
        System.out.println("   GET  /api/stats/overview");
        System.out.println("   GET  /api/stats/alerts");
        System.out.println("   GET  /api/stats/radar-data");
        System.out.println("   GET  /api/stats/departamentos");
        System.out.println("   PUT  /api/stats/alerts/:id/resolver");
        System.out.println("📍 Rotas de Ações Corretivas disponíveis:");
        System.out.println("   POST /api/acoes-corretivas/gerar");
    }
}