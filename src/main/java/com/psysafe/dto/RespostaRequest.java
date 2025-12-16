package com.psysafe.dto;

public class RespostaRequest {

    private Integer idUsuario;
    private Integer idQuestionario;
    private Integer idPergunta;
    private String valor;

    public RespostaRequest() {}

    public RespostaRequest(Integer idUsuario, Integer idQuestionario, Integer idPergunta, String valor) {
        this.idUsuario = idUsuario;
        this.idQuestionario = idQuestionario;
        this.idPergunta = idPergunta;
        this.valor = valor;
    }

    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }

    public Integer getIdQuestionario() { return idQuestionario; }
    public void setIdQuestionario(Integer idQuestionario) { this.idQuestionario = idQuestionario; }

    public Integer getIdPergunta() { return idPergunta; }
    public void setIdPergunta(Integer idPergunta) { this.idPergunta = idPergunta; }

    public String getValor() { return valor; }
    public void setValor(String valor) { this.valor = valor; }
}
