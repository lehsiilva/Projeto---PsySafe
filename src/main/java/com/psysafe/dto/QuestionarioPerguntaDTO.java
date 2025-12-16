package com.psysafe.dto;

public class QuestionarioPerguntaDTO {
    private Integer id;
    private Integer questionarioId;
    private PerguntaDTO pergunta; // referência à pergunta completa
    private Integer numPergunta;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getQuestionarioId() { return questionarioId; }
    public void setQuestionarioId(Integer questionarioId) { this.questionarioId = questionarioId; }

    public PerguntaDTO getPergunta() { return pergunta; }
    public void setPergunta(PerguntaDTO pergunta) { this.pergunta = pergunta; }

    public Integer getNumPergunta() { return numPergunta; }
    public void setNumPergunta(Integer numPergunta) { this.numPergunta = numPergunta; }
}
