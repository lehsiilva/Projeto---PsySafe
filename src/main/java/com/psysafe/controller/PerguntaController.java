package com.psysafe.controller;

import java.util.List;

import com.google.gson.Gson;
import com.psysafe.model.Pergunta;
import com.psysafe.service.PerguntaService;

import static spark.Spark.get;
import static spark.Spark.post;

public class PerguntaController {

    private static PerguntaService service = new PerguntaService();
    private static Gson gson = new Gson();

    public static void routes() {
        String basePath = "/api/perguntas";

        // POST - Criar nova pergunta
        post(basePath, (req, res) -> {
            res.type("application/json");
            Pergunta nova = gson.fromJson(req.body(), Pergunta.class);
            Pergunta salva = service.createPergunta(nova);
            res.status(201);
            return gson.toJson(salva);
        });

        // GET - Listar todas as perguntas
        get(basePath, (req, res) -> {
            res.type("application/json");
            List<Pergunta> perguntas = service.getAllPerguntas();
            return gson.toJson(perguntas);
        });

        // GET - Listar perguntas por subescala
        get(basePath + "/subescala/:idSubescala", (req, res) -> {
            res.type("application/json");
            int idSubescala = Integer.parseInt(req.params(":idSubescala"));
            List<Pergunta> perguntas = service.getPerguntasBySubescala(idSubescala);
            return gson.toJson(perguntas);
        });
    }
}
