package com.psysafe.model;

public class QuestionarioPergunta {
    private Integer idQuestionarioPergunta; // corresponde ao RETURNING do banco
    private Integer idQuestionario;
    private Integer idPergunta;
    private Integer numPergunta;

    public Integer getIdQuestionarioPergunta() { return idQuestionarioPergunta; }
    public void setIdQuestionarioPergunta(Integer idQuestionarioPergunta) { this.idQuestionarioPergunta = idQuestionarioPergunta; }

    public Integer getIdQuestionario() { return idQuestionario; }
    public void setIdQuestionario(Integer idQuestionario) { this.idQuestionario = idQuestionario; }

    public Integer getIdPergunta() { return idPergunta; }
    public void setIdPergunta(Integer idPergunta) { this.idPergunta = idPergunta; }

    public Integer getNumPergunta() { return numPergunta; }
    public void setNumPergunta(Integer numPergunta) { this.numPergunta = numPergunta; }
}
