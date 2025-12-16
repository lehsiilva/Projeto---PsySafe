package com.psysafe.service;

import java.util.List;

import com.psysafe.dao.QuestionarioPerguntaDAO;
import com.psysafe.model.QuestionarioPergunta;

public class QuestionarioPerguntaService {

    private QuestionarioPerguntaDAO dao = new QuestionarioPerguntaDAO();

    // Criar nova pergunta de questionário
    public QuestionarioPergunta createQuestionarioPergunta(QuestionarioPergunta qp) {
        return dao.save(qp);
    }

    // Listar todas
    public List<QuestionarioPergunta> getAllQuestionarioPerguntas() {
        return dao.findAll();
    }

    // Listar por id do questionário
    public List<QuestionarioPergunta> getQuestionarioPerguntasByQuestionarioId(int questionarioId) {
        return dao.findByQuestionarioId(questionarioId);
    }
}
