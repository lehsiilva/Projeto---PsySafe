package com.psysafe.service;

import java.util.List;

import com.psysafe.dao.PerguntaDAO;
import com.psysafe.model.Pergunta;

public class PerguntaService {

    private PerguntaDAO perguntaDAO = new PerguntaDAO();

    public Pergunta createPergunta(Pergunta p) {
        return perguntaDAO.save(p);
    }

    public List<Pergunta> getAllPerguntas() {
        return perguntaDAO.findAll();
    }

    public List<Pergunta> getPerguntasBySubescala(int idSubescala) {
        return perguntaDAO.findBySubescalaIdSubescalaOrderByNumero(idSubescala);
    }
}
