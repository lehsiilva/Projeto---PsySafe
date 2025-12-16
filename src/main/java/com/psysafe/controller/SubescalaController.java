package com.psysafe.controller;

import java.sql.SQLException;
import java.util.List;

import com.google.gson.Gson;
import com.psysafe.model.Subescala;
import com.psysafe.service.SubescalaService;

import static spark.Spark.get;
import static spark.Spark.post;

public class SubescalaController {

    private static final Gson gson = new Gson();
    private static final SubescalaService service = new SubescalaService();

    // Método público para registrar as rotas
    public static void routes() {
        String basePath = "/api/subescala";

        // GET todas as subescalas
        get(basePath, (req, res) -> {
            try {
                List<Subescala> subescalas = service.getAllSubescalas();
                res.status(200);
                res.type("application/json");
                return gson.toJson(subescalas);
            } catch (SQLException e) {
                res.status(500);
                return gson.toJson("Erro ao buscar subescalas: " + e.getMessage());
            }
        });

        // POST criar uma nova subescala
        post(basePath, (req, res) -> {
            try {
                Subescala s = gson.fromJson(req.body(), Subescala.class);
                Subescala criado = service.createSubescala(s);
                res.status(201);
                res.type("application/json");
                return gson.toJson(criado);
            } catch (SQLException e) {
                res.status(500);
                return gson.toJson("Erro ao criar subescala: " + e.getMessage());
            }
        });
    }
}
