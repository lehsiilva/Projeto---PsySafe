package com.psysafe.controller;

import com.psysafe.dto.LoginRequestDTO;
import com.psysafe.dto.RegisterRequestDTO;
import com.psysafe.model.AuthUser;
import com.psysafe.service.AuthService;
import com.psysafe.util.GsonUtil;
import com.psysafe.util.JwtUtil;
import spark.Request;
import spark.Response;
import spark.Route;

import java.util.HashMap;
import java.util.Map;

import static spark.Spark.post;
import static spark.Spark.get;

public class AuthController {

    private AuthService authService = new AuthService();

    public AuthController(AuthService authService) {
        this.authService = authService;
        setupRoutes();
    }

    private void setupRoutes() {
        spark.Spark.post("/api/auth/login", loginRoute);
        spark.Spark.post("/api/auth/register", registerRoute);
        spark.Spark.get("/api/auth/me", meRoute);
        spark.Spark.post("/api/auth/update", updateProfileRoute);
    }

    // LOGIN
    private final Route loginRoute = (Request req, Response res) -> {
        try {
            LoginRequestDTO body = GsonUtil.getGson().fromJson(req.body(), LoginRequestDTO.class);
            AuthUser user = authService.login(body.getEmail(), body.getPassword());

            // 💡 CORREÇÃO: Adicionando o argumento idEmpresa
            String token = JwtUtil.generateToken(
                    String.valueOf(user.getId()),
                    user.getRole(),
                    user.getName(),
                    user.getEmail(),
                    user.getIdEmpresa() // <--- ARGUMENTO OBRIGATÓRIO AGORA
            );

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Login realizado");
            response.put("user", user);
            response.put("token", token);

            res.type("application/json");
            return GsonUtil.getGson().toJson(response);

        } catch (Exception e) {
            res.status(401);
            res.type("application/json");
            return GsonUtil.getGson().toJson(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    };

    // REGISTRO
    private final Route registerRoute = (Request req, Response res) -> {
        try {
            RegisterRequestDTO body = GsonUtil.getGson().fromJson(req.body(), RegisterRequestDTO.class);

            if (!body.getPassword().equals(body.getConfirmPassword())) {
                throw new Exception("As senhas não coincidem");
            }

            AuthUser user = authService.register(
                    body.getName(),
                    body.getEmail(),
                    body.getPassword(),
                    "user"
            );

            authService.createUserProfile(user.getId(), user.getEmail(), user.getName());

            // 💡 CORREÇÃO: Adicionando o argumento idEmpresa
            String token = JwtUtil.generateToken(
                    String.valueOf(user.getId()),
                    user.getRole(),
                    user.getName(),
                    user.getEmail(),
                    user.getIdEmpresa() // <--- ARGUMENTO OBRIGATÓRIO AGORA
            );

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Usuário registrado com sucesso");
            response.put("user", user);
            response.put("token", token);

            res.type("application/json");
            return GsonUtil.getGson().toJson(response);

        } catch (Exception e) {
            res.status(400);
            res.type("application/json");
            return GsonUtil.getGson().toJson(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    };

    // CONSULTA PERFIL
    private final Route meRoute = (Request req, Response res) -> {
        try {
            String authHeader = req.headers("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                res.status(401);
                return GsonUtil.getGson().toJson(Map.of("success", false, "message", "Token não fornecido"));
            }

            String token = authHeader.substring(7);
            String userId = JwtUtil.getUserId(token);

            AuthUser user = authService.findById(userId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("user", user);

            res.type("application/json");
            return GsonUtil.getGson().toJson(response);

        } catch (Exception e) {
            res.status(500);
            return GsonUtil.getGson().toJson(Map.of("success", false, "message", e.getMessage()));
        }
    };

    // ATUALIZA PERFIL
    private final Route updateProfileRoute = (Request req, Response res) -> {
        try {
            String authHeader = req.headers("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                res.status(401);
                return GsonUtil.getGson().toJson(Map.of("success", false, "message", "Token não fornecido"));
            }

            String token = authHeader.substring(7);
            String userId = JwtUtil.getUserId(token);

            AuthUser updates = GsonUtil.getGson().fromJson(req.body(), AuthUser.class);
            AuthUser updatedUser = authService.updateUserProfile(userId, updates);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Perfil atualizado com sucesso");
            response.put("user", updatedUser);

            res.type("application/json");
            return GsonUtil.getGson().toJson(response);

        } catch (Exception e) {
            res.status(500);
            return GsonUtil.getGson().toJson(Map.of("success", false, "message", e.getMessage()));
        }
    };
}