package com.psysafe.controller;

import com.psysafe.model.Empresa;
import com.psysafe.model.MembroEquipe;
import com.psysafe.model.Equipe;
import com.psysafe.service.EmpresaService;
import com.psysafe.util.GsonUtil;
import com.psysafe.util.JwtUtil;
import spark.Request;
import spark.Response;
import spark.Route;

import static spark.Spark.get;

public class EmpresaController {

    private EmpresaService empresaService = new EmpresaService();

    public EmpresaController(EmpresaService empresaService) {
        this.empresaService = empresaService;
        setupRoutes();
    }

    private void setupRoutes() {
        get("/api/empresas/me", getMyEmpresaRoute);
        get("/api/empresas/me/gestores", getGestoresRoute);
        get("/api/empresas/me/equipes", getEquipesRoute);
    }

    // Pega dados da empresa do usuário logado
    private final Route getMyEmpresaRoute = (Request req, Response res) -> {
        try {
            String authHeader = req.headers("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                res.status(401);
                return GsonUtil.getGson().toJson(
                        java.util.Map.of("success", false, "message", "Token não fornecido")
                );
            }

            String token = authHeader.substring(7);
            String userId = JwtUtil.getUserId(token);

            Empresa empresa = empresaService.getMyEmpresa(userId);
            if (empresa == null) {
                res.status(404);
                return GsonUtil.getGson().toJson(
                        java.util.Map.of("success", false, "message", "Empresa não encontrada")
                );
            }

            res.type("application/json");
            return GsonUtil.getGson().toJson(empresa);

        } catch (Exception e) {
            res.status(500);
            return GsonUtil.getGson().toJson(
                    java.util.Map.of("success", false, "message", e.getMessage())
            );
        }
    };

    // Pega gestores da empresa
    private final Route getGestoresRoute = (Request req, Response res) -> {
        try {
            String authHeader = req.headers("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                res.status(401);
                return GsonUtil.getGson().toJson(
                        java.util.Map.of("success", false, "message", "Token não fornecido")
                );
            }

            String token = authHeader.substring(7);
            String userId = JwtUtil.getUserId(token);

            java.util.List<MembroEquipe> gestores = empresaService.getGestores(userId);

            res.type("application/json");
            return GsonUtil.getGson().toJson(gestores);

        } catch (Exception e) {
            res.status(500);
            return GsonUtil.getGson().toJson(
                    java.util.Map.of("success", false, "message", e.getMessage())
            );
        }
    };

    // Pega equipes da empresa
    private final Route getEquipesRoute = (Request req, Response res) -> {
        try {
            String authHeader = req.headers("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                res.status(401);
                return GsonUtil.getGson().toJson(
                        java.util.Map.of("success", false, "message", "Token não fornecido")
                );
            }

            String token = authHeader.substring(7);
            String userId = JwtUtil.getUserId(token);

            java.util.List<Equipe> equipes = empresaService.getEquipes(userId);

            res.type("application/json");
            return GsonUtil.getGson().toJson(equipes);

        } catch (Exception e) {
            res.status(500);
            return GsonUtil.getGson().toJson(
                    java.util.Map.of("success", false, "message", e.getMessage())
            );
        }
    };
}
