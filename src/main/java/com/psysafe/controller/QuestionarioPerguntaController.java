package com.psysafe.controller;

import java.util.List;

import com.google.gson.Gson;
import com.psysafe.model.QuestionarioPergunta;
import com.psysafe.service.QuestionarioPerguntaService;

import static spark.Spark.get;
import static spark.Spark.post;

public class QuestionarioPerguntaController {

    private static QuestionarioPerguntaService service = new QuestionarioPerguntaService();
    private static Gson gson = new Gson();

    public static void routes() {
        String basePath = "/api/questionarioPerguntas";

        // POST - Criar nova pergunta de questionário
        post(basePath, (req, res) -> {
            res.type("application/json");
            QuestionarioPergunta qp = gson.fromJson(req.body(), QuestionarioPergunta.class);
            QuestionarioPergunta salva = service.createQuestionarioPergunta(qp);
            res.status(201);
            return gson.toJson(salva);
        });

        // GET - Listar todas
        get(basePath, (req, res) -> {
            res.type("application/json");
            List<QuestionarioPergunta> list = service.getAllQuestionarioPerguntas();
            return gson.toJson(list);
        });

        // GET - Listar por id do questionário
        get(basePath + "/questionario/:idQuestionario", (req, res) -> {
            res.type("application/json");
            int idQuestionario = Integer.parseInt(req.params(":idQuestionario"));
            List<QuestionarioPergunta> list = service.getQuestionarioPerguntasByQuestionarioId(idQuestionario);
            return gson.toJson(list);
        });
    }
}
