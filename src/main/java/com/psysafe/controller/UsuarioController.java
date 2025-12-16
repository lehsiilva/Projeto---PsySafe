package com.psysafe.controller;

import com.psysafe.service.UsuarioService;
import com.psysafe.util.GsonUtil;
import spark.Request;
import spark.Response;
import spark.Route;

import java.util.Map;

import static spark.Spark.*;

public class UsuarioController {

    private UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
        setupRoutes();
    }

    public void setupRoutes() {
        path("/api/usuarios", () -> {
            get("", getAllUsers);
            get("/:id", getUserById);
        });
    }

    private Route getAllUsers = (Request req, Response res) -> {
        res.type("application/json");
        return GsonUtil.getGson().toJson(Map.of(
                "success", true,
                "usuarios", usuarioService.getAllUsers()
        ));
    };

    private Route getUserById = (Request req, Response res) -> {
        String id = req.params(":id");
        var user = usuarioService.getUserById(id);
        res.type("application/json");
        if (user == null) {
            res.status(404);
            return GsonUtil.getGson().toJson(Map.of(
                    "success", false,
                    "message", "Usuário não encontrado"
            ));
        }
        return GsonUtil.getGson().toJson(Map.of(
                "success", true,
                "usuario", user
        ));
    };
}
