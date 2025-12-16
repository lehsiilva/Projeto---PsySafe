package com.psysafe.dto;

public class RespostaDTO {
    private Integer id;
    private Integer agendamentoId;
    private Integer questionarioPerguntaId;
    private Integer valor; // valor numérico (ex: 1-5 no COPSOQ)
    private String textoPergunta; // opcional, útil no frontend

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getAgendamentoId() { return agendamentoId; }
    public void setAgendamentoId(Integer agendamentoId) { this.agendamentoId = agendamentoId; }

    public Integer getQuestionarioPerguntaId() { return questionarioPerguntaId; }
    public void setQuestionarioPerguntaId(Integer questionarioPerguntaId) { this.questionarioPerguntaId = questionarioPerguntaId; }

    public Integer getValor() { return valor; }
    public void setValor(Integer valor) { this.valor = valor; }

    public String getTextoPergunta() { return textoPergunta; }
    public void setTextoPergunta(String textoPergunta) { this.textoPergunta = textoPergunta; }
}
