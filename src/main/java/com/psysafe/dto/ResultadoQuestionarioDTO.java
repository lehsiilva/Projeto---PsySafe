package com.psysafe.dto;

import java.util.Map;

public class ResultadoQuestionarioDTO {

    private Integer idUsuario;
    private Integer idQuestionario;
    private String versao;
    private Map<String, String> semaforoPorSubescala; // ex: {"Demandas": "verde", "Suporte": "amarelo"}
    private Map<String, String> recomendacoes; // ações geradas pela IA

    public ResultadoQuestionarioDTO() {}

    public ResultadoQuestionarioDTO(Integer idUsuario, Integer idQuestionario, String versao,
                                    Map<String, String> semaforoPorSubescala, Map<String, String> recomendacoes) {
        this.idUsuario = idUsuario;
        this.idQuestionario = idQuestionario;
        this.versao = versao;
        this.semaforoPorSubescala = semaforoPorSubescala;
        this.recomendacoes = recomendacoes;
    }

    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }

    public Integer getIdQuestionario() { return idQuestionario; }
    public void setIdQuestionario(Integer idQuestionario) { this.idQuestionario = idQuestionario; }

    public String getVersao() { return versao; }
    public void setVersao(String versao) { this.versao = versao; }

    public Map<String, String> getSemaforoPorSubescala() { return semaforoPorSubescala; }
    public void setSemaforoPorSubescala(Map<String, String> semaforoPorSubescala) { this.semaforoPorSubescala = semaforoPorSubescala; }

    public Map<String, String> getRecomendacoes() { return recomendacoes; }
    public void setRecomendacoes(Map<String, String> recomendacoes) { this.recomendacoes = recomendacoes; }
}
