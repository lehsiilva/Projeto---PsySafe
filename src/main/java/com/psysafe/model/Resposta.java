package com.psysafe.model;

import java.sql.Timestamp;

public class Resposta {
    
    private String id;                    // UUID da resposta
    private String usuarioId;             // ✅ CORRIGIDO: UUID do usuário (String)
    private Integer questionarioId;
    private Timestamp dataResposta;
    private Integer tempoGasto;
    
    // Construtores
    public Resposta() {
    }
    
    public Resposta(String id, String usuarioId, Integer questionarioId, 
                    Timestamp dataResposta, Integer tempoGasto) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.questionarioId = questionarioId;
        this.dataResposta = dataResposta;
        this.tempoGasto = tempoGasto;
    }
    
    // Getters e Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getUsuarioId() {  // ✅ CORRIGIDO: retorna String
        return usuarioId;
    }
    
    public void setUsuarioId(String usuarioId) {  // ✅ CORRIGIDO: aceita String
        this.usuarioId = usuarioId;
    }
    
    public Integer getQuestionarioId() {
        return questionarioId;
    }
    
    public void setQuestionarioId(Integer questionarioId) {
        this.questionarioId = questionarioId;
    }
    
    public Timestamp getDataResposta() {
        return dataResposta;
    }
    
    public void setDataResposta(Timestamp dataResposta) {
        this.dataResposta = dataResposta;
    }
    
    public Integer getTempoGasto() {
        return tempoGasto;
    }
    
    public void setTempoGasto(Integer tempoGasto) {
        this.tempoGasto = tempoGasto;
    }
    
    @Override
    public String toString() {
        return "Resposta{" +
                "id='" + id + '\'' +
                ", usuarioId='" + usuarioId + '\'' +
                ", questionarioId=" + questionarioId +
                ", dataResposta=" + dataResposta +
                ", tempoGasto=" + tempoGasto +
                '}';
    }
}