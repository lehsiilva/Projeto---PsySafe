package com.psysafe.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.psysafe.model.AcaoCorretiva;
import com.psysafe.service.AcaoCorretivaService;
import spark.Request;
import spark.Response;

import java.time.LocalDateTime;

public class AcaoCorretivaController {
    private final AcaoCorretivaService service;
    private final Gson gson;

    public AcaoCorretivaController() {
        this.service = new AcaoCorretivaService();
        this.gson = new GsonBuilder()
            .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeAdapter())
            .setPrettyPrinting()
            .create();
    }

    public String gerarAcaoCorretiva(Request req, Response res) {
        res.type("application/json");

        try {
            // Parse request body
            JsonObject body = gson.fromJson(req.body(), JsonObject.class);
            String departamento = body.get("departamento").getAsString();
            String responsavel = body.get("responsavel").getAsString();

            // Gerar ação corretiva
            AcaoCorretiva acao = service.gerarECriarAcaoCorretiva(departamento, responsavel);

            res.status(200);
            return gson.toJson(acao);

        } catch (Exception e) {
            e.printStackTrace();
            res.status(500);
            return gson.toJson(new ErrorResponse("Erro ao gerar ação corretiva: " + e.getMessage()));
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