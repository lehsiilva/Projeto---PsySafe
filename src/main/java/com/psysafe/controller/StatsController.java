package com.psysafe.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.psysafe.service.StatsService;
import spark.Request;
import spark.Response;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static spark.Spark.get;

public class StatsController {
    private final StatsService statsService;
    private final Gson gson;
    
    public StatsController(StatsService statsService) {
        this.statsService = statsService;
        this.gson = new GsonBuilder()
            .registerTypeAdapter(LocalDate.class, new LocalDateAdapter())
            .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeAdapter())
            .create();
        
        // Registrar as rotas
        registerRoutes();
        
        System.out.println("✅ StatsController: Rotas registradas");
    }
    
    private void registerRoutes() {
        get("/api/stats/overview", this::getOverviewStats);
        get("/api/stats/alerts", this::getAlerts);
        get("/api/stats/radar-data", this::getRadarData);
        get("/api/stats/departamentos", this::getDepartamentos);
    }
    
    public String getOverviewStats(Request req, Response res) {
        res.type("application/json");
        
        try {
            System.out.println("📊 GET /api/stats/overview");
            System.out.println("   Query String: " + req.queryString());
            
            String timeRange = req.queryParams("timeRange");
            if (timeRange == null) timeRange = "6meses";
            
            String userId = req.queryParams("userId");
            String role = req.queryParams("role");
            if (role == null) role = "gestor";
            
            System.out.println("   timeRange: " + timeRange);
            System.out.println("   userId: " + userId);
            System.out.println("   role: " + role);
            
            Object stats = statsService.getOverviewStats(timeRange, userId, role);
            
            res.status(200);
            String response = gson.toJson(stats);
            System.out.println("   ✅ Resposta gerada com sucesso");
            return response;
            
        } catch (Exception e) {
            System.err.println("   ❌ Erro: " + e.getMessage());
            e.printStackTrace();
            res.status(500);
            return gson.toJson(new ErrorResponse("Erro ao buscar estatísticas: " + e.getMessage()));
        }
    }
    
    public String getAlerts(Request req, Response res) {
        res.type("application/json");
        
        try {
            System.out.println("🚨 GET /api/stats/alerts");
            
            String userId = req.queryParams("userId");
            String role = req.queryParams("role");
            if (role == null) role = "gestor";
            
            System.out.println("   userId: " + userId);
            System.out.println("   role: " + role);
            
            var alerts = statsService.getAlerts(userId, role);
            
            res.status(200);
            String response = gson.toJson(alerts);
            System.out.println("   ✅ " + alerts.size() + " alertas encontrados");
            return response;
            
        } catch (Exception e) {
            System.err.println("   ❌ Erro: " + e.getMessage());
            e.printStackTrace();
            res.status(500);
            return gson.toJson(new ErrorResponse("Erro ao buscar alertas: " + e.getMessage()));
        }
    }
    
    public String getRadarData(Request req, Response res) {
        res.type("application/json");
        
        try {
            System.out.println("📡 GET /api/stats/radar-data");
            
            String departamento = req.queryParams("departamento");
            String timeRange = req.queryParams("timeRange");
            if (timeRange == null) timeRange = "6meses";
            
            System.out.println("   departamento: " + departamento);
            System.out.println("   timeRange: " + timeRange);
            
            var radarData = statsService.getRadarData(departamento, timeRange);
            
            res.status(200);
            String response = gson.toJson(radarData);
            System.out.println("   ✅ " + radarData.size() + " categorias encontradas");
            return response;
            
        } catch (Exception e) {
            System.err.println("   ❌ Erro: " + e.getMessage());
            e.printStackTrace();
            res.status(500);
            return gson.toJson(new ErrorResponse("Erro ao buscar dados do radar: " + e.getMessage()));
        }
    }
    
    public String getDepartamentos(Request req, Response res) {
        res.type("application/json");
        
        try {
            System.out.println("🏢 GET /api/stats/departamentos");
            
            var departamentos = statsService.getDepartamentos();
            
            res.status(200);
            String response = gson.toJson(departamentos);
            System.out.println("   ✅ " + departamentos.size() + " departamentos encontrados");
            return response;
            
        } catch (Exception e) {
            System.err.println("   ❌ Erro: " + e.getMessage());
            e.printStackTrace();
            res.status(500);
            return gson.toJson(new ErrorResponse("Erro ao buscar departamentos: " + e.getMessage()));
        }
    }
    
    private static class ErrorResponse {
        private final String error;
        
        public ErrorResponse(String error) {
            this.error = error;
        }
        
        public String getError() {
            return error;
        }
    }
}